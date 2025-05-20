import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../constants/theme';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { useMyContextController } from '../store';
import { Colors, useThemeColors } from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

const BookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [controller] = useMyContextController();
  const { uid } = controller;
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode

  useEffect(() => {
    let unsubscribe;

    const fetchBookings = () => {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('uid', '==', uid),
        orderBy('create', 'desc')
      );
      unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
        const bookingsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const today = new Date(); // Ngày hiện tại

        // Kiểm tra và cập nhật trạng thái nếu cần
        bookingsList.forEach(async (booking) => {
          const bookingDate = new Date(booking.create); // Chuyển ngày của vé thành đối tượng Date
          
          if (booking.state === 0 && bookingDate < today) {
            // Nếu vé chưa thanh toán và ngày đã qua thì cập nhật state thành 3
            const bookingRef = doc(db, 'bookings', booking.id);
            await updateDoc(bookingRef, { state: 3 });
            console.log(`Booking ${booking.id} updated to state 3 (Expired)`);
          }
        });

        setBookings(bookingsList);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching bookings: ', error);
        setLoading(false);
      });
    };

    if (uid) {
      setLoading(true);
      fetchBookings();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [uid]);

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY HH:ss'); // Định dạng ngày theo định dạng dd/mm/yyyy
  };
  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.bookingItem, { backgroundColor: colors.bgBlack2 }]}
      onPress={() => navigation.navigate('TicketScreen', { ticketData: item })}
    >
      <View style={styles.bookingInfo}>
        <Text style={[styles.title,{color:colors.white}]}>ID: {item.id.substring(0, 5)}</Text>
        <Text style={[styles.subtitle,{color:colors.white}]}>Ngày đặt: {formatDate(item.create.toDate())}</Text>
      </View>
      <View style={styles.bookingDetails}>
        <Text style={[styles.totalPrice,{color:colors.white}]}>{item.totalPrice}.000,00 VNĐ</Text>
        <Text style={[styles.status, {color: item.state === 0 ? Colors.yellow : item.state === 1 ? Colors.green : item.state === 3 ? Colors.red : Colors.gray}]}>
          {item.state === 0 ? 'Chưa thanh toán' : item.state === 1 ? 'Đã thanh toán' : item.state === 3 ? 'Đã hết hạn' : 'Đã hủy'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container,{backgroundColor:colors.bgBlack}]}>
      <Text style={[styles.title, {color: colors.white, textAlign:'center'}]}>Lịch sử đặt vé</Text>
      {uid === null ? (
        <Text style={[styles.emptyMessage,{color:colors.white}]}>
          Vui lòng đăng nhập
        </Text>
      ) : loading ? (
        <ActivityIndicator size="large" color={COLORS.Orange} style={styles.loadingIndicator} />
      ) : bookings.length === 0 ? (
        <Text style={[styles.emptyMessage,{color:colors.white}]}>Không có vé nào.</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.bookingList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12
  },
  bookingItem: {
    borderRadius: 15,
    padding: SPACING.space_20,
    marginVertical: SPACING.space_10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingInfo: {
    flex: 1,
    paddingRight: SPACING.space_10,
  },
  bookingDetails: {
    alignItems: 'flex-end',
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
  },
  totalPrice: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_16,
  },
  status: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
    marginTop: SPACING.space_5,
  },
  bookingList: {
    paddingBottom: SPACING.space_20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    color: COLORS.White,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    textAlign: 'center',
    marginTop: SPACING.space_20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default BookingsScreen;

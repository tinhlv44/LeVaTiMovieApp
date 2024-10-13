import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../constants/theme';
import AppHeader from '../components/AppHeader';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useMyContextController } from '../store';
import { Colors } from '../constants/Colors';

const BookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [controller] = useMyContextController();
  const { uid } = controller;

  useEffect(() => {
    let unsubscribe;

    const fetchBookings = () => {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('uid', '==', uid)
      );

      unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
        const bookingsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return COLORS.Yellow; // Chưa thanh toán
      case 1:
        return COLORS.LightGreen; // Đã thanh toán
      case 2:
        return COLORS.LightGray; // Đã hủy
      default:
        return COLORS.Orange; // Mặc định
    }
  };

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.bookingItem, { backgroundColor: 
        //getStatusColor(item.state) 
        "#15161b"
    }]}
      onPress={() => navigation.navigate('TicketScreen', { ticketData: item })}
    >
      <View style={styles.bookingInfo}>
        <Text style={styles.title}>{item.movieId}</Text>
        <Text style={styles.subtitle}>Date: {item.date}</Text>
        <Text style={styles.subtitle}>Time: {item.time}</Text>
      </View>
      <View style={styles.bookingDetails}>
        <Text style={styles.totalPrice}>${item.totalPrice}k VNĐ</Text>
        <Text style={[styles.status, {color: item.state === 0 ? Colors.yellow : item.state === 1 ? Colors.green : Colors.red}]}>
          {item.state === 0 ? 'Chưa thanh toán' : item.state === 1 ? 'Đã thanh toán' : 'Đã hủy'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader name="close" header="My Bookings" action={() => navigation.goBack()} />
      {uid === null ? (
        <Text style={styles.emptyMessage}>Please Login</Text>
      ) : loading ? (
        <ActivityIndicator size="large" color={COLORS.Orange} style={styles.loadingIndicator} />
      ) : bookings.length === 0 ? (
        <Text style={styles.emptyMessage}>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.bookingList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
    padding: SPACING.space_20,
  },
  bookingItem: {
    borderRadius: 15,
    padding: SPACING.space_20,
    marginVertical: SPACING.space_10,
    flexDirection: 'row', // Đặt hàng ngang cho phần tử
    justifyContent: 'space-between', // Căn giữa giữa hai bên
    alignItems: 'center', // Căn giữa theo chiều dọc
  },
  bookingInfo: {
    flex: 1, // Chiếm không gian bên trái
    paddingRight: SPACING.space_10, // Khoảng cách bên phải
  },
  bookingDetails: {
    alignItems: 'flex-end', // Căn phải cho thông tin bên phải
  },
  title: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.White,
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  totalPrice: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
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
});

export default BookingsScreen;

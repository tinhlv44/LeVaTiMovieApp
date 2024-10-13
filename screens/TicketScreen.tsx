import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../constants/theme';
import CustomIcon from '../components/CustomIcon';
import QRCode from 'react-native-qrcode-svg'; // Import thư viện QR Code
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { img500 } from '../api/moviedb';

const TicketScreen = ({ navigation, route }) => {
  const [ticketData, setTicketData] = useState(route.params?.ticketData || {});
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieId = ticketData?.movieId;
        if (movieId) {
          const moviesRef = collection(db, 'movies');
          const q = query(moviesRef, where('id', '==', movieId));
          const querySnapshot = await getDocs(q);
  
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const movieData = doc.data();
              setMovie(movieData);
            });
          } else {
            console.error("No movie found with the given idmovie");
          }
        } else {
          console.error("idmovie is missing from ticketData");
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [ticketData]);

  if (!ticketData || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.Orange} />
      </View>
    );
  }

  return (
    <ScrollView>

    <View style={styles.container}>
      <View style={styles.ticketContainer}>
        <ImageBackground
          source={{ uri: img500(movie.poster_path ) }}
          style={styles.ticketBGImage}
        >
          <LinearGradient colors={[COLORS.OrangeRGBA0, COLORS.Orange]} style={styles.linearGradient}>
            <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, left: -40 }]}></View>
            <View style={[styles.blackCircle, { position: 'absolute', bottom: -40, right: -40 }]}></View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.linear}></View>

        <View style={styles.ticketFooter}>
          <View style={[styles.blackCircle, { position: 'absolute', top: -40, left: -40 }]}></View>
          <View style={[styles.blackCircle, { position: 'absolute', top: -40, right: -40 }]}></View>

          <View style={styles.ticketDateContainer}>
            <View style={styles.subtitleContainer}>
              <Text style={styles.dateTitle}>{ticketData?.date}</Text>
              <Text style={styles.subtitle}>{ticketData?.day}</Text>
            </View>
            <View style={[styles.subtitleContainer, { flexDirection: 'row' }]}>
              <CustomIcon name="clock" style={styles.clockIcon} type='Feather' />
              <Text style={styles.subtitle}>{ticketData?.time}</Text>
            </View>
          </View>
          <Text style={styles.text}>{movie.title}</Text>
          <View style={styles.ticketSeatContainer}>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subheading}>Hall</Text>
              <Text style={styles.subtitle}>{ticketData?.cinemaId}</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subheading}>Seats</Text>
              <Text style={styles.subtitle}>
                {ticketData?.seats.join(', ')}
              </Text>
            </View>
          </View>

          {/* Hiển thị mã QR */}
          <QRCode
            value={`Movie: ${ticketData?.movieId}, Seats: ${ticketData?.seats.join(', ')}, State: ${ticketData?.state}`}
            size={150} // Kích thước mã QR
            color="black"
            backgroundColor="white"
          />

          <TouchableOpacity style={styles.shareButton}>
            <CustomIcon name="payment" style={styles.shareIcon} />
            <Text style={styles.shareText}>Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.Black,
  },
  ticketContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketBGImage: {
    width: 300,
    aspectRatio: 200 / 300,
    borderTopLeftRadius: BORDERRADIUS.radius_25,
    borderTopRightRadius: BORDERRADIUS.radius_25,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  linearGradient: {
    height: '50%',
  },
  linear: {
    borderTopColor: COLORS.Black,
    borderTopWidth: 3,
    width: 300,
    backgroundColor: COLORS.Orange,
    borderStyle: 'dashed',
  },
  ticketFooter: {
    backgroundColor: COLORS.Orange,
    width: 300,
    alignItems: 'center',
    paddingBottom: SPACING.space_36,
    borderBottomLeftRadius: BORDERRADIUS.radius_25,
    borderBottomRightRadius: BORDERRADIUS.radius_25,
    paddingTop: SPACING.space_20,
  },
  ticketDateContainer: {
    flexDirection: 'row',
    gap: SPACING.space_36,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: SPACING.space_10,
  },
  ticketSeatContainer: {
    flexDirection: 'row',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.space_10,
  },
  dateTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
    textAlign: 'center',
  },
  subheading: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.White,
    textAlign: 'center',
  },
  subtitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    paddingRight: SPACING.space_8,
  },
  blackCircle: {
    height: 80,
    width: 80,
    backgroundColor: COLORS.Black,
    borderRadius: 40,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.White,
    borderRadius: BORDERRADIUS.radius_25,
    padding: SPACING.space_10,
    marginTop: SPACING.space_20,
  },
  shareIcon: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.Black,
    marginRight: SPACING.space_8,
  },
  shareText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.Black,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default TicketScreen;

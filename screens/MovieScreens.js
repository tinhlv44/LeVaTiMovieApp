import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
//import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "../constants/Colors";
import MovieList from "../components/movieList";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/cast";
import Loading from "../components/loading";
import { fallcallImageMovie, fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, img500 } from "../api/moviedb";
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../constants/theme";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS == "android";
const topMargin = ios ? 36 : 0;

export default function MovieScreen() {
  const navigation = useNavigation();
  const { params: item } = useRoute();
  const [movie, setMovie] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [cast, setCast] = useState([]);
  const [similarMovie, setSimilarMovie] = useState([]);
  const [loading, setLoanging] = useState(true);
  useEffect(() => {
    //Lấy api chi tiết phim
    setLoanging(true);
    getMoviesDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
  }, [item]);
  const getMoviesDetails = async id => {
    const data = await fetchMovieDetails(id);
    if (data) setMovie(data);
    setLoanging(false);
  };

  const getMovieCredits = async id => {
    const data = await fetchMovieCredits(id);
    if (data && data.cast) setCast(data.cast);
    setLoanging(false);
  };
  const getSimilarMovies = async id => {
    const data = await fetchSimilarMovies(id);
    if (data && data.results) setSimilarMovie(data.results);
    setLoanging(false);
  };
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      style={styles.container}
      key={item.id}
    >
      {/* Nút trở lại */}
      <SafeAreaView style={styles.viewSafe}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => setIsFavourite(!isFavourite)}
        >
          <AntDesign
            name="heart"
            size={32}
            color={isFavourite ? Colors.heart : "white"}
          />
        </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.header}>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{
                // uri: "https://th.bing.com/th/id/OIP.DXi-IO1zd9_je9x1go-HqAHaKk?w=185&h=264&c=7&r=0&o=5&pid=1.7",
                uri: img500(movie?.poster_path) || fallcallImageMovie
              }}
              style={{
                width,
                height: height * 0.4,
              }}
            />
            <LinearGradient
              colors={[
                "transparent",
                "rgba(48, 48, 48, 0.8)",
                "rgba(48, 48, 48, 1)",
              ]}
              style={{
                width: width,
                height: height * 0.3,
                position: "absolute",
                bottom: 0,
              }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
        )}
      </View>
      {/* Chi tiết phim */}
      <View>
        {/* Ten phim */}
        <Text style={styles.name}>{movie?.title}</Text>
        {/* Ngày phát hành - trang thái - thời gian chiếu */}
        {
          movie?.id ? (
            <Text style={styles.textDetail}>
              {movie?.status} - {movie?.release_date.split('-')[0]} - {movie?.runtime} min
            </Text>
          ) : (null)
        }
        <View style={styles.genres}>
          {
            movie?.genres?.map((genne, index) =>{   
              let lastGenne = index+1 != movie.genres.length
              return(
                <Text key={index} style={styles.textDetail}>{genne?.name} {lastGenne && '-'} </Text>
              )           
            })
          }
        </View>
      </View>
      {/* Mô tả phim */}
      <Text style={styles.textDescription}>
       {movie?.overview}
      </Text>

      <View>
          <TouchableOpacity
            style={styles.buttonBG}
            onPress={() => {
              navigation.push('SeatBooking', {
                BgImage: img500(movie?.backdrop_path) || fallcallImageMovie,
                PosterImage: img500(movie?.poster_path) || fallcallImageMovie,
              });
            }}>
            <Text style={styles.buttonText}>Select Seats</Text>
          </TouchableOpacity>
        </View>
      {/* Diễn viên */}

      <Cast navigation={navigation} cast={cast} />
      {/* Phim tương tự */}
      {
        similarMovie.length > 0 && (
          <MovieList title="Phim liên quan" hideSeeAll={true} data={similarMovie}/>
        )
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBlack,
  },
  viewSafe: {
    position: "absolute",
    zIndex: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  header: {
    width: "100%",
  },
  btnBack: {
    padding: 1,
  },
  name: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: 0.05,
  },
  genres: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 4,
    paddingHorizontal: 2,
  },
  textDetail: {
    color: "rgb(163 163 163)",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  textDescription: {
    color: "rgb(163 163 163)",
    letterSpacing: 0.05,
    paddingHorizontal: 16,
  },
  // add ts
  buttonBG: {
    alignItems: 'center',
    marginVertical: SPACING.space_24,
  },
  buttonText: {
    borderRadius: BORDERRADIUS.radius_25 * 2,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    backgroundColor: COLORS.Orange,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
});

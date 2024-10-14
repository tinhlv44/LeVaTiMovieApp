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
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors, useThemeColors } from "../constants/Colors";
import MovieList from "../components/movieList";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/cast";
import Loading from "../components/loading";
import {
  fallcallImageMovie,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  img500,
} from "../api/moviedb";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../constants/theme";
import { db } from "../firebaseConfig"; // Import Firestore from your config
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  arrayRemove,
} from "firebase/firestore"; // Import Firestore methods
import { useMyContextController } from "../store";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS === "android";
const topMargin = ios ? 36 : 0;

export default function MovieScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const [movie, setMovie] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [cast, setCast] = useState([]);
  const [similarMovie, setSimilarMovie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);

  const [controller, dispatch] = useMyContextController();
  const { uid } = controller;

  const colors = useThemeColors(); // Lấy màu dựa trên darkMode
  useEffect(() => {
    checkFavoriteStatus();
  }, [controller]);
  useEffect(() => {
    checkFavoriteStatus();
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: movie.title || "Movie Details",
      headerRight: () => (
        <TouchableOpacity
          style={styles.btnBack}
          onPress={async () => await handleFavorite()}
        >
          <AntDesign
            name="heart"
            size={32}
            color={isFavourite ? Colors.heart : "white"}
          />
        </TouchableOpacity>
      ),
    });
  }, [movie, isFavourite]);

  useEffect(() => {
    setLoading(true);

    // Kiểm tra xem params.item có phải là một đối tượng hay không
    if (params.item) {
      // Nếu có item, sử dụng trực tiếp
      setId(params.item.id);
      setMovie(params.item);
      getMovieCredits(params.item.id);
      getSimilarMovies(params.item.id);
    } else if (params.id) {
      // Nếu chỉ có id, fetch dữ liệu từ Firestore
      setId(params.id);
      getMoviesDetails(params.id);
      getMovieCredits(params.id);
      getSimilarMovies(params.id);
    }
  }, [params]);
  const getMoviesDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    if (data) {
      setMovie(data);
      //saveMovieToFirestore(data); // Save movie to Firestore
    }
    setLoading(false);
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data && data.cast) setCast(data.cast);
    setLoading(false);
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data && data.results) setSimilarMovie(data.results);
    setLoading(false);
  };

  // Function to save movie to Firestore
  const saveMovieToFirestore = async (movieData) => {
    try {
      if (!movieData.adult) {
        // Filter out adult movies
        const movieCollection = collection(db, "movies");
        const movieExists = await checkMovieExists(movieData.id);

        if (!movieExists) {
          await addDoc(movieCollection, {
            id: movieData.id,
            title: movieData.title,
            overview: movieData.overview,
            release_date: movieData.release_date,
            genres: movieData.genres.map((g) => g.name),
            poster_path: movieData.poster_path,
            backdrop_path: movieData.backdrop_path,
            runtime: movieData.runtime,
            status: movieData.status,
          });
        }
      }
    } catch (error) {
      console.error("Error adding movie to Firestore:", error);
    }
  };

  // Function to check if movie already exists in Firestore
  const checkMovieExists = async (movieId) => {
    const movieCollection = collection(db, "movies");
    const querySnapshot = await getDocs(movieCollection);
    return querySnapshot.docs.some((doc) => doc.data().id === movieId);
  };

  const checkIsFav = async () => {
    try {
      const docRef = doc(db, "favorites", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const movies = docSnap.data().movies || [];
        return movies.includes(id); // Trả về true nếu movieId đã có trong danh sách yêu thích
      }

      return false; // Trả về false nếu không có dữ liệu yêu thích
    } catch (e) {
      console.log("Error checking favorite status: ", e);
      return false; // Trả về false trong trường hợp lỗi
    }
  };
  const checkFavoriteStatus = async () => {
    if (!uid) return;
    const isFav = await checkIsFav(); // Gọi hàm checkIsFav để kiểm tra
    setIsFavourite(isFav); // Cập nhật trạng thái yêu thích
  };

  // Hàm xử lý yêu thích (đã có từ trước)
  const handleFavorite = async () => {
    try {
      if (!uid) {
        ToastAndroid.show("Please Login", ToastAndroid.LONG);
        return;
      }

      setIsFavourite(!isFavourite);

      // Tham chiếu đến tài liệu dựa trên uid
      const docRef = doc(db, "favorites", uid);

      // Lấy tài liệu để kiểm tra xem có tồn tại mảng movies hay không
      const docSnap = await getDoc(docRef);

      // Tạo tài liệu với mảng movies nếu không tồn tại
      if (!docSnap.exists()) {
        await setDoc(docRef, { movies: [] });
      }

      if (isFavourite) {
        // Nếu đã yêu thích, thì xoá
        await updateDoc(docRef, {
          movies: arrayRemove(id), // Xoá movieId khỏi mảng
        });
        ToastAndroid.show("Movie removed from favorites", ToastAndroid.LONG);
      } else {
        // Nếu chưa yêu thích, thì thêm
        await updateDoc(docRef, {
          movies: arrayUnion(id), // Thêm movieId vào mảng
        });
        ToastAndroid.show("Movie added to favorites", ToastAndroid.LONG);
      }
    } catch (e) {
      ToastAndroid.show(
        "Error adding movie to favorites: " + e.message,
        ToastAndroid.LONG
      );
      console.log("Error adding movie to favorites: ", e);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      style={[styles.container,{backgroundColor:colors.bgBlack}]}
      key={id}
    >
      <View style={styles.header}>
        {loading ? (
          <Loading />
        ) : (
          <View style={{ position: "relative" }}>
            {/* Image */}
            <Image
              source={{
                uri: img500(movie?.poster_path) || fallcallImageMovie,
              }}
              style={{
                width,
                height: height * 0.54,
              }}
            />

            {/* Top Gradient Overlay */}
            <LinearGradient
              colors={[
                "rgba(48, 48, 48, 0.5)", // Solid color on top
                "transparent", // Fades to transparent
              ]}
              style={styles.gradientTop}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />

            {/* Bottom Gradient Overlay */}
            <LinearGradient
              colors={[
                "transparent", // Transparent at the top
                colors.bgBlackRBG, // Solid color at the bottom
              ]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </View>
        )}
      </View>

      <View style={[styles.detailsContainer, ,{backgroundColor:colors.bgBlack}]}>
        {/* Movie title */}
        <Text style={[styles.name, {color:colors.white}]}>{movie?.title}</Text>
        {/* Release date, status, runtime */}
        {movie?.id && (
          <Text style={styles.textDetail}>
            {movie?.status} - {movie?.release_date.split("-")[0]} -{" "}
            {movie?.runtime} min
          </Text>
        )}
        <View style={styles.genres}>
          {movie?.genres?.map((genne, index) => {
            let lastGenne = index + 1 !== movie.genres.length;
            return (
              <Text key={index} style={styles.textDetail}>
                {genne?.name} {lastGenne && "-"}
              </Text>
            );
          })}
        </View>
        {/* Movie description */}
        <Text style={styles.textDescription}>{movie?.overview}</Text>

        <TouchableOpacity
          style={styles.buttonBG}
          onPress={() => {
            //console.log(uid)
            if (uid === null) {
              navigation.navigate("Login");
            } else {
              navigation.push("SeatBooking", {
                BgImage: img500(movie?.backdrop_path) || fallcallImageMovie,
                PosterImage: img500(movie?.poster_path) || fallcallImageMovie,
                id: movie?.id,
                title: movie?.title,
              });
            }
          }}
        >
          <Text style={styles.buttonText}>Booking Movie</Text>
        </TouchableOpacity>
      </View>

      {/* Cast */}
      <Cast navigation={navigation} cast={cast} />
      {/* Similar movies */}
      {similarMovie.length > 0 && (
        <MovieList
          title="Related Movies"
          hideSeeAll={true}
          data={similarMovie}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
  },
  gradient: {
    width: "100%",
    height: height * 0.3,
    position: "absolute",
    bottom: 0,
  },
  gradientTop: {
    width: "100%",
    height: height * 0.2,
    position: "absolute",
    top: 0,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  btnBack: {
    padding: 8,
  },
  name: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0.05,
    marginBottom: SPACING.space_8,
  },
  genres: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: SPACING.space_4,
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
    marginVertical: SPACING.space_16,
    textAlign: "justify",
  },
  buttonBG: {
    alignItems: "center",
    marginVertical: SPACING.space_10,
  },
  buttonText: {
    borderRadius: BORDERRADIUS.radius_4,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    backgroundColor: COLORS.Orange,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
    fontWeight: '600'
  },
});

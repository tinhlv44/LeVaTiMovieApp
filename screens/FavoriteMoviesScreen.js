import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/loading";
import { Colors, useThemeColors } from "../constants/Colors";
import { fallcallImageMovie, img342 } from "../api/moviedb";
import { onSnapshot, doc, collection, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Giả định bạn đã cấu hình Firebase Firestore
import { useMyContextController } from "../store";

const { width, height } = Dimensions.get("window");

export default function FavoriteMoviesScreen() {
  const navigation = useNavigation();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [controller] = useMyContextController();
  const { uid } = controller;

  const colors = useThemeColors(); // Lấy màu dựa trên darkMode
  useEffect(() => {
    if (uid) {
      // Sử dụng onSnapshot để theo dõi thay đổi dữ liệu theo thời gian thực
      const favDocRef = doc(db, 'favorites', uid);
      const unsubscribe = onSnapshot(favDocRef, async (favDocSnap) => {
        if (favDocSnap.exists()) {
          const favData = favDocSnap.data();
          const movieIds = favData.movies || [];

          if (movieIds.length > 0) {
            const moviesRef = collection(db, 'movies');
            const q = query(moviesRef, where('id', 'in', movieIds));

            // Theo dõi thay đổi thời gian thực cho bộ phim
            onSnapshot(q, (movieDocs) => {
              const movies = movieDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setFavoriteMovies(movies);
              setLoading(false); // Tắt trạng thái loading
            });
          } else {
            setFavoriteMovies([]);
            setLoading(false);
          }
        } else {
          setFavoriteMovies([]);
          setLoading(false);
        }
      });

      return () => unsubscribe(); // Hủy lắng nghe khi component unmount
    }
  }, [uid]);

  return (
    <SafeAreaView style={[styles.safeView, {backgroundColor:colors.bgBlack}]}>
      {loading ? (
        <Loading />
      ) : favoriteMovies.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          <Text style={[styles.text, {color: colors.white}]}>
            Danh sách yêu thích ({favoriteMovies.length})
          </Text>
          <View style={styles.results}>
            {favoriteMovies.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate("Movie", item)}
                >
                  <View style={styles.result}>
                    <Image
                      source={{
                        uri: img342(item.poster_path) || fallcallImageMovie,
                      }}
                      style={styles.image}
                    />
                    <Text style={styles.name}>
                      {item.title.length > 22
                        ? item.title.slice(0, 22) + "..."
                        : item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noResult}>
          <Text style={[styles.text, {color: colors.white}]}>Không có phim được yêu thích nào!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// Thiết lập styles
const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    paddingTop: 40,
  },
  scrollView: {
    padding: 12,
    paddingBottom: 15,
  },
  text: {
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 10,
    fontWeight:'600'
  },
  results: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  result: {
    width: width * 0.44, // Chiều rộng mỗi item
    marginBottom: 16,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: height * 0.3,
    borderRadius: 10,
  },
  name: {
    color: Colors.textn300,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  noResult: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 50,
  },
});


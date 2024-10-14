import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors, useThemeColors } from "../constants/Colors";
import Logo from "../components/Logo";
import TrendingMovie from "../components/trendingMovie";
import MovieList from "../components/movieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/loading";
import {
  fetchTopRatedMovies,
  fetchTrenddingMovies,
  fetchUpcomingMovies,
} from "../api/moviedb";
import { collection, getDocs } from "firebase/firestore"; // Firestore imports
import { db } from "../firebaseConfig"; // Firestore config

const ios = Platform.OS == "android";

export default function HomeScreens() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpComing] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [firebaseMovies, setFirebaseMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode

  useEffect(() => {
    setLoading(true);
    fetchFirebaseMovies();  // Fetch Firestore data first
  }, []);

  useEffect(() => {
    if (firebaseMovies.length > 0) {
      // Fetch movies from API after getting Firestore data
      getTrendingMovies();
      getUpcomingMovies();
      getTopRatedMovies();
    }
  }, [firebaseMovies]);

  // Fetch movie data from Firestore
  const fetchFirebaseMovies = async () => {
    try {
      const moviesCollection = collection(db, "movies");
      const movieSnapshot = await getDocs(moviesCollection);
      const movieList = movieSnapshot.docs.map(doc => doc.data().id); // Get movie IDs
      setFirebaseMovies(movieList);
    } catch (error) {
      console.error("Error fetching movies from Firestore:", error);
    }
  };

  const getTrendingMovies = async () => {
    const data = await fetchTrenddingMovies();
    if (data && data.results) {
      const filteredMovies = data.results.filter(movie => firebaseMovies.includes(movie.id));
      setTrending(filteredMovies);
    }
    setLoading(false);
  };

  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    if (data && data.results) {
      const filteredMovies = data.results.filter(movie => firebaseMovies.includes(movie.id));
      setUpComing(filteredMovies);
    }
  };

  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    if (data && data.results) {
      const filteredMovies = data.results.filter(movie => firebaseMovies.includes(movie.id));
      setTopRated(filteredMovies);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor:colors.bgBlack}]}>
      <SafeAreaView style={styles.viewSafe}>
        <View style={styles.barMenu}>
          {/* <FontAwesome5 name="bars" size={24} color="white" /> */}
          <Logo />
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <FontAwesome5 name="search" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {/* Trending Movies */}
          <TrendingMovie data={trending} />

          {/* Upcoming Movies */}
          <MovieList title={"Sắp đến"} data={upcoming} onPress={() => {navigation.navigate("ListMovie", {title: "Sắp đến", data:upcoming})}}/>

          {/* Top Rated Movies */}
          <MovieList title={"Nổi bật"} data={topRated} onPress={() => {navigation.navigate("ListMovie", {title: "Nổi bật", data:topRated})}}/>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewSafe: {
    paddingVertical: 15,
  },
  barMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
});


// import React, { useEffect, useState } from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Platform,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// //import FontAwesome from '@expo/vector-icons/FontAwesome';
// import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
// import { Colors } from "../constants/Colors";
// import Logo from "../components/Logo";
// import TrendingMovie from "../components/trendingMovie";
// import MovieList from "../components/movieList";
// import { useNavigation } from "@react-navigation/native";
// import Loading from "../components/loading";
// import {
//   fetchTopRatedMovies,
//   fetchTrenddingMovies,
//   fetchUpcomingMovies,
// } from "../api/moviedb";
// import {  createShowtimesForNextWeek, getShowtimesForNext7Days } from "../test";
// const ios = Platform.OS == "android";
// let currentHeightStatusBar = 24; //StatusBar.currentHeight;

// export default function HomeScreens() {
//   const [trending, setTrending] = useState([]);
//   const [upcoming, setUpComing] = useState([]);
//   const [topRated, setTopRated] = useState([]);
//   const [loading, setLoanging] = useState(true);
//   const navigation = useNavigation();
  

//   useEffect(() => {
//     //createShowtimesForNextWeek();   
//     //getShowtimesForNext7Days()
//     setLoanging(true);
//     getTrendingMovies(); 
//     getUpcomingMovies();
//     getTopRatedMovies();
//   }, []);

//   const getTrendingMovies = async () => {
//     const data = await fetchTrenddingMovies();
//     if (data && data.results) setTrending(data.results);
//     setLoanging(false);
//   };
//   const getUpcomingMovies = async () => {
//     const data = await fetchUpcomingMovies();
//     if (data && data.results) setUpComing(data.results);
//   };
//   const getTopRatedMovies = async () => {
//     const data = await fetchTopRatedMovies();
//     if (data && data.results) setTopRated(data.results);
//   };
//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.viewSafe}>
//         <View style={styles.barMenu}>
//           {/* <FontAwesome5 name="bars" size={24} color="white" /> */}
//           <Logo />
//           <TouchableOpacity onPress={() => navigation.navigate("Search")}>
//             <FontAwesome5 name="search" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//       {loading ? (
//         <Loading />
//       ) : (
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 10 }}
//         >
//           {/* Trending Movie */}
//           <TrendingMovie data={trending} />

//           {/* {upcoming movies row} */}

//           <MovieList title={"Sắp đến"} data={upcoming} onPress={() => {navigation.navigate("ListMovie", {title: "Sắp đến", data:upcoming})}}/>

//           {/* {Top Ratting Movie} */}

//           <MovieList title={"Nổi bật"} data={topRated} />
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.bgBlack,
//   },
//   viewSafe: {
//     //paddingTop: currentHeightStatusBar + 6,
//     paddingVertical: 15,
//   },
//   barMenu: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginHorizontal: 16,
//   },
//   logoStyleL: {
//     color: "white",
//     size: "20",
//     fontWeight: "800",
//   },
// });






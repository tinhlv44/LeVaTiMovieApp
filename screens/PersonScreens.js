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
import {SafeAreaView} from 'react-native-safe-area-context'
//import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors, useThemeColors } from "../constants/Colors";
import MovieList from "../components/movieList";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/cast";
import Loading from "../components/loading";
import { fallcallImageCast, fetchMovieCredits, fetchPersonDetails, fetchPersonMovies, img342, img500 } from "../api/moviedb";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS == "android";
const topMargin = ios ? 36 : 0;

export default function PersonScreens() {
  const navigation = useNavigation();
  const { params: item } = useRoute();
  const [isFavourite, setIsFavourite] = useState(false);
  const [personMovie, setPersonMovie] = useState([]);
  const [person, setPerson] = useState([]);
  const [loading, setLoanging] = useState(false);
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode

  useEffect(() => {
    //Lấy api chi tiết phim
    setLoanging(true);
    getMoviesDetails(item.id);
    getPersonMovies(item.id);
    navigation.setOptions({
      headerTitle: person?.name || "Cast Details",
    })
  }, [item]);
  const getMoviesDetails = async id => {
    const data = await fetchPersonDetails(id);
    if (data) setPerson(data);
    setLoanging(false);
  };
  
  const getPersonMovies = async id => {
    const data = await fetchPersonMovies(id);
    
    if (data && data.cast) setPersonMovie(data.cast);
    //console.log(data)
  };
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20, paddingTop: 80 }}
      style={[styles.container,{backgroundColor:colors.bgBlack}]}
    >
      {/* Nút trở lại */}
      {/* <SafeAreaView style={styles.viewSafe}>
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
      </SafeAreaView> */}
      {
        loading ? (
          <Loading />
        ) : (
          <View>
            <View style={styles.borderimg}>
              <View style={styles.image}>
                <Image
                  source={{
                    uri: img342(person?.profile_path) || fallcallImageCast
                    //uri: "https://th.bing.com/th/id/OIP.DXi-IO1zd9_je9x1go-HqAHaKk?w=185&h=264&c=7&r=0&o=5&pid=1.7",
                  }}
                  style={{
                    width:width*0.8,
                    height: height * 0.46,
                  }}
                />
              </View>
            </View>
            {/* Chi tiết phim */}
            <View style={styles.deatil}>
              {/* Ten phim */}
              <Text style={[styles.name,{color:colors.white}]}>{person?.name}</Text>
              {/* Địa chỉ */}
              <Text style={styles.address}>{person?.place_of_birth}</Text>
            </View>

            <View style={styles.description}>
              <View style={styles.item}>
                <Text style={styles.textHeader}>
                  Giới tính
                  {/* Gender */}
                </Text>
                <Text style={styles.textContent}>{person?.gender == 1 ? 'Female' : 'Male'}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.textHeader}>
                  Ngày sinh
                  {/* Birthday */}
                </Text>
                <Text style={styles.textContent}>{person?.birthday}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.textHeader}>
                  Vai trò
                  {/* Known for */}
                </Text>
                <Text style={styles.textContent}>{person?.known_for_department}</Text>
              </View>
              <View style={[styles.item, {borderRightWidth: 0,}]}>
                <Text style={styles.textHeader}>
                  Phổ biến
                  {/* Popularity */}
                </Text>
                <Text style={styles.textContent}>{person?.popularity}</Text>
              </View>
            </View>
            <View style={styles.bio}>
              <Text style={[styles.textHeader,{color:colors.white}]}>
                Tiểu sử
                {/* Biography */}
              </Text>
              <Text style={styles.textContent}>
                {person?.biography || 'N/A'}
              </Text>
            </View>
            {/* Phim tương tự */}
            <MovieList
              title=
              "Phim liên quan"
              //"Related Movies"
              hideSeeAll={true}
              data={personMovie}
            />
          </View>
        )
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewSafe: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  header: {
  },
  borderimg:{
    shadowColor:'red',
    shadowRadius:40,
    shadowOffset:{width:0, height:5},
    shadowOpacity:1,
    flexDirection:"row",
    justifyContent:'center'

  },
  image:{
    alignItems:'center',
    borderRadius: 1000,
    overflow:'hidden',
    height:264,
    width:264
  },
  btnBack: {
    padding: 1,
  },
  name: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: 0.05,
  },
  address: {
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
  description: {
    marginHorizontal: 8,
    marginTop: 12,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "grey",
    borderRadius:25
  },
  item: {
    borderRightWidth: 2,
    borderRightColor: "white",
    paddingVertical: 4,
    alignItems: "center",
    paddingRight:16
  },
  bio:{
    marginHorizontal: 8,
    marginVertical: 10
  },
  textHeader: {
    color: "white",
    fontWeight: "600",
  },
  textContent: {
    lineHeight: 16,
    fontSize: 12,
    color: Colors.textn300
  },
});

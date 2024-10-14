import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors, useThemeColors } from "../constants/Colors"; // Đường dẫn đến Colors của bạn
import { SafeAreaView } from "react-native-safe-area-context";

const MovieVerticalList = ({ route }) => {
  const navigation = useNavigation();
  
  const { title, data } = route.params;
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode

  useEffect(() => {
    navigation.setOptions({
      title: title,
    });
  }, [title]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => navigation.navigate("Movie", { id: item.id })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.movieImage}
      />
      <View style={styles.movieInfo}>
        <Text style={[styles.movieTitle,{color:colors.white}]}>{item.title}</Text>
        <Text style={[styles.movieRating,{color:colors.white2}]}>Rating: {item.vote_average}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={[styles.container ,{backgroundColor:colors.bgBlack}]}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingTop: 46
  },
  movieItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: Colors.darkGray, 
    borderRadius: 10, 
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieInfo: {
    marginLeft: 16,
    flex: 1,
  },
  movieTitle: {
    fontSize: 18, 
    fontWeight: "bold",
  },
  movieRating: {
    marginTop: 4,
  },
});

export default MovieVerticalList;

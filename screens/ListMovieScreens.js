import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../constants/Colors"; // Đường dẫn đến Colors của bạn

const MovieVerticalList = ({ route }) => {
  const navigation = useNavigation();
  
  const { title, data } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: title,
    });
  }, [title]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => navigation.navigate("Movie", { movie: item })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.movieImage}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieRating}>Rating: {item.vote_average}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.bgBlack,
    paddingBottom: 16, 
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
    color: Colors.white,
    fontSize: 18, 
    fontWeight: "bold",
  },
  movieRating: {
    color: Colors.bgLight2,
    marginTop: 4,
  },
});

export default MovieVerticalList;

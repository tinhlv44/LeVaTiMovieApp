import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { fallcallImageMovie, img185 } from "../api/moviedb";
import { Colors } from "../constants/Colors";

var { width, height } = Dimensions.get("window");

export default function MovieList({ title, data, hideSeeAll, onPress }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity onPress={onPress}>
            <Text style={[styles.text, {color: Colors.textn300}]}>Xem tất cả</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {data.map((item, index) => {
          if (!item.poster_path) return
          return (
            <TouchableNativeFeedback
              key={index}
              onPress={() => navigation.push("Movie", item)}
            >
              <View style={styles.item}>
                <Image
                  source={{
                    uri: img185(item.poster_path) || fallcallImageMovie
                    // uri: "https://th.bing.com/th/id/OIP.DXi-IO1zd9_je9x1go-HqAHaKk?w=185&h=264&c=7&r=0&o=5&pid=1.7",
                  }}
                  style={[
                    styles.image,
                    { width: width * 0.33, height: height * 0.22 },
                  ]}
                />
                <Text style={styles.title}>
                  {item.title.length > 14
                    ? item.title.slice(0, 14) + "..."
                    : item.title}
                </Text>
              </View>
            </TouchableNativeFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginTop: 16,
  },
  header: {
    marginHorizontal: 12,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  item: {
    marginHorizontal: 6
  },
  text: {
    fontSize: 20,
    lineHeight: 28,
    color: "white",
  },
  image: {
    borderRadius: 25,
  },
  title:{
    color: Colors.white
  }
});

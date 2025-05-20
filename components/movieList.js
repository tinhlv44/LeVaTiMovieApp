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
import { Colors, useThemeColors } from "../constants/Colors";

var { width, height } = Dimensions.get("window");

export default function MovieList({ title, data, hideSeeAll, onPress }) {
  const navigation = useNavigation();
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.text, {color: colors.white}]}>{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity onPress={onPress}>
            <Text style={[styles.text, {color: Colors.textn300}]}>
              Xem tất cả
              {/* See All */}
            </Text>
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
                  }}
                  style={[
                    styles.image,
                    { width: width * 0.33, height: height * 0.22 },
                  ]}
                />
                <Text style={[styles.title, {color:colors.white}]}>
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
    fontWeight: '600'
  },
  image: {
    borderRadius: 25,
  },
  title:{
  }
});

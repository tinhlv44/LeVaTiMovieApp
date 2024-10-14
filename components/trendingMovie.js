import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel-v4";
import { useNavigation } from "@react-navigation/native";
import { img185, img342, img500 } from "../api/moviedb";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../constants/theme";
import CustomIcon from "./CustomIcon";
import { useThemeColors } from "../constants/Colors";

var { width, height } = Dimensions.get("window");

const genres = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentry",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystry",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export default function TrendingMovie({ data }) {
  const navigation = useNavigation();
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode
  const handleClick = (item) => {
    navigation.navigate("Movie", item);
  };
  return (
    <View style={styles.container}>
      <Text style={[styles.text, {color: colors.white}]}>Xu hướng</Text>

      <Carousel
        data={data}
        renderItem={({ item }) => (
          <MovieCard item={item} handleClick={() => handleClick(item)} />
        )}
        firstItem={1}
        inactiveSlideOpacity={0.2}
        inactiveSlideScale={0.7}
        sliderWidth={width}
        itemWidth={width * 0.62}
        slideStyle={{ display: "flex", alignItems: "center" }}
        autoplay={true}
        showsPagination={true}
        autoplayDelay={5000} // Chờ 5 giây trước khi bắt đầu
        autoplayInterval={7000} // 3 giây giữa mỗi slide
      />
    </View>
  );
}
const MovieCard = ({ item, handleClick }) => {
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode
  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View style={[styles.container]}>
        <Image
          style={[styles.cardImage, { width: width * 0.7 }]}
          source={{ uri: img500(item.poster_path) }}
        />

        <View>
          <View style={styles.rateContainer}>
            <CustomIcon name="star" style={styles.starIcon} type="Entypo" />
            <Text style={[styles.voteText, {color: colors.white}]}>
              {item.vote_average} ({item.vote_count})
            </Text>
          </View>

          <Text numberOfLines={1} style={[styles.textTitle, {color:colors.white}]}>
            {item.title}
          </Text>

          <View style={styles.genreContainer}>
            {item.genre_ids.map((items, index) => {
              if (index >3 ) return 
              return (
                <View key={items} style={[styles.genreBox, {borderColor: colors.white2}]}>
                  <Text style={[styles.genreText, {color:colors.white2}]}>{genres[items]}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  text: {
    fontSize: 20,
    margin: 16,
    fontWeight:'bold'
  },
  cardImage: {
    aspectRatio: 2 / 3,
    borderRadius: BORDERRADIUS.radius_20,
  },
  textTitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_24,
    textAlign: "center",
    paddingVertical: SPACING.space_10,
  },
  rateContainer: {
    flexDirection: "row",
    gap: SPACING.space_10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.space_10,
  },
  starIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.Yellow,
  },
  voteText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
  },
  genreContainer: {
    flexDirection: "row",
    gap: SPACING.space_20,
    flexWrap: "wrap",

    justifyContent: "center",
  },
  genreBox: {
    alignItems: "center",
    flexBasis: "45%",
    borderWidth: 1,
    paddingVertical: SPACING.space_4,
    paddingHorizontal: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_25,
  },
  genreText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
  },
});

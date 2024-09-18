import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React from "react";
import Carousel from 'react-native-snap-carousel-v4';
import { useNavigation } from "@react-navigation/native";
import { img185, img342, img500 } from "../api/moviedb";

var { width, height } = Dimensions.get("window");

export default function TrendingMovie({ data }) {
  const navigation = useNavigation();
  const handleClick = (item) => {
    navigation.navigate("Movie", item);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Xu hướng</Text>

      <Carousel 
            data={data}
            renderItem={({item}) => <MovieCard item={item} handleClick={handleClick}/>}
            firstItem={1}
            inactiveSlideOpacity={0.60}
            sliderWidth={width}
            itemWidth={width*0.62}
            slideStyle={{display:'flex', alignItems:'center'}}
            autoplay={true}
            showsPagination={true}
            loop={true}
            />
    </View>
  );
}
const MovieCard = ({ item, handleClick }) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
      <Image
        source={{
          uri: img185(item.poster_path),
          //   uri: "https://th.bing.com/th/id/OIP.DXi-IO1zd9_je9x1go-HqAHaKk?w=185&h=264&c=7&r=0&o=5&pid=1.7",
        }}
        style={{
          width: width * 0.6,
          height: height * 0.4,
          borderRadius: 50,
        }}
      />
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  text: {
    color: "white",
    fontSize: 20,
    marginHorizontal: 4,
    marginBottom: 4,
  },
});

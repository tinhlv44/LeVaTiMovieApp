import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { fallcallImageCast, img185, img500 } from "../api/moviedb";
import { Colors, useThemeColors } from "../constants/Colors";

export default function Cast({ cast, navigation }) {
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode
  return (
    <View style={styles.container}>
      <Text style={[styles.header,{color:colors.white}]}>
        Diễn viên
        {/* Cast */}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast &&
          cast.map((person, index) => {
            if (!person?.profile_path) return
            return (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() => navigation.navigate("Person", person)}
              >
                <View style={styles.vImage}>
                  <Image
                    source={{
                      uri: img185(person?.profile_path) || fallcallImageCast
                        //uri: "https://th.bing.com/th/id/OIP.DXi-IO1zd9_je9x1go-HqAHaKk?w=185&h=264&c=7&r=0&o=5&pid=1.7",
                    }}
                    style={styles.image}
                  />
                </View>
                <Text style={[styles.name,{color:colors.white}]}>
                  {person?.name.length > 12
                    ? person?.name.slice(0, 12) + "..."
                    : person?.name}
                </Text>
                <Text style={styles.character}>
                  {person?.character.length > 14
                    ? person?.character.slice(0, 14) + "..."
                    : person?.character}
                </Text>
              </TouchableOpacity>
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
    marginHorizontal: 8,
    marginBottom: 5,
    fontSize: 24,
    fontWeight: '600'
  },
  item: {
    alignItems: "center",
    margin: 4,
  },
  vImage: {
    overflow: "hidden",
    borderRadius: 50,
    height: 80,
    width: 80,
    alignItems: "center",
    borderColor: Colors.textn300,
    borderWidth:1,
  },
  image: {
    borderRadius: 50,
    height: 120,
    width: 96,
  },
  name: {
    lineHeight: 20,
    fontSize: 12,
  },
  character: {
    color: "rgb(163 163 163)",
    lineHeight: 16,
    fontSize: 10,
  },
});

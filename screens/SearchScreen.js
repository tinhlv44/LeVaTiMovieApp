import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "../constants/Colors";
import Loading from "../components/loading";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { fallcallImageMovie, fetchSearchMovies, img342 } from "../api/moviedb";
import {debounce} from 'lodash'
var { width, height } = Dimensions.get("window");
export default function SearchScreen() {
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = query => {
    if (query.length > 2 && query ){
      setLoading(true)
      fetchSearchMovies({
        query,
        include_adult: 'false',
        // language: 'vi-VN',
        language: 'en-US',
        page: '1'
      }).then(data =>{
        setLoading(false)
        if (data && data.results) setResults(data.results)
      })
    }
    else{
      setLoading(false)
      setResults([])
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []) 
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.input}>
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor="lightgray"
          style={styles.textInput}
          onChangeText={handleTextDebounce}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.exit}
        >
          <MaterialIcons name="cancel" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 15 }}
          style={styles.scrollView}
        >
          <Text style={styles.text}>Kết quả ({results.length})</Text>
          <View style={styles.results}>
            {results.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate("Movie", item)}
                >
                  <View style={styles.result}>
                    <Image
                      source={{
                        uri: img342(item.poster_path) || fallcallImageMovie
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
          <Image
            source={{
              uri: "https://th.bing.com/th/id/R.e14a2ebd444ce93b5e6f3eb4efedd7ab?rik=t0OHw7Krdfoocw&pid=ImgRaw&r=0",
            }}
            style={styles.noResultImage}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeView: {
    backgroundColor: Colors.bgBlack,
    flex: 1,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "gray",
    borderRadius: 25,
    marginHorizontal: 8,
    marginBottom: 6,
    borderRadius: 25,
    borderWidth: 1,
  },
  textInput: {
    paddingLeft: 12,
    color: Colors.white,
    fontWeight: "600",
    flex: 1,
  },
  exit: {
    borderRadius: 50,
    backgroundColor: "gray",
    padding: 8,
    margin: 4,
  },
  scrollView: {
    padding: 12,
  },
  text: {
    fontSize: 20,
    lineHeight: 28,
    color: "white",
  },
  results: {
    borderRadius: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  result: {
    paddingVertical: 4,
    marginBottom: 8,
  },
  image: {
    width: width * 0.44,
    height: height * 0.3,
    borderRadius: 10,
  },
  name: {
    color: Colors.textn300,
    fontSize: 12,
    lineHeight: 20,
  },
  noResult: {
    justifyContent: "center",
    flexDirection: "row",
  },
  noResultImage: {
    width: width,
    height: 320,
  },
});

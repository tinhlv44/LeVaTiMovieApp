import { StatusBar } from 'expo-status-bar';
import React , {useState}from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View , Platform} from 'react-native';
//import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Colors } from '../constants/Colors';
import Logo from '../components/Logo';
import TrendingMovie from '../components/trendingMovie';
import MovieList from '../components/movieList';

const ios = Platform.OS == 'android';
let currentHeightStatusBar = 24;//StatusBar.currentHeight;

export default function HomeScreens() {
  const [trending, setTrending] = useState([1,2,3]);
  const [upcoming, setUpComing] = useState([1,2,3]);
  const [topRated, setTopRated] = useState([1,2,3]);
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.viewSafe}>
        <StatusBar style="light" />
        <View style={styles.barMenu}>
          <FontAwesome5 name="bars" size={24} color="white" />
          <Logo />
          <TouchableOpacity>
            <FontAwesome5 name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 10}}
      >
        {/* Trending Movie */}
        <TrendingMovie data={trending}/>

        {/* {upcoming movies row} */}

        <MovieList title={'Up Coming'} data={upcoming}/>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewSafe: {
    paddingTop: currentHeightStatusBar,
  },
  barMenu: {
    width:'100%',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal:16
  },
  logoStyleL:{
    color:'white',
    size:'20',
    fontWeight:'800'
  }
});

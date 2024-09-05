import { View, Text , StyleSheet, Image, TouchableWithoutFeedback, Dimensions} from 'react-native'
import React from 'react'
//import Carousel from 'react-native-snap-carousel';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

var {width, height} = Dimensions.get('window');

export default function TrendingMovie({data}) {
    const navigation = useNavigation();
    const handleClick = () =>{
        navigation.navigate('Movie');//, item);
    }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TrendingMovie</Text>
        {/* {data.reverse().map((item, index) => (
            <MovieCard item={item} handleClick={handleClick}/>
        ))}    */}
        
        {/* <Carousel 
            data={data}
            renderItem={({item}) => <MovieCard item={item} handleClick={handleClick}/>}
            firstItem={1}
            inactiveSlideOpacity={0.60}
            sliderWidth={width}
            itemWidth={width*0.62}
            slideStyle={{display:'flex', alignItems:'center'}}
            /> */}
        <Swiper
            loop={true}
            autoplay={false}
            showsPagination={true}
            dotStyle={{ opacity: 0.6 }}
            activeDotStyle={{ opacity: 1 }}
            containerStyle={{ width: width }}
            slideStyle={{ display: 'flex', alignItems: 'center' }}
            >
            {data.map((item, index) => (
                <MovieCard 
                    item={item}
                    handleClick={handleClick}  />
            ))}
        </Swiper>
    </View>
  )
}
const MovieCard = ({item, handleClick}) =>{
    return (
        <TouchableWithoutFeedback onPress={handleClick}>
            <Image
                source={{uri:'https://th.bing.com/th/id/OIP.DXi-IO1zd9_je9x1go-HqAHaKk?w=185&h=264&c=7&r=0&o=5&pid=1.7'}}
                style={{
                    width:width*0.6,
                    height:height*0.4,
                    borderRadius:50,
                }}
                />
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        marginBottom:8,
        //flexDirection:'row'
    },
    text: {
        color:'white',
        fontSize:20,
        marginHorizontal:4,
        marginBottom:4
    },
})
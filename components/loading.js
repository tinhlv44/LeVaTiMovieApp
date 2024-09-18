import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress'
import { Colors } from '../constants/Colors';
var { width, height } = Dimensions.get("window");

export default function Loading() {
  return (
    <View style={styles.container}>
        <Progress.CircleSnail thickness={12} size={160} color={
            //Colors.bgBlack
            'blue'
            }/>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        height,
        width,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute'
    }
})
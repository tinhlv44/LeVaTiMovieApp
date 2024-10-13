import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BORDERRADIUS,
  Colors,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../constants/Colors';
import CustomIcon from './CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

const AppHeader = (props: any) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity style={styles.iconBG} onPress={() => props.action()}>
        <CustomIcon name={props.name} style={styles.iconStyle} />
      </TouchableOpacity> */}
      <Text style={styles.headerText}>{props.header}</Text>
      {/* <View style={styles.emptyContainer}></View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    color: Colors.bgLight,
    fontSize: FONTSIZE.size_24,
  },
  headerText: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
    textAlign: 'center',
    color: Colors.bgLight,
  },
  emptyContainer: {
    height: SPACING.space_20 * 2,
    width: SPACING.space_20 * 2,
  },
  iconBG: {
    height: SPACING.space_20 * 2,
    width: SPACING.space_20 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: Colors.main,
  },
});

export default AppHeader;
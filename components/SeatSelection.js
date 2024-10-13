import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import CustomIcon from '../components/CustomIcon';
import { COLORS, SPACING } from '../constants/theme';
import { Colors } from '../constants/Colors';

const SeatSelection = ({ twoDSeatArray, selectSeat }) => {
  return (
    <View style={styles.containerGap20}>
      {twoDSeatArray?.map((item, index) => (
        <View key={index} style={styles.seatRow}>
          {item?.map((subitem, subindex) => (
            <TouchableOpacity
              key={subitem.number}
              onPress={() => {
                selectSeat(index, subindex, subitem.number);
              }}>
              <CustomIcon
                type="MaterialCommunityIcons"
                name="seat"
                style={[
                  styles.seatIcon,
                  subitem.taken ? { color: Colors.black } : {},
                  subitem.selected ? { color: COLORS.Orange } : {},
                ]}
                onText={subitem.number}
                styleText={[
                  subitem.taken ? { color: COLORS.White } : 
                  subitem.selected ? { color: COLORS.White } : {color: COLORS.Black},
                ]}
                size={26}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  containerGap20: {
    marginVertical: SPACING.space_20,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.space_8,
  },
  seatIcon: {
    margin: SPACING.space_8,
  },
});

export default SeatSelection;

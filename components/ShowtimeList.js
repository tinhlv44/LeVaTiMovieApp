import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const ShowtimeList = ({ showtimes, selectedShowtime, handleShowtimeChange }) => {
  return (
    <View style={styles.showtimeContainer}>
      <FlatList
        data={showtimes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.showtime,
              selectedShowtime && selectedShowtime.key === item.key
                ? styles.selectedShowtime // Đổi màu nếu suất chiếu được chọn
                : null
            ]}
            onPress={() => handleShowtimeChange(item)}>
            <Text
              style={[
                styles.cinemaText,
                selectedShowtime && selectedShowtime.key === item.key
                  ? styles.selectedText // Đổi màu văn bản nếu suất chiếu được chọn
                  : null
              ]}>
              {item.cinemaId}
            </Text>
            <Text
              style={[
                styles.dateText,
                selectedShowtime && selectedShowtime.key === item.key
                  ? styles.selectedText
                  : null
              ]}>
              {item.date}
            </Text>
            <Text
              style={[
                styles.timeText,
                selectedShowtime && selectedShowtime.key === item.key
                  ? styles.selectedText
                  : null
              ]}>
              {item.time}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  showtimeContainer: {
    marginVertical: SPACING.space_20,
  },
  showtime: {
    padding: SPACING.space_12,
    backgroundColor: COLORS.Black,
    marginHorizontal: SPACING.space_10,
    borderRadius: SPACING.space_8,
  },
  selectedShowtime: {
    backgroundColor: COLORS.Orange,
  },
  selectedText: {
    color: COLORS.White,
  },
  cinemaText: {
    fontSize: 16,
    color: COLORS.White,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.Grey,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.Grey,
  },
});

export default ShowtimeList;

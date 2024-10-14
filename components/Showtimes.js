import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { img342 } from '../api/moviedb';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../constants/Colors';

const Showtimes = ({ showtimes }) => {
  const navigation = useNavigation()
  const colors = useThemeColors(); // Lấy màu dựa trên darkMode
  // Lấy thời gian hiện tại

  const currentTime = moment();

  // Lọc những suất chiếu sau thời điểm hiện tại
  const filteredShowtimes = showtimes.filter((showtime) => {
    // Tách ngày và giờ từ id của showtime
    const parts = showtime.id.split('-'); // Ví dụ: ["Rạp 1", "2024", "10", "13", "19", "10"]
    const date = `${parts[1]}-${parts[2]}-${parts[3]}`; // "2024-10-13"
    const time = `${parts[4]}:${parts[5]}`; // "19:10"

    // Kết hợp ngày và giờ để tạo đối tượng thời gian đầy đủ
    const showtimeMoment = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    
    // So sánh xem suất chiếu có xảy ra sau thời điểm hiện tại không
    return showtimeMoment.isAfter(currentTime);
  });

  const renderShowtimeItem = ({ item }) => {
    const parts = item.id.split('-');
    const time = `${parts[4]}:${parts[5].length === 1 ? parts[5]+"0" : parts[5]}`; // Giờ chiếu từ id

    return (
      <TouchableOpacity key={item.id} style={[styles.timeContainer,{backgroundColor:colors.bgBlack}]} onPress={() => navigation.navigate("Movie", {id: item.movieId} )}>
        {/* Đảm bảo bao hình ảnh trong một View */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: img342(item.img) }} style={styles.image} />
        </View>
        <Text style={[styles.timeText,{color:colors.white}]}>
          {time} - {item.title.length > 22
                        ? item.title.slice(0, 22) + "..."
                        : item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={filteredShowtimes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderShowtimeItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  timeContainer: {
    marginVertical: 4,
    padding: 10,
    backgroundColor: '#2C2C2E', // Màu nền cho từng suất chiếu
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row', // Sử dụng flexDirection để xếp hình ảnh và văn bản ngang hàng
    alignItems: 'center', // Căn giữa hình ảnh và văn bản
  },
  imageContainer: {
    marginRight: 10, // Khoảng cách giữa hình ảnh và văn bản
  },
  image: {
    width: 50, // Đặt chiều rộng cho hình ảnh
    height: 75, // Đặt chiều cao cho hình ảnh
    borderRadius: 4, // Thêm bo tròn cho hình ảnh (nếu cần)
  },
  timeText: {
    fontSize: 16,
    color: '#FFFFFF', // Màu chữ trắng để dễ đọc trên nền tối
  },
});

export default Showtimes;

import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, TouchableOpacity, View } from 'react-native';
import Showtimes from '../components/Showtimes';
import { getShowtimesForNext7Days } from '../test';
import { Colors } from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingIndicator } from '../components';

const ShowtimeScreen = () => {
  const [showtimesData, setShowtimesData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        const dataShowtime = await getShowtimesForNext7Days();
        setShowtimesData(dataShowtime);

        // Lấy ngày đầu tiên và rạp đầu tiên
        const firstDate = Object.keys(dataShowtime)[0];
        const firstTheater = Object.keys(dataShowtime[firstDate])[0];

        setSelectedDate(firstDate);
        setSelectedTheater(firstTheater);

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error);
      }
    };

    fetchShowtimes();
  }, []);
  
  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <LoadingIndicator  />
      </SafeAreaView>
    );
  }

  const availableDates = Object.keys(showtimesData);
  const availableTheaters = selectedDate ? Object.keys(showtimesData[selectedDate]) : [];

  return (
    <SafeAreaView style={styles.screen}>
      {/* Chọn ngày */}
      <View style={styles.dtContainer}>
      <FlatList
        horizontal
        data={availableDates}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedDate(item)}>
            <View style={[styles.dateItem, selectedDate === item && styles.selectedItem]}>
              <Text style={styles.dateText}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.dateList}
        showsHorizontalScrollIndicator={false}
      />

      </View>
        {/* Chọn rạp */}
      <View style={styles.dtContainer}>
      {selectedDate && (
        <FlatList
          horizontal
          data={availableTheaters}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedTheater(item)}>
              <View style={[styles.theaterItem, selectedTheater === item && styles.selectedItem]}>
                <Text style={styles.theaterText}>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.theaterList}
          showsHorizontalScrollIndicator={false}
        />
      )}

      </View>


      {/* Hiển thị suất chiếu */}
      <View style={styles.showtimesContainer}>
        {selectedDate && selectedTheater && (
          <Showtimes showtimes={showtimesData[selectedDate][selectedTheater]} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex:1,
    backgroundColor: Colors.bgBlack, // Màu nền đen
  },
  dateList: {
    padding: 10,    
  },
  dateItem: {
    marginRight: 12,
    padding: 10,
    backgroundColor: '#2C2C2E', // Màu nền cho mục ngày
    borderRadius: 8,
  },
  theaterList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  theaterItem: {
    marginRight: 12,
    padding: 10,
    backgroundColor: '#2C2C2E', // Màu nền cho mục rạp
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: '#FFC107', // Màu nền cho mục được chọn (màu vàng)
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF', // Màu chữ cho mục ngày
  },
  theaterText: {
    fontSize: 16,
    color: '#FFFFFF', // Màu chữ cho mục rạp
  },
  dtContainer: {
    flex:2,
    // Tùy chọn khác cho bố cục của suất chiếu
  },
  showtimesContainer: {
    flex:12,
    // Tùy chọn khác cho bố cục của suất chiếu
  },
});

export default ShowtimeScreen;

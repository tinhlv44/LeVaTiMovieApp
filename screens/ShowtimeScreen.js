import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Showtimes from "../components/Showtimes";
import { getShowtimesForNext7Days } from "../test";
import { Colors, useThemeColors } from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingIndicator } from "../components";

const ShowtimeScreen = () => {
  const [showtimesData, setShowtimesData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [loading, setLoading] = useState(true);

  const colors = useThemeColors(); // Lấy màu dựa trên darkMode

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
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchShowtimes();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: colors.bgBlack }]}
      >
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  const availableDates = Object.keys(showtimesData);
  const availableTheaters = selectedDate
    ? Object.keys(showtimesData[selectedDate])
    : [];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bgBlack }]}>
      {/* Chọn ngày */}
      <View style={styles.dtContainer}>
      <Text style={[styles.title, {color: colors.white}]}>Ngày</Text>
        <FlatList
          horizontal
          data={availableDates}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedDate(item)}>
              <View
                style={[
                  styles.dateItem,
                  { backgroundColor: colors.bgBlack2 },
                  selectedDate === item && styles.selectedItem,
                ]}
              >
                <Text style={[styles.dateText, { color: colors.white }]}>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.dateList}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* Chọn rạp */}
      <View style={styles.dtContainer}>
        <Text style={[styles.title, {color: colors.white}]}>Rạp phim</Text>
        {selectedDate && (
          <FlatList
            horizontal
            data={availableTheaters}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedTheater(item)}>
                <View
                  style={[
                    styles.theaterItem,
                    ,
                    { backgroundColor: colors.bgBlack2 },
                    selectedTheater === item && styles.selectedItem,
                  ]}
                >
                  <Text style={[styles.theaterText, { color: colors.white }]}>
                    {item}
                  </Text>
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
        <Text style={[styles.title, {color: colors.white}]}>Suất chiếu</Text>
        {selectedDate && selectedTheater && (
          <Showtimes showtimes={showtimesData[selectedDate][selectedTheater]} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  dateList: {
    padding: 10,
  },
  dateItem: {
    marginRight: 12,
    padding: 10,
    borderRadius: 8,
  },
  theaterList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  theaterItem: {
    marginRight: 12,
    padding: 10,
    backgroundColor: Colors.btn2, // Màu nền cho mục được chọn (màu vàng)
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: Colors.btn2, // Màu nền cho mục được chọn (màu vàng)
  },
  dateText: {
    fontSize: 16,
  },
  theaterText: {
    fontSize: 16,
  },
  dtContainer: {
    flex: 1,
  },
  showtimesContainer: {
    flex: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 8
  },
});

export default ShowtimeScreen;

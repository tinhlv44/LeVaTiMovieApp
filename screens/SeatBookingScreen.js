import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ToastAndroid ,
  Alert
} from "react-native";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import AppHeader from "../components/AppHeader";
import CustomIcon from "../components/CustomIcon";
import { Colors } from "../constants/Colors";
import { getShowtimesByMovieIdForNext7Days } from "../test";
import { db } from "../firebaseConfig"; // Import Firestore
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore methods
import { useMyContextController } from "../store";

const generateSeats = (seats) => {
  const rows = 8; // Số hàng
  const columns = 10; // Số cột
  let rowArray = [];
  let availableSeats = 0; // Đếm số ghế trống

  for (let i = 0; i < rows; i++) {
    const columnArray = Array.from({ length: columns }, (_, index) => {
      const seatNumber = i * columns + index + 1;
      const isTaken = seats.includes(seatNumber); // Kiểm tra xem ghế đã được đặt chưa
      if (!isTaken) availableSeats++; // Tăng số ghế trống nếu ghế chưa bị đặt
      return {
        number: seatNumber, // Tính số ghế
        taken: isTaken, // Kiểm tra xem ghế đã được đặt chưa
        selected: false, // Trạng thái ghế chưa được chọn
      };
    });

    rowArray.push(columnArray); // Thêm hàng vào mảng ghế
  }

  // Kiểm tra nếu không còn ghế trống
  if (availableSeats === 0) {
    return "Hết ghế"; // Trả về trạng thái hết ghế
  }

  return rowArray; // Trả về mảng ghế nếu còn ghế trống
};

const SeatBookingScreen = ({ navigation, route }) => {
  const [price, setPrice] = useState(0);
  const [twoDSeatArray, setTwoDSeatArray] = useState(generateSeats([]));
  const [selectedSeatArray, setSelectedSeatArray] = useState([]);
  const [outOfSeat, setOutOfSeat] = useState(false);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [controller, dispatch] = useMyContextController();
  const { uid } = controller;
  const [loadingBtn, setLoadingBtn] = useState(false); // Thêm state loading

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const showtimesData = await getShowtimesByMovieIdForNext7Days(route.params.id);
        setShowtimes(showtimesData);
        
        // // Mặc định chọn suất chiếu đầu tiên nếu có
        // if (showtimesData.length > 0) {
        //   setSelectedShowtime(showtimesData[0]);
        //   const seatsArray = generateSeats(showtimesData[0].seats);
        //   setTwoDSeatArray(seatsArray);
        // }
      } catch (error) {
        console.log('Lỗi khi lấy showtimes: ', error);
      } finally {
        setLoading(false); // Đặt loading thành false khi hoàn thành
      }
    };
  
    fetchShowtimes();
  }, [route.params.id]);
  

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Đặt vé: " + route.params.title,
      headerShown: true,
      headerTransparent: true,
      headerTintColor: "#fff",
    });
  }, [route]);

  const combinedShowtimes = showtimes.map((showtime) => ({
    key: `${showtime.cinemaId}-${showtime.date}-${showtime.time}`,
    cinemaId: showtime.cinemaId,
    date: showtime.date,
    time: showtime.time,
    seats: showtime.seats,
  }));

  const selectSeat = (index, subindex, num) => {
    if (!twoDSeatArray[index][subindex].taken) {
      let array = [...selectedSeatArray];
      let temp = [...twoDSeatArray];
      temp[index][subindex].selected = !temp[index][subindex].selected;

      if (!array.includes(num)) {
        array.push(num);
      } else {
        const tempindex = array.indexOf(num);
        if (tempindex > -1) {
          array.splice(tempindex, 1);
        }
      }
      setSelectedSeatArray(array);
      setPrice(array.length * 100.0);
      setTwoDSeatArray(temp);
    }
  };

  const handleShowtimeChange = (showtime) => {
    const seatsArray = generateSeats(showtime.seats);

    if (seatsArray === "Hết ghế") {
      setOutOfSeat(true);
      alert("Suất chiếu này đã hết ghế, vui lòng chọn suất chiếu khác!");
      setSelectedShowtime(null); // Reset lại suất chiếu
      return;
    }

    setSelectedShowtime(showtime);
    setTwoDSeatArray(seatsArray); // Cập nhật ghế dựa trên suất chiếu đã chọn
    setSelectedSeatArray([]); // Đặt lại ghế đã chọn
    setPrice(0); // Đặt lại giá
  };

  const BookSeats = async () => {
    setLoadingBtn(true);
    if (selectedSeatArray.length === 0 || !selectedShowtime) {
      ToastAndroid.show( "Vui lòng chọn ghế và suất chiếu!", ToastAndroid.SHORT);
      return;
    }
  
    // Tạo đối tượng dữ liệu cần lưu cho đặt ghế
    const bookingData = {
      movieId: route.params.id,
      cinemaId: selectedShowtime.cinemaId,
      date: selectedShowtime.date,
      time: selectedShowtime.time,
      seats: selectedSeatArray,
      totalPrice: price,
      state: 0,
      uid: uid,
      create: new Date() // Thêm trường create với timestamp hiện tại
    };
  
    try {
      // Tạo một document mới trong collection "bookings"
      const bookingRef = doc(collection(db, "bookings"));
      await setDoc(bookingRef, bookingData);  // Lưu dữ liệu booking vào Firestore
  
      const bookingId = bookingRef.id; // Lấy ID của document bookings mới tạo
  
      // Cập nhật thông tin ghế đã đặt trong collection "showtimes"
      const showtimeRef = doc(db, "showtimes", selectedShowtime.date);
  
      // Lấy thông tin ghế hiện tại của suất chiếu
      const showtimeSnap = await getDoc(showtimeRef);
  
      if (showtimeSnap.exists()) {
        const showtimeData = showtimeSnap.data();
  
        // Tìm đúng suất chiếu dựa trên `cinemaId` và `time`
        const showtimeEntries = showtimeData[selectedShowtime.cinemaId];
        const showtimeIndex = showtimeEntries.findIndex(
          (entry) => entry.time === selectedShowtime.time
        );
  
        if (showtimeIndex !== -1) {
          // Cập nhật danh sách ghế cho suất chiếu cụ thể
          const currentSeats = showtimeEntries[showtimeIndex].seats;
  
          // Loại bỏ các ghế trùng lặp
          const updatedSeats = [
            ...new Set([...currentSeats, ...selectedSeatArray]),
          ];
  
          // Cập nhật ghế trong Firestore
          showtimeEntries[showtimeIndex].seats = updatedSeats;
  
          // Cập nhật toàn bộ thông tin của rạp (cinemaId) trong document "showtimes"
          await updateDoc(showtimeRef, {
            [selectedShowtime.cinemaId]: showtimeEntries,
          });
  
          console.log("Cập nhật ghế thành công!", updatedSeats);
  
          // Chuyển sang màn hình Payment với ID của document bookings vừa tạo
          Alert.alert("Thành công", "Đặt vé thành công!\nGiờ bạn có thể thanh toán vé của mình.");
          navigation.navigate('Payment', { bookingId }); // Chuyển qua màn hình Payment và truyền ID
        } else {
          console.log("Không tìm thấy suất chiếu phù hợp!");
          alert("Không tìm thấy suất chiếu phù hợp!");
        }
      } else {
        console.log("Document không tồn tại!");
        alert("Suất chiếu không tồn tại!");
      }
    } catch (error) {
      console.error("Lỗi khi đặt ghế: ", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }finally {
      // Kết thúc loading
      setLoadingBtn(false);
    }
  };
  
  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <ImageBackground
          source={{ uri: route.params?.BgImage }}
          style={styles.ImageBG}
        >
          <LinearGradient
            colors={[COLORS.BlackRGB10, COLORS.Black]}
            style={styles.linearGradient}
          >
            <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header={""}
                action={() => navigation.goBack()}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
      <Text style={styles.text}>Phần suất chiếu</Text>
      <View style={styles.showtimeContainer}>
        {loading ? ( // Kiểm tra trạng thái loading
          <ActivityIndicator size="large" color={COLORS.Orange} />
        ) : (
          <FlatList
            data={combinedShowtimes}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.showtime,
                  selectedShowtime && selectedShowtime.key === item.key
                    ? styles.selectedShowtime // Đổi màu nếu suất chiếu được chọn
                    : null,
                ]}
                onPress={() => handleShowtimeChange(item)}
              >
                <Text
                  style={[
                    styles.cinemaText,
                    selectedShowtime && selectedShowtime.key === item.key
                      ? styles.selectedText // Đổi màu văn bản nếu suất chiếu được chọn
                      : null,
                  ]}
                >
                  {item.cinemaId}
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    selectedShowtime && selectedShowtime.key === item.key
                      ? styles.selectedText
                      : null,
                  ]}
                >
                  {item.date}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    selectedShowtime && selectedShowtime.key === item.key
                      ? styles.selectedText
                      : null,
                  ]}
                >
                  {item.time}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<Text style={[styles.text, {color:'gray', fontSize: 16}]}>Hiện không có suất chiếu cho phim này</Text>}
          />
        )}
      </View>

      <Text style={styles.text}>Phần ghế</Text>
      <View style={styles.seatContainer}>
      {selectedShowtime ===null ? ( // Kiểm tra trạng thái loading
          <Text style={[styles.text, {color:'gray', fontSize: 16}]}>Hãy chọn suất chiếu</Text>
        ) : (

        <View style={styles.containerGap20}>
          {twoDSeatArray?.map((item, index) => (
            <View key={index} style={styles.seatRow}>
              {item?.map((subitem, subindex) => (
                <TouchableOpacity
                  key={subitem.number}
                  onPress={() => {
                    selectSeat(index, subindex, subitem.number);
                  }}
                >
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
                      subitem.taken
                        ? { color: COLORS.White }
                        : subitem.selected
                        ? { color: COLORS.White }
                        : { color: COLORS.Black },
                    ]}
                    size={26}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        )}
        <View style={styles.seatRadioContainer}>
          <View style={styles.radioContainer}>
            <CustomIcon
              ontext={true}
              name="seat"
              style={styles.radioIcon}
              type="MaterialCommunityIcons"
            />
            <Text style={styles.radioText}>Available</Text>
          </View>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="seat"
              style={[styles.radioIcon, { color: Colors.black }]}
              type="MaterialCommunityIcons"
            />
            <Text style={styles.radioText}>Booked</Text>
          </View>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="seat"
              style={[styles.radioIcon, { color: COLORS.Orange }]}
              type="MaterialCommunityIcons"
            />
            <Text style={styles.radioText}>Selected</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonPriceContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalPriceText}>Total:</Text>
          <Text style={styles.price}>{price}.000,00 VND</Text>
        </View>
        <TouchableOpacity onPress={BookSeats}>
        {loadingBtn ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Đặt vé</Text>
                )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  ImageBG: {
    width: "100%",
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    width: "100%",
    height: "100%",
  },
  appHeaderContainer: {
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_24,
  },
  screenText: {
    color: COLORS.White,
    fontFamily: FONTFAMILY.Regular,
    fontSize: FONTSIZE.size_20,
    textAlign: "center",
    marginVertical: SPACING.space_8,
  },
  seatContainer: {
    marginBottom: SPACING.space_40,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  seatIcon: {
    //fontSize: FONTSIZE.font_24,
    color: Colors.bgLight2,
    marginVertical: SPACING.space_4,
    marginHorizontal: SPACING.space_4,
  },
  seatRadioContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.space_16,
    marginVertical: SPACING.space_20,
  },
  radioContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.space_8,
  },
  radioIcon: {
    //fontSize: FONTSIZE.font_24,
    color: Colors.bgLight2,
  },
  radioText: {
    color: Colors.bgLight2,
    fontFamily: FONTFAMILY.Regular,
  },
  containerGap20: {
    gap: SPACING.space_20,
  },
  OutterContainer: {
    marginVertical: SPACING.space_32,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
  dateContainer: {
    borderRadius: BORDERRADIUS.radius_12,
    paddingVertical: SPACING.space_12,
    paddingHorizontal: SPACING.space_12,
    backgroundColor: COLORS.DarkGrey,
  },
  dateText: {
    color: COLORS.White,
    textAlign: "center",
    fontFamily: FONTFAMILY.Bold,
    fontSize: FONTSIZE.font_20,
  },
  dayText: {
    color: COLORS.Grey,
    textAlign: "center",
    fontFamily: FONTFAMILY.Medium,
    fontSize: FONTSIZE.font_12,
  },
  timeContainer: {
    borderRadius: BORDERRADIUS.radius_12,
    paddingVertical: SPACING.space_12,
    paddingHorizontal: SPACING.space_12,
    backgroundColor: COLORS.DarkGrey,
  },
  timeText: {
    color: COLORS.White,
    textAlign: "center",
    fontFamily: FONTFAMILY.Bold,
    fontSize: FONTSIZE.font_16,
  },
  buttonPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: SPACING.space_32,
    marginHorizontal: SPACING.space_24,
  },
  priceContainer: {
    justifyContent: "center",
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.Bold,
    fontSize: FONTSIZE.font_12,
    color: COLORS.White,
  },
  price: {
    fontFamily: FONTFAMILY.Bold,
    fontSize: FONTSIZE.font_20,
    color: COLORS.Orange,
  },
  buttonText: {
    backgroundColor: COLORS.Orange,
    paddingVertical: SPACING.space_12,
    paddingHorizontal: SPACING.space_32,
    borderRadius: BORDERRADIUS.radius_12,
    color: COLORS.White,
    fontFamily: FONTFAMILY.Bold,
    fontSize: FONTSIZE.font_16,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
  showtimeContainer: {},
  cinemaText: {
    color: COLORS.White,
    textAlign: "center",
    fontFamily: FONTFAMILY.Bold,
    fontSize: FONTSIZE.font_16,
  },
  dateText: {
    color: COLORS.White,
    textAlign: "center",
    fontFamily: FONTFAMILY.Bold,
    fontSize: FONTSIZE.font_20,
  },
  timeText: {
    color: COLORS.Grey,
    textAlign: "center",
    fontFamily: FONTFAMILY.Medium,
    fontSize: FONTSIZE.font_12,
  },
  showtime: {
    borderRadius: BORDERRADIUS.radius_12,
    paddingVertical: SPACING.space_12,
    paddingHorizontal: SPACING.space_12,
    backgroundColor: COLORS.DarkGrey,
    marginHorizontal: 8,
  },
  text: {
    color: "white",
    fontSize: 20,
    margin: 16,
    fontWeight: "bold",
  },
  selectedShowtime: {
    backgroundColor: Colors.main, // Màu nền khi được chọn (ví dụ: màu đỏ cam)
  },
  selectedText: {
    color: "#fff", // Màu chữ khi được chọn (ví dụ: màu trắng)
  },
});

export default SeatBookingScreen;

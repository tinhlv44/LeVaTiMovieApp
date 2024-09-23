import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../constants/theme';

import { LinearGradient } from "expo-linear-gradient";
import AppHeader from '../components/AppHeader';
import CustomIcon from '../components/CustomIcon';
import { Colors } from '../constants/Colors';
// import AppHeader from '../components/AppHeader';
// import CustomIcon from '../components/CustomIcon';
//import EncryptedStorage from 'react-native-encrypted-storage';

const timeArray = [
  '10:30',
  '12:30',
  '14:30',
  '15:00',
  '19:30',
  '21:00',
];

const generateDate = () => {
  const date = new Date();
  let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let weekdays = [];
  for (let i = 0; i < 7; i++) {
    let tempDate = {
      date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
      day: weekday[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
    };
    weekdays.push(tempDate);
  }
  return weekdays;
};

const generateSeats = () => {
  let numRow = 8;
  let numColumn = 3;
  let rowArray = [];
  let start = 1;
  let reachnine = false;

  for (let i = 0; i < numRow; i++) {
    let columnArray = [];
    for (let j = 0; j < numColumn; j++) {
      let seatObject = {
        number: start,
        taken: Boolean(Math.round(Math.random())),
        selected: false,
      };
      columnArray.push(seatObject);
      start++;
    }
    if (i == 3) {
      numColumn += 2;
    }
    if (numColumn < 9 && !reachnine) {
      numColumn += 2;
    } else {
      reachnine = true;
      numColumn -= 2;
    }
    rowArray.push(columnArray);
  }
  return rowArray;
};

const SeatBookingScreen = ({ navigation, route }) => {
  const [dateArray, setDateArray] = useState(generateDate());
  const [selectedDateIndex, setSelectedDateIndex] = useState();
  const [price, setPrice] = useState(0);
  const [twoDSeatArray, setTwoDSeatArray] = useState(generateSeats());
  const [selectedSeatArray, setSelectedSeatArray] = useState([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState();

  const selectSeat = (index, subindex, num) => {
    if (!twoDSeatArray[index][subindex].taken) {
      let array = [...selectedSeatArray];
      let temp = [...twoDSeatArray];
      temp[index][subindex].selected = !temp[index][subindex].selected;
      if (!array.includes(num)) {
        array.push(num);
        setSelectedSeatArray(array);
      } else {
        const tempindex = array.indexOf(num);
        if (tempindex > -1) {
          array.splice(tempindex, 1);
          setSelectedSeatArray(array);
        }
      }
      setPrice(array.length * 5.0);
      setTwoDSeatArray(temp);
    }
  };

  const BookSeats = async () => {
    if (
      selectedSeatArray.length !== 0 &&
      timeArray[selectedTimeIndex] !== undefined &&
      dateArray[selectedDateIndex] !== undefined
    ) {
      try {
        await EncryptedStorage.setItem(
          'ticket',
          JSON.stringify({
            seatArray: selectedSeatArray,
            time: timeArray[selectedTimeIndex],
            date: dateArray[selectedDateIndex],
            ticketImage: route.params.PosterImage,
          }),
        );
      } catch (error) {
        console.error(
          'Something went Wrong while storing in BookSeats Functions',
          error,
        );
      }
      navigation.navigate('Ticket', {
        seatArray: selectedSeatArray,
        time: timeArray[selectedTimeIndex],
        date: dateArray[selectedDateIndex],
        ticketImage: route.params.PosterImage,
      });
    } else {
      ToastAndroid.showWithGravity(
        'Please Select Seats, Date and Time of the Show',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <StatusBar hidden />
      <View>
        <ImageBackground
          source={{ uri: route.params?.BgImage }}
          style={styles.ImageBG}>
          <LinearGradient
            colors={[COLORS.BlackRGB10, COLORS.Black]}
            style={styles.linearGradient}>
            <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header={''}
                action={() => navigation.goBack()}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.screenText}>Screen this side</Text>
      </View>

      <View style={styles.seatContainer}>
        <View style={styles.containerGap20}>
          {twoDSeatArray?.map((item, index) => {
            return (
              <View key={index} style={styles.seatRow}>
                {item?.map((subitem, subindex) => {
                  return (
                    <TouchableOpacity
                      key={subitem.number}
                      onPress={() => {
                        selectSeat(index, subindex, subitem.number);
                      }}>
                      <CustomIcon
                        type='MaterialCommunityIcons'
                        name="seat"
                        style={[
                          styles.seatIcon,
                          subitem.taken ? { color: Colors.black } : {},
                          subitem.selected ? { color: COLORS.Orange } : {},
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
        <View style={styles.seatRadioContainer}>
          <View style={styles.radioContainer}>
            <CustomIcon name="seat" style={styles.radioIcon} type='MaterialCommunityIcons' />
            <Text style={styles.radioText}>Available</Text>
          </View>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="seat"
              style={[styles.radioIcon, { color: Colors.black }]}
              type='MaterialCommunityIcons'
            />
            <Text style={styles.radioText}>Taken</Text>
          </View>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="seat"
              style={[styles.radioIcon, { color: COLORS.Orange }]}
              type='MaterialCommunityIcons'
            />
            <Text style={styles.radioText}>Selected</Text>
          </View>
        </View>
      </View>

      <View>
        <FlatList
          data={dateArray}
          keyExtractor={(item) => item.date}
          horizontal
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setSelectedDateIndex(index)}>
                <View
                  style={[
                    styles.dateContainer,
                    index == 0
                      ? { marginLeft: SPACING.space_24 }
                      : index == dateArray.length - 1
                      ? { marginRight: SPACING.space_24 }
                      : {},
                    index == selectedDateIndex
                      ? { backgroundColor: COLORS.Orange }
                      : {},
                  ]}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.OutterContainer}>
        <FlatList
          data={timeArray}
          keyExtractor={(item) => item}
          horizontal
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setSelectedTimeIndex(index)}>
                <View
                  style={[
                    styles.timeContainer,
                    index == 0
                      ? { marginLeft: SPACING.space_24 }
                      : index == dateArray.length - 1
                      ? { marginRight: SPACING.space_24 }
                      : {},
                    index == selectedTimeIndex
                      ? { backgroundColor: COLORS.Orange }
                      : {},
                  ]}>
                  <Text style={styles.timeText}>{item}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.buttonPriceContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalPriceText}>Total Price</Text>
          <Text style={styles.price}>$ {price}.00</Text>
        </View>
        <TouchableOpacity onPress={BookSeats}>
          <Text style={styles.buttonText}>Buy Tickets</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  ImageBG: {
    width: '100%',
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    width: '100%',
    height: '100%',
  },
  appHeaderContainer: {
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_24,
  },
  screenText: {
    color: COLORS.Grey,
    fontFamily: FONTFAMILY.Regular,
    fontSize: FONTSIZE.font_12,
    textAlign: 'center',
    marginVertical: SPACING.space_8,
  },
  seatContainer: {
    marginBottom: SPACING.space_40,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seatIcon: {
    fontSize: FONTSIZE.font_24,
    color: Colors.bgLight2,
    marginVertical: SPACING.space_4,
    marginHorizontal: SPACING.space_4,
  },
  seatRadioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.space_16,
    marginVertical: SPACING.space_20,
  },
  radioContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.space_8,
  },
  radioIcon: {
    fontSize: FONTSIZE.font_24,
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
    textAlign: 'center',
    fontFamily: FONTFAMILY.Bold,
    fontSize: FONTSIZE.font_20,
  },
  dayText: {
    color: COLORS.Grey,
    textAlign: 'center',
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
    textAlign: 'center',
    fontFamily: FONTFAMILY.Bold,
    fontSize: FONTSIZE.font_16,
  },
  buttonPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.space_32,
    marginHorizontal: SPACING.space_24,
  },
  priceContainer: {
    justifyContent: 'center',
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
});

export default SeatBookingScreen;

import React from 'react';
import HomeScreen from '../screens/HomeScreens';
import SearchScreen from '../screens/SearchScreen';
import TicketScreen from '../screens/TicketScreen';
import UserAccountScreen from '../screens/UserAccountScreen';
import CustomIcon from '../components/CustomIcon';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StackComponent from './HomeNavigator';
import { Colors, FONTSIZE, SPACING } from '../constants/Colors';
import BookingsScreen from '../screens/BookingsScreen ';
import ShowtimeScreen from '../screens/ShowtimeScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgBlack2,
          borderTopWidth: 0,
          height: 6 * 10,
          
        },
      }}>
      <Tab.Screen
        name="Home"
        component={StackComponent}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: Colors.main} : {},
                ]}>
                <CustomIcon
                  name="video-vintage"
                  color={Colors.bgLight}
                  size={FONTSIZE.size_30}
                  type='MaterialCommunityIcons'
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Showtime"
        component={ShowtimeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: Colors.main} : {},
                ]}>
                <CustomIcon
                  name="calendar-times-o"
                  color={Colors.bgLight}
                  size={FONTSIZE.size_30}
                  type='FontAwesome'
                />
              </View>
            );
          },
        }}
      />
      {/* <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: Colors.main} : {},
                ]}>
                <CustomIcon
                  name="search"
                  color={Colors.bgLight}
                  size={FONTSIZE.size_30}
                />
              </View>
            );
          },
        }}
      /> */}
      <Tab.Screen
        name="Ticket"
        //component={TicketScreen}
        component={BookingsScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: Colors.main} : {},
                ]}>
                <CustomIcon
                  name="ticket"
                  color={Colors.bgLight}
                  size={FONTSIZE.size_30}
                  type='Ionicons'
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="User"
        component={UserAccountScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: Colors.main} : {},
                ]}>
                <CustomIcon
                  name="user"
                  color={Colors.bgLight}
                  size={FONTSIZE.size_30}
                  type='AntDesign'
                />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeTabBackground: {
    backgroundColor: Colors.bgBlack,
    padding: SPACING.space_12,
    borderRadius: SPACING.space_18 * 10,
  },
});

export default TabNavigator;

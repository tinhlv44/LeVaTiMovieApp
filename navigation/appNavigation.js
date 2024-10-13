import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import TabNavigator from "./TabNavigator";
import { SignupScreen } from "../screens/SignupScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { LoginScreen } from "../screens/LoginScreen";
import MovieScreen from "../screens/MovieScreens";
import PersonScreens from "../screens/PersonScreens";
import SearchScreen from "../screens/SearchScreen";
import SeatBookingScreen from "../screens/SeatBookingScreen";
import UpdateUserScreen from "../screens/UpdateUserScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import MovieVerticalList from "../screens/ListMovieScreens";
import { Colors } from "../constants/Colors";
import TicketScreen from "../screens/TicketScreen";
import FavoriteMoviesScreen from "../screens/FavoriteMoviesScreen";

const Stack = createStackNavigator();

const AppStack = () => (
  <Stack.Navigator
    initialRouteName="App"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="App" component={TabNavigator} />
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{
        headerShown: true,
        headerTintColor: "#fff", 
        headerTransparent: true,
        title:''
      }}
    />
    <Stack.Screen 
      name="Signup" 
      component={SignupScreen} 
      options={{
        headerShown: true,
        headerTintColor: "#fff", 
        headerTransparent: true,
        title:''
      }}
    />
    <Stack.Screen 
      name="ForgotPassword" 
      component={ForgotPasswordScreen} 
      options={{
        headerShown: true,
        headerTintColor: "#fff", 
        headerTransparent: true,
        title:''
      }}
    />
    <Stack.Screen
      name="Movie"
      component={MovieScreen}
    />
    <Stack.Screen
      name="Person"
      component={PersonScreens}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
    />
    <Stack.Screen
      name="SeatBooking"
      component={SeatBookingScreen}
    />
    <Stack.Screen
      name="UpdateUser"
      options={{
        headerShown: true,
        title: "Thay đổi thông tin",
        headerTintColor: "#fff", // Màu chữ trắng
        headerTransparent: true,
      }}
      component={UpdateUserScreen}
    />

    <Stack.Screen
      name="ChangePassword"
      options={{
        headerShown: true,
        title: "Đổi mật khẩu",
        headerTintColor: "#fff", // Màu chữ trắng
        headerTransparent: true,
      }}
      component={ChangePasswordScreen}
    />
    <Stack.Screen
      name="FavoriteMovies"
      options={{
        headerShown: true,
        title: "Yêu thích",
        headerTintColor: "#fff", // Màu chữ trắng
        headerTransparent: true,
      }}
      component={FavoriteMoviesScreen}
    />
    <Stack.Screen
      name="ListMovie"
      options={{
        headerShown: true,
        headerTintColor: "#fff", // Màu chữ trắng
        headerStyle: {backgroundColor:Colors.bgBlack}
      }}
      component={MovieVerticalList}
    />
    <Stack.Screen
      name="TicketScreen"
      options={{
        headerShown: true,
        headerTintColor: "#fff", // Màu chữ trắng
        headerStyle: {backgroundColor:Colors.bgBlack}
      }}
      component={TicketScreen}
    />
  </Stack.Navigator>
);

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}

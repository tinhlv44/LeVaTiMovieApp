import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

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
import { useThemeColors } from "../constants/Colors";
import TicketScreen from "../screens/TicketScreen";
import FavoriteMoviesScreen from "../screens/FavoriteMoviesScreen";
import PaymentScreen from "../screens/PaymentScreen";
import AboutScreen from "../screens/AboutScreen";

const Stack = createStackNavigator();

const AppStack = () => {
  const Colors = useThemeColors(); // Lấy màu dựa trên darkMode
  return (
  <Stack.Navigator
    initialRouteName="App"
    screenOptions={{ 
      headerShown: true,
        headerTintColor: Colors.white, 
        headerTransparent: true,
     }}
  >
    <Stack.Screen name="App" component={TabNavigator}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{
        title:'Đăng nhập'
        //title:'Login'
      }}
    />
    <Stack.Screen 
      name="Signup" 
      component={SignupScreen} 
      options={{
        title:'Đăng ký'
        //title:'Register'
      }}
    />
    <Stack.Screen 
      name="ForgotPassword" 
      component={ForgotPasswordScreen} 
      options={{
        title:'Quên mật khẩu'
        //title:'Forgot Password'
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
      options={{
        headerShown:false
      }}
    />
    <Stack.Screen
      name="SeatBooking"
      component={SeatBookingScreen}
    />
    <Stack.Screen
      name="UpdateUser"
      options={{
        title: "Thay đổi thông tin",
        //title: "Change Information",
      }}
      component={UpdateUserScreen}
      
    />

    <Stack.Screen
      name="ChangePassword"
      options={{
        title: "Đổi mật khẩu",
        //title: "Change Password",
      }}
      component={ChangePasswordScreen}
    />
    <Stack.Screen
      name="FavoriteMovies"
      options={{
        title: "Yêu thích",
        //title: "Favorite Movies",
      }}
      component={FavoriteMoviesScreen}
    />
    <Stack.Screen
      name="ListMovie"
      options={{
      }}
      component={MovieVerticalList}
    />
    <Stack.Screen
      name="TicketScreen"
      options={{
        title:'Chi tiết vé'
        //title:'Ticket Detail'
      }}
      component={TicketScreen}
    />
    <Stack.Screen
      name="Payment"
      options={{
        title:'Thanh toán'
        //title:'Payment'
        
      }}
      component={PaymentScreen}
    />
    <Stack.Screen
      name="AboutScreen"
      options={{
        title:'Thông tin'
        //title:'Payment'
        
      }}
      component={AboutScreen}
    />
  </Stack.Navigator>
)};

export default function AppNavigation() {
  const Colors = useThemeColors(); // Lấy màu dựa trên darkMode
  return (
    <NavigationContainer>      
      <StatusBar style={Colors.darkmode ? "light" : "dark" } backgroundColor={Colors.bgBlack} />
      <AppStack />
    </NavigationContainer>
  );
}

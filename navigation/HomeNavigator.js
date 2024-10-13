import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovieScreen from '../screens/MovieScreens';
import PersonScreens from '../screens/PersonScreens';
import SearchScreen from '../screens/SearchScreen';
import HomeScreens from '../screens/HomeScreens';
import SeatBookingScreen from '../screens/SeatBookingScreen';
const Stack = createNativeStackNavigator()
const StackComponent = () =>{
  return(
        <Stack.Navigator>
            <Stack.Screen name='Homes' options={{headerShown: false}} component={HomeScreens}/>
            {/* <Stack.Screen name='Movie' options={{headerShown: false}} component={MovieScreen}/>
            <Stack.Screen name='Person' options={{headerShown: false}} component={PersonScreens}/>
            <Stack.Screen name='Search' options={{headerShown: false}} component={SearchScreen}/>
            <Stack.Screen name='SeatBooking' options={{headerShown: false}} component={SeatBookingScreen}/> */}
        </Stack.Navigator>

  )
}
export default StackComponent;
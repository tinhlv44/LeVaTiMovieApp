import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreens from '../screens/HomeScreens';
import MovieScreen from '../screens/MovieScreens';
import PersonScreens from '../screens/PersonScreens';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator()

export default function AppNavigation() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Home' options={{headerShown: false}} component={HomeScreens}/>
            <Stack.Screen name='Movie' options={{headerShown: false}} component={MovieScreen}/>
            <Stack.Screen name='Person' options={{headerShown: false}} component={PersonScreens}/>
            <Stack.Screen name='Search' options={{headerShown: false}} component={SearchScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}
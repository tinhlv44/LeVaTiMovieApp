import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreens from '../screens/HomeScreens';

const Stack = createNativeStackNavigator()

export default function AppNavigation() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Home' options={{headerShown: false}} component={HomeScreens}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}
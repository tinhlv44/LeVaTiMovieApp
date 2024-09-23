import { NavigationContainer } from '@react-navigation/native';

import TabNavigator from './TabNavigator';


export default function AppNavigation() {
  return (
    <NavigationContainer>
      <TabNavigator/>
    </NavigationContainer>
  )
}
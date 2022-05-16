import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SelectLanguage from '../screens/select-language';
import UserInfo from '../screens/user-info';

const Stack = createStackNavigator();

function MainStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
        <Stack.Screen name="UserInfo" component={UserInfo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default MainStack;

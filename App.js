import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import MainStack from './src/navigation/main';
import RootNavigator from './src/navigation/root';
import FlashMessage from 'react-native-flash-message';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5cb075',
    secondary: '#ffffff',
    background: '#ffffff',
    lightGrey: '#f6f6f6',
    placeholder: '#d5d5d5',
    border: '#d5d5d5',
    text: DefaultTheme.colors.text,
  },
};
const App = () => (
  <PaperProvider theme={theme}>
    <RootNavigator />
    <FlashMessage position="top" />
  </PaperProvider>
);

export default App;

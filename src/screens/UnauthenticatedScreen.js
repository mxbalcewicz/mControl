import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

const UnauthenticatedScreen = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default UnauthenticatedScreen;

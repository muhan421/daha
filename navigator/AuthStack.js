import React from 'react'
import Login from '../screens/LoginScreen';
import Signup from '../screens/SignUpScreen';
import StartScreen from '../screens/StartScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


const AuthStack = ({ }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='StartScreen' component={StartScreen} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='SignUp' component={Signup} />
    </Stack.Navigator>
  );
}

export default AuthStack

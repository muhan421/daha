import { React, useLayoutEffect } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostModal from '../screens/AddingPosts/PostModal';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Button, SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



const Stack = createStackNavigator();

const ProfileStack = ({ navigation }) => {


  const signOutFunction = () => {
    signOut(auth).then(() => {
      navigation.replace('Login')
    }).catch((error) => {
      //an error happened
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <TouchableOpacity style={{ marginRight: 15 }}
            onPress={() => { navigation.navigate("Settings") }} >
            <AntDesign name="setting" size={24} color="white" />
          </TouchableOpacity>
        </HeaderButtons>
      ),
    })
  }, [])

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ProfileScreen' component={ProfileScreen} />
      <Stack.Screen name='Settings' component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack

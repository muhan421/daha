import React from "react";
import AddDahaScreen from "../screens/AddingPosts/AddDahaScreen";
import AddDawaScreen from "../screens/AddingPosts/AddDawaScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostModal from "../screens/AddingPosts/PostModal";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

const PostStack = ({}) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Post" component={PostModal} />
      <Stack.Screen name="AddDaha" component={AddDahaScreen} />
      <Stack.Screen name="AddDawa" component={AddDawaScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default PostStack;

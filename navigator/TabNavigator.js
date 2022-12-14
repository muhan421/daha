import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HistoryScreen from "../screens/HistoryScreen";
import MessagesStack from "./MessageStack";
import Ionicons from "react-native-vector-icons/Ionicons";
import PostStack from "./PostStack";
import ProfileStack from "./ProfileStack";
import FeedStack from "./FeedStack";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const navigation = useNavigation();

  // these props define the top header of each screen from the bottom navigator
  return (
    <Tab.Navigator
      screenOptions={{
        title: "",
        tabBarOptions: {
          showIcon: true,
        },
        headerStyle: {
          backgroundColor: "#a5353a",
        },
        headerTitleStyle: {
          color: "white",
          fontSize: 35,
          fontWeight: "bold",
        },
        tabBarActiveBackgroundColor: "#a5353a",
        tabBarInactiveBackgroundColor: "#a5353a",
        tabBarActiveTintColor: "white",

        tabBarStyle: {
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
          height: "10%",
          backgroundColor: "#a5353a",
        },
      }}
    >
      <Tab.Screen
        name="Main"
        component={FeedStack}
        options={{
          title: "",

          tabBarIcon: ({}) => (
            <Ionicons
              name="home"
              size={30}
              color="white"
              style={{ top: "0%", height: 30 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStack}
        options={{
          tabBarIcon: ({}) => (
            <Ionicons
              name="chatbubble"
              size={30}
              color="white"
              style={{ top: "0%", height: 30, marginRight: "25%" }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="PostStack"
        component={PostStack}
        options={({ navigation }) => ({
          presentation: "modal",
          headerBackTitleVisible: true, // this
          headerBackTitle: "", // add this
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("PostStack")}
              style={{
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.2)",
                alignItems: "center",
                justifyContent: "center",
                top: "-3.5%",
                //left: -4.5,
                width: 55,
                height: 55,
                backgroundColor: "#fff",
                borderRadius: 60,
                right: "auto",
                left: "auto",
              }}
            >
              <Ionicons
                name={"add"}
                size={40}
                color="#a5353a"
                style={{ right: -1.5, top: 1 }}
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({}) => (
            <Ionicons
              name="newspaper"
              size={30}
              color="white"
              style={{ top: "0%", height: 30, marginLeft: "25%" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({}) => (
            <Ionicons
              name="person"
              size={30}
              color="white"
              style={{ top: "0%", height: 30, marginLeft: "0%" }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

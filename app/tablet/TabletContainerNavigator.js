import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./HomeScreen";
import SignInScreen from "../screens/SignInScreen";

const Stack = createStackNavigator();

const TabletContainerNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Home"
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="SignIn" component={SignInScreen} />
  </Stack.Navigator>
);

export default TabletContainerNavigator;

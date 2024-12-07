import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MainScreen from "./screens/MainScreen";
import DepositScreen from "./screens/DepositScreen";
import DepositHistoryScreen from "./screens/DepositHistoryScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import ExchangeScreen from "./screens/ExchangeScreen";
import OperationScreen from "./screens/OperationScreen";
import HistoryScreen from "./screens/HistoryScreen";

const Stack = createStackNavigator();

const App = () => {
  const baseURL = "http://<your_IPv4_here>:8000";

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          initialParams={{ baseURL }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          initialParams={{ baseURL }}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          initialParams={{ baseURL }}
        />
        <Stack.Screen
          name="DepositScreen"
          component={DepositScreen}
          initialParams={{ baseURL }}
        />
        <Stack.Screen
          name="DepositHistoryScreen"
          component={DepositHistoryScreen}
          initialParams={{ baseURL }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          initialParams={{ baseURL }}
        />
        <Stack.Screen
          name="Exchange"
          component={ExchangeScreen}
          initialParams={{ baseURL }}
        />
        <Stack.Screen
          name="Operation"
          component={OperationScreen}
          initialParams={{ baseURL }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          initialParams={{ baseURL }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
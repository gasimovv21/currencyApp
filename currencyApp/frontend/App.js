import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainScreen from './screens/MainScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ExchangeScreen from './screens/ExchangeScreen';
import OperationScreen from './screens/OperationScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createStackNavigator();

const App = () => {
  const [balances, setBalances] = useState({
    EUR: 500,
    PLN: 0,
    USD: 300,
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainScreen} initialParams={{ balances, setBalances }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Exchange" component={ExchangeScreen} />
        <Stack.Screen name="Operation" component={OperationScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
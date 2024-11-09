import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import testData from '../testData.json';

const MainScreen = ({ route, navigation }) => {
  const { userIndex } = route.params;
  const user = testData.users[userIndex];

  const [balances, setBalances] = useState({
    EUR: 500,
    PLN: 0,
    USD: 300,
  });

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Hello, {user ? user.first_name : 'User'}!</Text>
        <Text style={styles.heading}>Your Balances</Text>
        <Text style={styles.balance}>EUR Balance: {balances.EUR}</Text>
        <Text style={styles.balance}>PLN Balance: {balances.PLN}</Text>
        <Text style={styles.balance}>USD Balance: {balances.USD}</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Exchange"
            onPress={() => navigation.navigate('Exchange', { balances, setBalances })}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
            color="#007AFF"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  balance: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
});

export default MainScreen;
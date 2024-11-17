import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const DepositScreen = ({ route, navigation }) => {
  const { currencyCode } = route.params;
  const [depositAmount, setDepositAmount] = useState('');
  const userId = 1;

  const handleDeposit = async () => {
    // Validate deposit amount
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid deposit amount.');
      return;
    }

    try {
      const depositData = { user_currency_account_code: currencyCode, amount: depositAmount };

      const response = await axios.post(
        `http://192.168.0.247:8000/api/currency-accounts/deposit/${userId}/`,
        depositData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Deposit Successful', `You have successfully deposited ${depositAmount} ${currencyCode}.`);
      } else {
        Alert.alert('Deposit Failed', 'Something went wrong, please try again later.');
      }
    } catch (error) {
      console.error('Deposit Error:', error);
      Alert.alert('Deposit Failed', 'An error occurred while processing the deposit.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Deposit Money</Text>
      <Text style={styles.info}>You are depositing into your {currencyCode} account.</Text>

      <TextInput
        style={styles.input}
        placeholder={`Enter deposit amount in ${currencyCode}`}
        keyboardType="numeric"
        value={depositAmount}
        onChangeText={setDepositAmount}
      />

      <Button title="Deposit" onPress={handleDeposit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 18,
  },
});

export default DepositScreen;
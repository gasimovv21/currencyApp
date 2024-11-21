import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const DepositScreen = ({ route, navigation }) => {
  const { currencyCode, user_id } = route.params;
  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid deposit amount.');
      return;
    }

    try {
      const depositData = { user_currency_account_code: currencyCode, amount: depositAmount };

      const response = await axios.post(
        `http://192.168.0.247:8000/api/currency-accounts/deposit/${user_id}/`,
        depositData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Deposit Successful', `You have successfully deposited ${depositAmount} ${currencyCode}.`);
        navigation.goBack();
      } else {
        Alert.alert('Deposit Failed', 'Something went wrong, please try again later.');
      }
    } catch (error) {
      console.error('Deposit Error:', error);
      Alert.alert('Deposit Failed', 'An error occurred while processing the deposit.');
    }
  };

  const handleInputChange = (value) => {
    const formattedValue = value.replace(',', '.');
    setDepositAmount(formattedValue);
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
        onChangeText={handleInputChange}
      />

      <TouchableOpacity style={styles.depositButton} onPress={handleDeposit}>
        <Text style={styles.buttonText}>Deposit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4e4e4e',
  },
  info: {
    fontSize: 18,
    marginBottom: 30,
    color: '#7a7a7a',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  depositButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DepositScreen;
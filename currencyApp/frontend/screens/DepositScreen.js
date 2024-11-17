import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DepositScreen = ({ route, navigation }) => {
  const { currencyCode } = route.params;

  const handleDeposit = () => {
    // Handle deposit functionality here
    alert('Deposit successful!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Deposit Money</Text>
      <Text style={styles.info}>You are depositing into your {currencyCode} account.</Text>
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
});

export default DepositScreen;
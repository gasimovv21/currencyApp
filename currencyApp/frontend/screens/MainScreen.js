import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Alert, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import testData from '../testData.json';

const MainScreen = ({ route }) => {
  const { userIndex } = route.params;
  const user = testData.users[userIndex];
  
  // Set initial states for user accounts and loading
  const [currencyAccounts, setCurrencyAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation(); // Get navigation instance

  // Fetch currency account data
  const fetchCurrencyAccounts = async () => {
    try {
      const response = await axios.get(`  tp://192.168.0.247:8000/api/currency-accounts/3/`);
      const data = response.data;
      
      // Check if the response contains valid data (assuming it's an object with account details)
      if (Array.isArray(data)) {
        setCurrencyAccounts(data); // Handle array response if multiple accounts
      } else {
        setCurrencyAccounts([data]); // Handle object response as a single account in an array
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch currency accounts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencyAccounts();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('EditProfile')}>
          <Image
            source={require('../assets/edit-profile-icon.png')} // Replace with your correct path to the image
            style={styles.editProfileIcon}
          />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Hello, {user ? user.first_name : 'User'}!</Text>
        
        {/* Add space between greeting and "Your Currency Accounts" */}
        <Text style={styles.heading}>Your Currency Accounts</Text>

        {loading ? (
          <Text>Loading accounts...</Text>
        ) : (
          <ScrollView style={styles.cardsContainer}>
            {currencyAccounts.map((account) => (
              <View key={account.account_id} style={styles.card}>
                <Text style={styles.cardTitle}>Account {account.currency_code}</Text>
                <Text style={styles.cardText}>Account Number: {`XXX-XXX-${Math.floor(Math.random() * 1000)}`}</Text>
                <Text style={styles.cardText}>Balance: {account.balance} {account.currency_code}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Exchange"
            onPress={() => navigation.navigate('Exchange', { balances: currencyAccounts })}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
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
    marginBottom: 40,  // Increased space between greeting and heading
    marginTop: 60,     // Added margin-top to create more space from "Hello, User!" text
  },
  cardsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  // Style for the Edit Profile icon image
  editProfileIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain', // Adjust to fit the button size
    marginRight: 20, // Optional: Add spacing
  },
});

export default MainScreen;

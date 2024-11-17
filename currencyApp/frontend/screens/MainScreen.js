import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Alert, Image } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const MainScreen = ({ route }) => {
  const { userIndex } = route.params;
  const [currencyAccounts, setCurrencyAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchCurrencyAccounts = async () => {
    try {
      const response = await axios.get(`http://192.168.0.247:8000/api/currency-accounts/user/${userIndex}/`);
      setCurrencyAccounts(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch currency accounts');
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCurrencyAccounts();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('EditProfile')}>
          <Image
            source={require('../assets/edit-profile-icon.png')}
            style={styles.editProfileIcon}
          />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Hello, {userIndex ? userIndex : 'User'}!</Text>
        
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
    marginBottom: 40,
    marginTop: 60,
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
  editProfileIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 20,
  },
});

export default MainScreen;
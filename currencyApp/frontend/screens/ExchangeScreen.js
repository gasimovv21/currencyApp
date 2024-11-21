import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const ExchangeScreen = ({ route, navigation }) => {
  const { user_id, first_name } = route.params;
  const [userCurrencies, setUserCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCurrencies = async () => {
      try {
        const response = await axios.get(`http://192.168.0.247:8000/api/currency-accounts/user/${user_id}/`);
        setUserCurrencies(response.data);
      } catch (error) {
        console.error('Error fetching user currencies:', error);
        Alert.alert('Error', 'Failed to fetch your accounts.');
      }
    };

    fetchUserCurrencies();
  }, [user_id]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const currencyCodes = userCurrencies
          .filter((currency) => currency.currency_code !== 'PLN')
          .map((currency) => currency.currency_code.toUpperCase());
  
        const ratePromises = currencyCodes.map((currency) =>
          fetch(`https://api.nbp.pl/api/exchangerates/rates/c/${currency.toLowerCase()}/?format=json`)
        );
  
        const responses = await Promise.all(ratePromises);
  
        const rateData = await Promise.all(responses.map(async (response) => {
          const text = await response.text();
          if (response.status === 404 || !text.includes('rates')) {
            console.error(`No data for currency: ${response.url}`);
            return { error: `No data for currency: ${response.url}` };
          }
  
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error('Error parsing exchange rate response:', e, text);
            return { error: 'Invalid JSON response' };
          }
        }));
  
        const rates = {};
        rateData.forEach((data, index) => {
          if (data.error) {
            rates[currencyCodes[index]] = { error: data.error };
          } else {
            const currency = currencyCodes[index];
            const rate = data.rates[0] || {};
            rates[currency] = {
              bid: rate.bid || 'N/A',
              ask: rate.ask || 'N/A',
            };
          }
        });
  
        setExchangeRates(rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (userCurrencies.length > 0) {
      fetchExchangeRates();
    }
  }, [userCurrencies]);

  const navigateToOperation = (fromCurrency, toCurrency, rate, type, exchangeRate) => {
    navigation.navigate('Operation', {
      fromCurrency,
      toCurrency,
      rate,
      type,
      exchangeRate,
      user_id: user_id,
      first_name: first_name
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
            style={styles.cardsContainer}
            contentContainerStyle={styles.scrollViewContent}
            //keyboardShouldPersistTaps="handled"
          >
      {userCurrencies.filter((currency) => currency.currency_code !== 'PLN').length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>You don't have an account other than PLN account.</Text>
          <Text style={styles.message}>If you would like to exchange money, you must create at least one account.</Text>
        </View>
      ) : (
        userCurrencies
          .filter((currency) => currency.currency_code !== 'PLN')
          .map((currency) => (
            <View key={currency.account_id} style={styles.card}>
              <Text style={styles.cardTitle}>{currency.currency_code}/PLN</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigateToOperation(currency.currency_code, 'PLN', 'bid', 'SELL', String(exchangeRates[currency.currency_code]?.['bid']))}
                >
                  <Text style={styles.buttonText}>SELL {currency.currency_code}</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigateToOperation('PLN', currency.currency_code, 'ask', 'BUY', String(exchangeRates[currency.currency_code]?.['ask']))}
                >
                  <Text style={styles.buttonText}>BUY {currency.currency_code}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rateContainer}>
                {exchangeRates[currency.currency_code]?.error ? (
                  <Text style={styles.rate}>Error: {exchangeRates[currency.currency_code].error}</Text>
                ) : (
                  <>
                    <Text style={styles.rate}>Bid: {exchangeRates[currency.currency_code]?.bid || 'N/A'}</Text>
                    <Text style={styles.rate}>Ask: {exchangeRates[currency.currency_code]?.ask || 'N/A'}</Text>
                  </>
                )}
              </View>
            </View>
          ))
      )}
      <Button title="Exchange History" onPress={() => navigation.navigate('History', {
        user_id: user_id
      })} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '90%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  cardsContainer: {
    width: '100%',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  rateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  rate: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ExchangeScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const ExchangeScreen = ({ navigation }) => {
  const [exchangeRates, setExchangeRates] = useState({ USD: null, EUR: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const usdResponse = await fetch('https://api.nbp.pl/api/exchangerates/rates/c/usd/?format=json');
        const eurResponse = await fetch('https://api.nbp.pl/api/exchangerates/rates/c/eur/?format=json');
        const usdData = await usdResponse.json();
        const eurData = await eurResponse.json();

        setExchangeRates({
          USD: { bid: usdData.rates[0].bid, ask: usdData.rates[0].ask },
          EUR: { bid: eurData.rates[0].bid, ask: eurData.rates[0].ask },
        });
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const navigateToOperation = (fromCurrency, toCurrency, rate, type) => {
    navigation.navigate('Operation', {
      fromCurrency,
      toCurrency,
      rate,
      type,
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {['EUR', 'USD'].map((currency) => (
        <View key={currency} style={styles.card}>
          <Text style={styles.cardTitle}>{currency}/PLN</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigateToOperation(currency, 'PLN', 'bid', 'SELL')}
            >
              <Text style={styles.buttonText}>SELL {currency}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigateToOperation('PLN', currency, 'ask', 'BUY')}
            >
              <Text style={styles.buttonText}>BUY {currency}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rateContainer}>
            <Text style={styles.rate}>Bid: {exchangeRates[currency].bid}</Text>
            <Text style={styles.rate}>Ask: {exchangeRates[currency].ask}</Text>
          </View>
        </View>
      ))}
      <Button title="Exchange History" onPress={() => navigation.navigate('History')} />
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
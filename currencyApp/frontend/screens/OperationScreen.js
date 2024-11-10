import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const OperationScreen = ({ route, navigation }) => {
  const { fromCurrency, toCurrency, rate, type, exchangeRate } = route.params;
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [chartData, setChartData] = useState(null);

  // Convert input value 1 to input value 2 or vice versa
  const handleAmount1Change = (value) => {
    setAmount1(value);
    if (value) {
      const convertedValue = parseFloat(value) * parseFloat(exchangeRate);
      setAmount2(convertedValue.toFixed(2));
    } else {
      setAmount2('');
    }
  };

  const handleAmount2Change = (value) => {
    setAmount2(value);
    if (value) {
      const convertedValue = parseFloat(value) / parseFloat(exchangeRate);
      setAmount1(convertedValue.toFixed(2));
    } else {
      setAmount1('');
    }
  };

  const handleConversion = () => {
    const numericAmount1 = parseFloat(amount1);
    const numericAmount2 = parseFloat(amount2);

    if (isNaN(numericAmount1) || numericAmount1 <= 0 || isNaN(numericAmount2) || numericAmount2 <= 0) {
      Alert.alert('Invalid amount', 'Please enter valid numbers greater than 0.');
      return;
    }

    // Logic to update the balances after conversion (you will need to implement this part)
    Alert.alert(
      'Success!',
      `You completed an exchange from ${numericAmount1.toFixed(2)} ${fromCurrency} to ${numericAmount2.toFixed(2)} ${toCurrency}.`
    );

    // Optionally, here you should update the user’s balance in your database
    // Example: updateBalance(numericAmount1, numericAmount2);
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `https://api.nbp.pl/api/exchangerates/rates/c/${(type === 'SELL' ? fromCurrency : toCurrency).toLowerCase()}/last/10/?format=json`
      );

      if (response.ok) {
        const responseText = await response.text();
        const data = JSON.parse(responseText);
        const values = data.rates.map((item) => (type === 'SELL' ? item.ask : item.bid));

        setChartData({
          labels: Array(10).fill(''),
          datasets: [
            {
              data: values,
              strokeWidth: 2,
            },
          ],
        });
      } else {
        console.error('API call failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [fromCurrency, rate, type]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {chartData && (
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 20}
              height={220}
              yAxisSuffix="zł"
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
            />
          )}

          <Text style={styles.title}>You {type} {(type === 'SELL' ? fromCurrency : toCurrency)}</Text>
          <Text style={styles.subtitle}>Enter the amount:</Text>

          <TextInput
            style={styles.input}
            placeholder={`Enter amount in ${fromCurrency}`}
            keyboardType="numeric"
            value={amount1}
            onChangeText={handleAmount1Change}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <Text style={styles.title}>You will get:</Text>
          <Text style={styles.subtitle}>Enter the amount:</Text>

          <TextInput
            style={styles.input}
            placeholder={`Enter amount in ${toCurrency}`}
            keyboardType="numeric"
            value={amount2}
            onChangeText={handleAmount2Change}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <Button title={`Convert ${type}`} onPress={handleConversion} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
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
  result: {
    fontSize: 20,
    color: '#333',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default OperationScreen;
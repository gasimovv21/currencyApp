import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const OperationScreen = ({ route, navigation }) => {
  const { fromCurrency, toCurrency, rate, type } = route.params; // rate is either 'bid' or 'ask'
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [chartData, setChartData] = useState(null);

  const handleConversion = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid number greater than 0.');
      return;
    }

    // Calculate the converted amount
    const result = numericAmount * rate; // This rate is either 'bid' or 'ask' number value
    setConvertedAmount(result);

    // Optionally, redirect or save the operation here
    Alert.alert('Conversion Successful', `You ${type} ${numericAmount} ${fromCurrency} to ${result.toFixed(2)} ${toCurrency}`);
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch(`https://api.nbp.pl/api/exchangerates/rates/c/${fromCurrency.toLowerCase()}/last/10/?format=json`);
      
      // Log response status to check if it's successful (200 OK)
      console.log('Response Status:', response.status);

      // Read the response body as text (instead of immediately trying to parse it as JSON)
      const responseText = await response.text();
      console.log('Response Text:', responseText); // Log the raw response body

      // If the response status is OK, parse it as JSON
      if (response.status === 200) {
        const data = JSON.parse(responseText);

        const values = data.rates.map(item => item[rate]); // Use 'bid' or 'ask' based on passed rate

        setChartData({
          labels: Array(10).fill(''), // Empty labels to avoid showing dates
          datasets: [
            {
              data: values,
              strokeWidth: 2,
            },
          ],
        });
      } else {
        console.error('Error: Invalid response status', response.status);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [fromCurrency, rate]);

  return (
    <View style={styles.container}>
      {/* Place the chart above other elements */}
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

      <Text style={styles.title}>Convert {fromCurrency} to {toCurrency}</Text>
      <Text style={styles.subtitle}>{type} {toCurrency}</Text>

      <TextInput
        style={styles.input}
        placeholder={`Enter amount in ${fromCurrency}`}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Button title={`Convert ${type}`} onPress={handleConversion} />

      {convertedAmount !== null && (
        <Text style={styles.result}>
          {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
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
  result: {
    fontSize: 20,
    color: '#333',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default OperationScreen;
import React, { useState, useEffect } from "react";
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
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import axios from "axios";

const OperationScreen = ({ route, navigation }) => {
  const {
    fromCurrency,
    toCurrency,
    rate,
    type,
    exchangeRate,
    user_id,
    first_name,
    baseURL,
  } = route.params;
  const [visualAmount1, setVisualAmount1] = useState("");
  const [visualAmount2, setVisualAmount2] = useState("");
  const [realAmount1, setRealAmount1] = useState("");
  const [realAmount2, setRealAmount2] = useState("");
  const [chartData, setChartData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAmount1Change = (value) => {
    const formattedValue = value.replace(",", ".");
    const regex = /^\d*(\.\d{0,2})?$/;
    if (!regex.test(formattedValue)) return;

    setVisualAmount1(formattedValue);
    if (parseFloat(formattedValue) < 1) {
      setErrorMessage("Minimum amount is 1,00");
    } else {
      setErrorMessage("");
    }

    if (formattedValue) {
      const convertedValue =
      parseFloat(formattedValue) * parseFloat(exchangeRate);
      setRealAmount1(value);
      setRealAmount2(convertedValue);
      setVisualAmount2(convertedValue.toFixed(2));
    } else {
      setVisualAmount2("");
      setRealAmount2("");
    }
  };

  const handleAmount2Change = (value) => {
    const formattedValue = value.replace(",", ".");
    const regex = /^\d*(\.\d{0,2})?$/; // Allows up to 2 decimal places
    if (!regex.test(formattedValue)) return;

    setVisualAmount2(formattedValue);
    if (formattedValue) {
      const convertedValue =
        parseFloat(formattedValue) / parseFloat(exchangeRate);
        setRealAmount1(convertedValue);
        setRealAmount2(value);
        setVisualAmount1(convertedValue.toFixed(2));
        if (parseFloat(convertedValue.toFixed(2)) < 1) {
          setErrorMessage("Minimum amount is 1,00");
        } else {
          setErrorMessage("");
        }
      } else {
        setVisualAmount1("");
        setRealAmount2("");
      }
  };

  const handleConversion = async () => {
    const numericAmount1 = parseFloat(realAmount1);
    const numericAmount2 = parseFloat(realAmount2);

    if (
      isNaN(numericAmount1) ||
      numericAmount1 <= 0
    ) {
      Alert.alert(
        "Invalid amount",
        "Please enter valid numbers greater than 0."
      );
      return;
    }

    try {
      const payload = {
        from_currency: fromCurrency,
        to_currency: toCurrency,
        amount: numericAmount1,
      };

      const response = await axios.post(
        `${baseURL}/api/currency-accounts/convert/${user_id}/`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Success!",
          `${
            type === "SELL"
              ? `You completed an exchange from ${numericAmount1.toFixed(
                  2
                )} ${fromCurrency} to ${numericAmount2.toFixed(
                  2
                )} ${toCurrency}.`
              : `You completed an exchange from ${numericAmount2.toFixed(
                  2
                )} ${fromCurrency} to ${numericAmount1.toFixed(
                  2
                )} ${toCurrency}.`
          }`,
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Main", {
                  user_id: user_id,
                  first_name: first_name,
                });
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Conversion failed",
          "Something went wrong, please try again later."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to complete the conversion. Please check your inputs and try again."
      );
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `https://api.nbp.pl/api/exchangerates/rates/c/${(type === "SELL"
          ? fromCurrency
          : toCurrency
        ).toLowerCase()}/last/10/?format=json`
      );

      if (response.ok) {
        const responseText = await response.text();
        const data = JSON.parse(responseText);
        const values = data.rates.map((item) =>
          type === "BUY" ? item.ask : item.bid
        );

        setChartData({
          labels: Array(10).fill(""),
          datasets: [
            {
              data: values,
              strokeWidth: 2,
            },
          ],
        });
      } else {
        console.error("API call failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [fromCurrency, rate, type]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          You are exchanging {fromCurrency} for {toCurrency}
        </Text>
        <View style={styles.container}>
          {chartData && (
            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 20}
              height={220}
              yAxisSuffix="zł"
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
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

          <Text style={styles.subtitle}>
            {type === "SELL" ? "You are selling:" : "You are buying:"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={`Enter amount in ${type === "SELL" ? fromCurrency : toCurrency}`}
            keyboardType="numeric"
            value={visualAmount1}
            onChangeText={handleAmount1Change}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
            {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}


          <Text style={styles.subtitle}>
            {type === "SELL" ? "You will get:" : "You will pay:"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={`Enter amount in ${
              type === "SELL" ? toCurrency : fromCurrency
            }`}
            keyboardType="numeric"
            value={visualAmount2}
            onChangeText={handleAmount2Change}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

                      
            <TouchableOpacity
            style={[
              styles.convertButton,
              {
                opacity:
                  errorMessage !== ""
                    ? 0.5
                    : 1,
              },
            ]}
            disabled={errorMessage !== ""}
            onPress={handleConversion}
          >
            <Text style={styles.convertButtonText}>Convert</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  convertButton: {
    padding: 15,
    backgroundColor: "#f27919",
    borderRadius: 5,
    width: "60%",
    alignItems: "center",
  },
  convertButtonText: {
    fontSize: 18,
    color: "white",
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 5,
    marginTop: 20,
    textAlign: "left",
    width: "80%",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -15,
    marginBottom: 10,
    marginLeft: 40,
    alignSelf: "flex-start",
    width: "80%",
  },
  result: {
    fontSize: 20,
    color: "#333",
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default OperationScreen;

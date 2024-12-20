import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";

const HistoryScreen = ({ route }) => {
  const { user_id, baseURL } = route.params;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/currency-accounts/history/${user_id}/`
      );
      setHistory(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch exchange history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Exchange History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4caf50" />
      ) : history.length === 0 ? (
        <Text style={styles.noHistory}>No exchange history yet.</Text>
      ) : (
        <ScrollView style={styles.historyContainer}>
          {history.map((item) => (
            <View key={item.history_id} style={styles.historyCard}>
              <View style={styles.actionRow}>
                <Text
                  style={[
                    styles.actionText,
                    { color: item.action === "income" ? "#4caf50" : "#f44336" },
                  ]}
                >
                  {item.action === "income" ? "Income" : "Expense"}
                </Text>
                <Text
                  style={[
                    styles.amountText,
                    { color: item.action === "income" ? "#4caf50" : "#f44336" },
                  ]}
                >
                  {item.action === "income"
                    ? `+${item.amount}`
                    : `-${item.amount}`}
                </Text>
              </View>
              <Text style={styles.currencyText}>Currency: {item.currency}</Text>
              <Text style={styles.dateText}>Date: {item.created_at}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  noHistory: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
  historyContainer: {
    marginTop: 10,
  },
  historyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  currencyText: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
});

export default HistoryScreen;

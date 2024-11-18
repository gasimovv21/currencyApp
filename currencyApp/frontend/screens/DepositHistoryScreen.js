import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const DepositHistoryScreen = ({ route }) => {
  const { currencyCode } = route.params;
  const [depositHistory, setDepositHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 1;

  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.247:8000/api/currency-accounts/deposit/${userId}/?currency_code=${currencyCode}`
        );
        setDepositHistory(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepositHistory();
  }, [currencyCode]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Deposit History for {currencyCode}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4caf50" />
      ) : depositHistory.length === 0 ? (
        <Text style={styles.noHistory}>No deposit history available.</Text>
      ) : (
        <ScrollView style={styles.historyContainer}>
          {depositHistory.map((item, index) => (
            <View key={item.id || index} style={styles.historyCard}>
              <View style={styles.actionRow}>
                <Text style={styles.amountText}>+{item.amount} {currencyCode}</Text>
              </View>
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
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  noHistory: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  historyContainer: {
    marginTop: 10,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});

export default DepositHistoryScreen;
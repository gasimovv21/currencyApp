import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const DepositHistoryScreen = ({ route }) => {
  const { currencyCode } = route.params;
  const [depositHistory, setDepositHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with the actual API for fetching deposit history
    const fetchDepositHistory = async () => {
      try {
        const response = await axios.get(`http://192.168.0.247:8000/api/deposits/history/${currencyCode}/`);
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
        <ActivityIndicator size="large" color="#0000ff" />
      ) : depositHistory.length === 0 ? (
        <Text>No deposit history available.</Text>
      ) : (
        <ScrollView style={styles.historyContainer}>
          {depositHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <Text style={styles.historyText}>Amount: {item.amount} {currencyCode}</Text>
              <Text style={styles.historyText}>Date: {item.date}</Text>
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
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  historyContainer: {
    marginTop: 10,
  },
  historyCard: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  historyText: {
    fontSize: 16,
  },
});

export default DepositHistoryScreen;
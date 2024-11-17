import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const HistoryScreen = () => {
  const userId = 1;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://192.168.0.247:8000/api/currency-accounts/history/${userId}/`);
      setHistory(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch exchange history');
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
        <ActivityIndicator size="large" color="#0000ff" />
      ) : history.length === 0 ? (
        <Text style={styles.noHistory}>No exchange history yet.</Text>
      ) : (
        <ScrollView style={styles.historyContainer}>
          {history.map((item) => (
            <View key={item.history_id} style={styles.historyCard}>
              <Text style={styles.historyText}>Action: {item.action}</Text>
              <Text style={styles.historyText}>Currency: {item.currency}</Text>
              <Text style={styles.historyText}>Amount: {item.amount}</Text>
              <Text style={styles.historyDate}>Date: {item.created_at}</Text>
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
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 5,
  },
  historyDate: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
  },
});

export default HistoryScreen;
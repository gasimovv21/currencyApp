import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Alert, Image, Animated, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const MainScreen = ({ route }) => {
  const { userIndex } = route.params;
  const [currencyAccounts, setCurrencyAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(null);
  const [animation] = useState(new Animated.Value(0));
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

  const handleDeleteAccount = async (accountId) => {
    try {
      await axios.delete(`http://192.168.0.247:8000/api/currency-accounts/${accountId}/`);
      Alert.alert('Success', 'Currency account deleted successfully.');
      fetchCurrencyAccounts(); // Refresh accounts after deletion
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete currency account.');
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

  const handleShowOptions = (accountId) => {
    setShowOptions(accountId);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleHideOptions = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => setShowOptions(null));
  };

  const handleBackgroundPress = () => {
    if (showOptions !== null) {
      handleHideOptions();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Hello, {userIndex ? userIndex : 'User'}!</Text>
        {loading ? (
          <Text>Loading accounts...</Text>
        ) : (
          <ScrollView
            style={styles.cardsContainer}
            contentContainerStyle={styles.scrollViewContent}
          >
            <Text style={styles.heading}>Your Currency Accounts</Text>
            {currencyAccounts.map((account) => (
              <View key={account.account_id} style={styles.card}>
                <Text style={styles.cardTitle}>Account {account.currency_code}</Text>
                <Text style={styles.cardText}>Account Number: {`XXX-XXX-${Math.floor(Math.random() * 1000)}`}</Text>
                <Text style={styles.cardText}>Balance: {account.balance} {account.currency_code}</Text>

                <TouchableWithoutFeedback onPress={() => handleShowOptions(account.account_id)}>
                  <Image
                    source={require('../assets/balance-cards-threedots.png')}
                    style={styles.optionsIcon}
                  />
                </TouchableWithoutFeedback>

                {showOptions === account.account_id && (
                  <Animated.View
                    style={[styles.floatingOptions, {
                      opacity: animation,
                      transform: [{
                        translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] })
                      }]
                    }]}
                  >
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => {
                        navigation.navigate('DepositScreen', { currencyCode: account.currency_code });
                        handleHideOptions();
                      }}
                    >
                      <Text style={styles.optionButtonText}>Top Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => {
                        navigation.navigate('DepositHistoryScreen', { currencyCode: account.currency_code });
                        handleHideOptions();
                      }}
                    >
                      <Text style={styles.optionButtonText}>Deposit History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.deleteButton,
                        { opacity: account.balance !== "0.00" || account.currency_code === "PLN" ? 0.5 : 1 }
                      ]}
                      disabled={account.balance !== "0.00" || account.currency_code === "PLN" }
                      onPress={() => {
                        Alert.alert(
                          'Confirm Delete',
                          'Are you sure you want to remove this currency account?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => handleDeleteAccount(account.account_id) }
                          ]
                        );
                      }}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => navigation.navigate('Exchange', { balances: currencyAccounts })}
          >
            <Text style={styles.mainButtonText}>Exchange</Text>
          </TouchableOpacity>
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
  scrollViewContent: {
    alignItems: 'center',
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
  optionsIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 25,
    height: 25,
    resizeMode: 'contain',
    zIndex: 1,
  },
  floatingOptions: {
    position: 'absolute',
    top: -120,
    right: 0,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    width: 150,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    zIndex: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  mainButton: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editProfileIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 20,
  },
});

export default MainScreen;
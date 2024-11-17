import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Alert, Image, Animated } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const MainScreen = ({ route }) => {
  const { userIndex } = route.params;
  const [currencyAccounts, setCurrencyAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(null); // State for showing options
  const [animation] = useState(new Animated.Value(0)); // Animation for sliding in/out the options
  const optionsRef = useRef(null); // Ref for the options pop-up container
  const optionsPositions = useRef([]); // Store the options positions dynamically
  const optionsButtonRefs = useRef([]); // Ref to store button refs dynamically
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

  const handleShowOptions = (accountId, index) => {
    setShowOptions(accountId);

    // Get the button's position using measure
    optionsButtonRefs.current[index].measure((x, y, width, height, pageX, pageY) => {
      optionsPositions.current[index] = { x: pageX, y: pageY };

      // Trigger animation to make the options slide in
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleHideOptions = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => setShowOptions(null)); // Reset the state after animation completes
  };

  // Function to handle clicks outside the options
  const handleBackgroundPress = (e) => {
    if (showOptions !== null && optionsRef.current) {
      // Measure the position and size of the options pop-up
      optionsRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Check if the touch is outside the bounds of the options pop-up
        if (
          e.nativeEvent.pageX < pageX || // Touch is to the left of the options
          e.nativeEvent.pageX > pageX + width || // Touch is to the right of the options
          e.nativeEvent.pageY < pageY || // Touch is above the options
          e.nativeEvent.pageY > pageY + height // Touch is below the options
        ) {
          handleHideOptions(); // Hide the options if touched outside
        }
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Hello, {userIndex ? userIndex : 'User'}!</Text>

        <Text style={styles.heading}>Your Currency Accounts</Text>

        {loading ? (
          <Text>Loading accounts...</Text>
        ) : (
          <ScrollView style={styles.cardsContainer}>
            {currencyAccounts.map((account, index) => (
              <View key={account.account_id} style={styles.card}>
                <Text style={styles.cardTitle}>Account {account.currency_code}</Text>
                <Text style={styles.cardText}>Account Number: {`XXX-XXX-${Math.floor(Math.random() * 1000)}`}</Text>
                <Text style={styles.cardText}>Balance: {account.balance} {account.currency_code}</Text>

                {/* Options button with ref */}
                <TouchableWithoutFeedback
                  onPress={() => handleShowOptions(account.account_id, index)}>
                  <View
                    ref={(el) => (optionsButtonRefs.current[index] = el)} // Dynamically set ref
                    style={styles.optionsButton}>
                    <Text style={styles.optionsText}>Options</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Animated floating buttons */}
        {showOptions && (
          <Animated.View
            ref={optionsRef}  // Attach ref to the options pop-up container
            style={[
              styles.floatingOptions,
              {
                opacity: animation,
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-80, 0], // Adjust sliding position to create more space above
                    }),
                  },
                  {
                    translateX: optionsPositions.current[currencyAccounts.findIndex(acc => acc.account_id === showOptions)].x, // Dynamically adjust horizontal position
                  },
                ],
              },
            ]}
          >
            <Button
              title="Top Up"
              onPress={() => {
                navigation.navigate('DepositScreen', { currencyCode: showOptions.currency_code });
                handleHideOptions();
              }}
            />
            <Button
              title="Deposit History"
              onPress={() => {
                navigation.navigate('DepositHistoryScreen', { currencyCode: showOptions.currency_code });
                handleHideOptions();
              }}
            />
          </Animated.View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Exchange"
            onPress={() => navigation.navigate('Exchange', { balances: currencyAccounts })}
          />
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
    overflow: 'visible', // Ensure no clipping happens
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
    position: 'relative', // Ensure the options button is positioned correctly
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
  optionsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  optionsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  floatingOptions: {
    position: 'absolute',
    top: 70, // Adjusted to make sure it's higher above the options button
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
    zIndex: 9999, // Ensure this pop-up is on top of every other element
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  editProfileIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 15,
  },
});

export default MainScreen;
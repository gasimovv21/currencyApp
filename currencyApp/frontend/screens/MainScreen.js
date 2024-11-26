import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Image,
  Animated,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const MainScreen = ({ route }) => {
  const { user_id, first_name, baseURL } = route.params;
  const [currencyAccounts, setCurrencyAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(null);
  const [animation] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accountType, setAccountType] = useState("USD");
  const navigation = useNavigation();

  const fetchCurrencyAccounts = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/currency-accounts/user/${user_id}/`
      );
      setCurrencyAccounts(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch currency accounts");
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      const response = await axios.delete(
        `${baseURL}/api/currency-accounts/${accountId}/`
      );
      if (response.status === 200 || response.status === 204) {
        Alert.alert("Success", "Currency account deleted successfully.");
        fetchCurrencyAccounts();
      } else {
        Alert.alert("Error", "Failed to delete currency account.");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        Alert.alert("Error", "Bad Request: Failed to delete currency account.");
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
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
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate("EditProfile", { user_id: user_id })
          }
        >
          <Image
            source={require("../assets/edit-profile-icon.png")}
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
    if (isModalVisible) {
      setIsModalVisible(false);
      setAccountType("");
    }
  };

  const handleAddAccountButtonPress = () => {
    setAccountType("USD");
    setIsModalVisible(true);
  };

  const handleCreateAccount = async () => {
    console.log(typeof accountType + " " + accountType)
    try {
      const response = await axios.post(`${baseURL}/api/currency-accounts/`, {
        currency_code: accountType,
        user: user_id,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Currency account created and ready to use.");
        setIsModalVisible(false);
        setAccountType("");
        fetchCurrencyAccounts();
      } else {
        Alert.alert("Error", "Failed to create currency account.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert(
          "Could not be created",
          "You already have an account in this currency."
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={styles.container}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Hello, {first_name ? first_name : "User"}!
          </Text>
          {loading && (
            <Text style={styles.loadingText}>Loading accounts...</Text>
          )}
        </View>
        {!loading && (
          <ScrollView
            style={styles.cardsContainer}
            contentContainerStyle={styles.scrollViewContent}
          >
            <Text style={styles.heading}>Your Currency Accounts</Text>
            {currencyAccounts.map((account) => (
              <View key={account.account_id} style={styles.card}>
                <Text style={styles.cardTitle}>
                  Account {account.currency_code}
                </Text>
                <Text style={styles.cardText}>
                  Account Number:{" "}
                  {`XXX-XXX-${Math.floor(Math.random() * 1000)}`}
                </Text>
                <Text style={styles.cardText}>
                  Balance: {account.balance} {account.currency_code}
                </Text>

                <TouchableWithoutFeedback
                  onPress={() => handleShowOptions(account.account_id)}
                >
                  <Image
                    source={require("../assets/balance-cards-threedots.png")}
                    style={styles.optionsIcon}
                  />
                </TouchableWithoutFeedback>

                {showOptions === account.account_id && (
                  <Animated.View
                    style={[
                      styles.floatingOptions,
                      {
                        opacity: animation,
                        transform: [
                          {
                            translateY: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-50, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => {
                        navigation.navigate("DepositScreen", {
                          currencyCode: account.currency_code,
                          user_id: user_id,
                        });
                        handleHideOptions();
                      }}
                    >
                      <Text style={styles.optionButtonText}>Top Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => {
                        navigation.navigate("DepositHistoryScreen", {
                          currencyCode: account.currency_code,
                          user_id: user_id,
                        });
                        handleHideOptions();
                      }}
                    >
                      <Text style={styles.optionButtonText}>
                        Deposit History
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.deleteButton,
                        {
                          opacity:
                            account.balance !== "0.00" ||
                            account.currency_code === "PLN"
                              ? 0.5
                              : 1,
                        },
                      ]}
                      disabled={
                        account.balance !== "0.00" ||
                        account.currency_code === "PLN"
                      }
                      onPress={() => {
                        Alert.alert(
                          "Confirm Delete",
                          "Are you sure you want to remove this currency account?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () =>
                                handleDeleteAccount(account.account_id),
                            },
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
            style={styles.exchangeButton}
            onPress={() =>
              navigation.navigate("Exchange", {
                balances: currencyAccounts,
                user_id: user_id,
                first_name: first_name,
              })
            }
          >
            <Text style={styles.exchangeButtonText}>Exchange</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addAccountButton}
            onPress={handleAddAccountButtonPress}
          >
            <Image
              source={require("../assets/add-account-icon-plus.png")}
              style={styles.addAccountIcon}
            />
          </TouchableOpacity>
        </View>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                What account would you like to create?
              </Text>

              <Picker
                selectedValue={accountType}
                onValueChange={(itemValue) => setAccountType(itemValue)}
                style={styles.modalInput}
              >
                <Picker.Item label="US Dollar" value="USD" color="black" />
                <Picker.Item label="Euro" value="EUR" color="black" />
                <Picker.Item label="Japanese Yen" value="JPY" color="black" />
                <Picker.Item label="British Pound" value="GBP" color="black" />
                <Picker.Item label="Australian Dollar" value="AUD" color="black" />
                <Picker.Item label="Canadian Dollar" value="CAD" color="black"/>
                <Picker.Item label="Swiss Franc" value="CHF" color="black" />
                <Picker.Item label="Swedish Krona" value="SEK" color="black" />
              </Picker>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleCreateAccount}
                >
                  <Text style={styles.modalButtonText}>Create</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  greetingContainer: {
    width: "100%",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    marginBottom: 30,
    marginTop: 40,
  },
  cardsContainer: {
    width: "100%",
    marginBottom: 60,
  },
  scrollViewContent: {
    alignItems: "center",
  },
  card: {
    width: "100%",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
  },
  editProfileIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 20,
  },
  optionsIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 25,
    height: 25,
    resizeMode: "contain",
    zIndex: 1,
  },
  floatingOptions: {
    position: "absolute",
    top: -120,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    width: 150,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    zIndex: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: "#f27919",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  exchangeButton: {
    padding: 15,
    backgroundColor: "#f27919",
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
  },
  exchangeButtonText: {
    fontSize: 18,
    color: "white",
  },
  addAccountButton: {
    position: "absolute",
    bottom: 70,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#f27919",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  addAccountIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "white",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "70%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    backgroundColor: "#f27919",
    borderRadius: 4,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default MainScreen;

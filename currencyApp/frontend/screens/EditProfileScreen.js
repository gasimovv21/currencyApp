import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const EditProfileScreen = ({ route, navigation }) => {
  const { user_id, baseURL } = route.params;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [createdOn, setCreatedOn] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/users/${user_id}/`);
        const data = response.data;

        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setPhone(data.phone_number);
        setCreatedOn(new Date(data.account_created_on).toLocaleDateString());
        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const onSave = async () => {
    try {
      const updatedData = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phone,
        ...(password && { password }),
      };

      await axios.put(`${baseURL}/api/users/${user_id}/`, updatedData, {
        headers: { "Content-Type": "application/json" },
      });

      Alert.alert("Success", "Profile updated successfully!");
      navigation.navigate("Main", {
        user_id: user_id,
        first_name: firstName,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.createdOnText}>
          Account Created On: {createdOn}
        </Text>

        <Text style={styles.header}>Edit Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Password (optional)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.saveChangesButton} onPress={onSave}>
          <Text style={styles.saveChangesButtonText}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f7f8fa",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    color: "#333",
  },
  createdOnText: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "right",
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
  },
  saveChangesButton: {
    backgroundColor: "#f27919",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  saveChangesButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
export default EditProfileScreen;

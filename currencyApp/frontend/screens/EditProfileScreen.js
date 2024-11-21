import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const EditProfileScreen = ({ route, navigation }) => {
  const { user_id } = route.params;
  const baseURL = 'http://192.168.0.247:8000';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [createdOn, setCreatedOn] = useState('');
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
        Alert.alert('Error', 'Failed to fetch user data');
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
        headers: { 'Content-Type': 'application/json' },
      });

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      //console.error(error);
      Alert.alert('Error', 'Failed to update profile');
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
        {/* "Account Created On" text in small, subtle font in top-right */}
        <Text style={styles.createdOnText}>Account Created On: {createdOn}</Text>

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

        <Button title="Save Changes" onPress={onSave} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  createdOnText: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
});

export default EditProfileScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const EditProfileScreen = ({ navigation }) => {
  const userId = 1;
  const baseURL = 'http://192.168.1.30:8000'; // GO TO POWERSHELL USE IPCONFIG COMMAND AND CHANGE HERE 192.168.1.30 WITH YOUR IPV4
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [createdOn, setCreatedOn] = useState('');
  const [updatedOn, setUpdatedOn] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/users/${userId}/`);
        
        const data = response.data;
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setPhone(data.phone_number);
        setCreatedOn(data.account_created_on);
        setUpdatedOn(data.updated_on);
      } catch (error) {
        console.error(error);
        Alert.alert("Failed to fetch user data", error.message);
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
        ...(password && { password }), // We update the password only if it is specified
      };

      await axios.put(`${baseURL}/api/users/${userId}/`, updatedData, {
        headers: { 'Content-Type': 'application/json' },
      });

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Failed to update profile", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>User Data</Text>
      <View style={styles.card}>
        <Text>{userData ? JSON.stringify(userData, null, 2) : "Loading..."}</Text>
      </View>
    </ScrollView>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default EditProfileScreen;

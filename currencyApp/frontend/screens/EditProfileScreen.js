import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';

const EditProfileScreen = ({ navigation }) => {
  const userId = 3;
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
        const response = await fetch('/api/users/3/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

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

  const onSave = () => {
    console.log({ firstName, lastName, email, phone, password });
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter a new password"
            secureTextEntry
          />

          <Text style={styles.label}>Account Created On</Text>
          <TextInput
            style={[styles.input, styles.readOnly]}
            value={new Date(createdOn).toLocaleDateString()}
            editable={false}
          />

          <Text style={styles.label}>Last Updated On</Text>
          <TextInput
            style={[styles.input, styles.readOnly]}
            value={new Date(updatedOn).toLocaleDateString()}
            editable={false}
          />

          <View style={styles.buttonContainer}>
            <Button title="Save Changes" onPress={onSave} color="#007AFF" />
          </View>
        </View>
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
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  readOnly: {
    backgroundColor: '#e9e9e9',
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default EditProfileScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const userIndex = 3;
    navigation.navigate('Main', { userIndex });
  };

    // const handleLogin = async () => {
    
  //   try {
  //     const response = await fetch('/api/users/', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username, password }),
  //     });
  
  //     if (response.ok) {
  //       const data = await response.json();
  //       if (data) {
  //         navigation.navigate('Main', { data });
  //       }
  //     } else {
  //       Alert.alert('Login Failed', 'Invalid username or password.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error:');
  //   }
  // };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.heading}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Login" onPress={handleLogin} />
        <Button title="Register" onPress={() => navigation.navigate('Register')} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default LoginScreen;
import React, { useState } from 'react';
import axios from 'axios';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Modal,
} from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [isOver18, setIsOver18] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = async () => {
    // Validation before sending the request
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!isOver18) {
      alert('You must confirm that you are over 18.');
      return;
    }

    try {
      // API call
      const response = await axios.post('http://192.168.0.247:8000/api/register/', {
        username: formData.username,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email,
      });

      // Handle successful registration
      console.log('Registration Success:', response.data);
      alert('Registration successful! Please log in.');
      navigation.navigate('Login');
    } catch (error) {
      // Handle errors
      console.error('Registration Error:', error.response?.data || error.message);
      setErrors(error.response?.data);
    }
  };

  const CustomCheckbox = ({ isChecked, onPress, label }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: '#4CAF50',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isChecked ? '#4CAF50' : 'transparent',
        }}
      >
        {isChecked && (
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: '#fff',
              borderRadius: 2,
            }}
          />
        )}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Create an Account</Text>

        {errors && (
          <View style={styles.errorContainer}>
            {Object.entries(errors).map(([field, messages]) => (
              <Text key={field} style={styles.errorText}>
                {field}: {messages.join(', ')}
              </Text>
            ))}
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={formData.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={formData.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phone}
          keyboardType="phone-pad"
          onChangeText={(value) => handleChange('phone', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={formData.email}
          keyboardType="email-address"
          onChangeText={(value) => handleChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(value) => handleChange('username', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange('confirmPassword', value)}
          secureTextEntry
        />

        <CustomCheckbox
          isChecked={isOver18}
          onPress={() => setIsOver18(!isOver18)}
          label="I confirm I am over 18"
        />

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.agreementsButtonText}>View Agreements</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  errorContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffcccc',
    borderRadius: 8,
    width: '100%',
  },
  errorText: {
    color: '#a94442',
    fontSize: 14,
  },
  agreementsButtonText: {
    color: '#0066cc',
    fontSize: 14,
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#0066cc',
    fontSize: 14,
    marginTop: 10,
  },
});

export default RegisterScreen;
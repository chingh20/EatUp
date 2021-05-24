import { StatusBar } from 'expo-status-bar';
import React from 'react';
import React, { useState } from "react";
import {
  Image,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';


export default function Login() {
   const Login = (props) => {
     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')

     const handleEmailUpdate = (text) => setEmail(text)
     const handlePasswordUpdate = (text) => setPassword(text)

     const handleButtonPress = () => {
       setEmail('')
       setPassword('')
     }

     return(
       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={styles.container}>
         <Image style={styles.image} source={require('../../assets/logo.png')} />
         <TextInput
           style={styles.textInput}
           placeholder="Name"
           onChangeText={handleNameUpdate}
           value={name}
         />
         <TextInput
           style={styles.textInput}
           placeholder="Email"
           onChangeText={handleEmailUpdate}
           value={email}
           keyboardType="email-address"
         />
         <TextInput
           style={styles.textInput}
           placeholder="Password"
           onChangeText={handlePasswordUpdate}
           value={password}
           secureTextEntry
         />

  return (

    <View style={styles.container}>
      <Image style={styles.image} source={require("./assets/splash.png")} />
      <Text>Login Page 123</Text>
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


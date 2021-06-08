import React, { useState } from 'react';
import { firebase } from '../../firebase/config';
import {
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { emailCheck } from './emailCheck';
import { passwordCheck } from './passwordCheck';
import { CustomizedTextInput as TextInput } from '../Components/CustomizedTextInput';

const Login = ({ navigation })=> {

  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onLoginPressed = () => {
    const emailError = emailCheck(email.value)
    const passwordError = passwordCheck(password.value)

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    loginUser()
    }

    const loginUser = () => {
      firebase.auth().signInWithEmailAndPassword(email.value, password.value)
            .then((userCredential) => {
              // Signed in
              const usersRef = firebase.firestore().collection('users')
              usersRef.doc(userCredential.user.displayName)
                      .get()
                      .then(userdoc => {
                       if (!userdoc.exists) {
                           return;
                       }
                       const user = userdoc.data()
                       navigation.navigate('Home', {user})
                       alert('Login')
                       })
                       .catch(error => {
                           alert(error)
                      });
            })
            .catch((error) => {
              var errorCode = error.code
              var errorMessage = error.message
                     if (errorCode == 'auth/invalid-email') {
                       alert('Email address is not valid.')
                       return
                     } else if (errorCode == 'auth/user-not-found') {
                       alert('No user corresponds to the given email.')
                       return
                     } else if (errorCode == 'auth/wrong-password') {
                       alert('Wrong password.')
                       return
                     } else {
                       alert(errorMessage)
                     }
              }
              );
    }



 const handleEmailUpdate = (text) => setEmail({ value: text, error: '' })
 const handlePasswordUpdate = (text) => setPassword({ value: text, error: '' })


     return (
     <ScrollView contentContainerStyle = {styles.scroll}>
      <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={styles.container}>
      <Image style={styles.image} source = {require("../../../assets/welcome-back-logo.png")}/>
        <TextInput
            placeholder="Email"
            returnKeyType="next"
            value={email.value}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            style={styles.textInput}
            onChangeText={handleEmailUpdate}
            error={!!email.error}
            errorText={email.error}
         />
        <TextInput
        placeholder="Password"
        returnKeyType="done"
        value={password.value}
        style={styles.textInput}
        onChangeText={handlePasswordUpdate}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
         />
         <TouchableOpacity style={styles.nobutton} onPress={() => navigation.navigate('ForgotPassword')}>
             <Text style={styles.nobuttontext}> Forgot Password?</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.button} onPress={onLoginPressed}>
          <Text style={styles.btnText}>Let's Go!</Text>
         </TouchableOpacity>
     </KeyboardAvoidingView>
     </SafeAreaView>
     </ScrollView>
    );
}


const styles = StyleSheet.create({
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  textInput: {
      borderWidth: 1,
      borderColor: '#3e1f0d',
      fontSize: 20,
      marginBottom: 15,
      width: 350,
      height: 40,
    },
    button: {
      width: 200,
      marginTop: 30,
      marginBottom: 10,
      alignItems: "center",
      justifyContent: 'center',
      backgroundColor: "#ff5757",
      padding: 15,
      borderRadius: 50,
      },
    btnText: {
      color: "white",
      fontSize: 20,
      justifyContent: "center",
      textAlign: "center",
    },
    image: {
      height: 250,
      width: 350,
      marginBottom: 10
    },
    nobutton: {
           color: '#3e1f0d',
           fontSize: 20,
           marginTop: 30,
           alignItems: 'center',
           justifyContent: 'center',
        },
});


export default Login;


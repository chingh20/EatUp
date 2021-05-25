import React, { useState } from 'react';
import { firebase } from '../../firebase/config';
import {
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CustomizedTextInput as TextInput } from '../Components/CustomizedTextInput';
import { emailCheck } from './emailCheck';
import { passwordCheck } from './passwordCheck';
import { usernameCheck } from './usernameCheck';

const Signup = ({ navigation })=> {

  const [email, setEmail] = useState({ value: '', error: '' })
  const [username, setUsername] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

    const onSignupPressed = () => {
      const emailError = emailCheck(email.value)
      const usernameError = usernameCheck(username.value)
      const passwordError = passwordCheck(password.value)

      if (emailError || passwordError || usernameError) {
        setEmail({ ...email, error: emailError })
        setUsername({ ...username, error: usernameError })
        setPassword({ ...password, error: passwordError })
        return
      }
      navigation.reset({
            index: 0,
            routes: [{ name: 'Start' }],
          })
      }

   const handleEmailUpdate = (text) => setEmail({ value: text, error: '' })
   const handleUsernameUpdate = (text) => setUsername({ value: text, error: '' })
   const handlePasswordUpdate = (text) => setPassword({ value: text, error: '' })

 const handleButtonPress = () => {
  setEmail('')
  setUsername('')
  setPassword('')
    }

     return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={styles.container}>
      <Image style={styles.image} source = {require("../../../assets/create-account-logo.png")}/>
        <TextInput
           placeholder="Email"
           returnKeyType="next"
           value={email.value}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            style={styles.textInput}
            onChangeText={handleEmailUpdate}
        />
         <TextInput
            placeholder="Username"
            returnKeyType="next"
            value={username.value}
            error={!!username.error}
            errorText={username.error}
            style={styles.textInput}
            onChangeText={handleUsernameUpdate}
         />
        <TextInput
                placeholder="Password"
                returnKeyType="done"
                value={password.value}
                error={!!password.error}
                errorText={password.error}
                style={styles.textInput}
                onChangeText={handlePasswordUpdate}
                secureTextEntry
                 />
         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserPage')}>
           <Text style={styles.btnText}>To Food Adventures!</Text>
         </TouchableOpacity>
     </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
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
        marginTop: 15,
        width: 350,
        height: 40,
      },
      button: {
        width: 200,
        marginTop: 30,
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
});


export default Signup;
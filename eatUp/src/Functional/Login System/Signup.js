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
      registerUser()
      navigation.navigate('Login')

      }

   const handleEmailUpdate = (text) => setEmail({ value: text, error: '' })
   const handleUsernameUpdate = (text) => setUsername({ value: text, error: '' })
   const handlePasswordUpdate = (text) => setPassword({ value: text, error: '' })


 const registerUser = () => {
      firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then((res) => {
        res.user.updateProfile({
          displayName: username.value
        })
        console.log('User registered successfully!')
        navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
        })
      })
       .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        });
    }


     return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={styles.container}>
      <Image style={styles.image} source = {require("../../../assets/create-account-logo.png")}/>
         <TextInput
                    placeholder="Username"
                    returnKeyType="next"
                    value={username.value}
                    style={styles.textInput}
                    onChangeText={handleUsernameUpdate}
                    error={!!username.error}
                    errorText={username.error}
                    />
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
         <TouchableOpacity style={styles.button} onPress={onSignupPressed}>
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
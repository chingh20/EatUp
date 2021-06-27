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
import { CustomizedTextInput as TextInput } from '../Components/CustomizedTextInput';
import { emailCheck } from './emailCheck';
import { passwordCheck } from './passwordCheck';
import { usernameCheck } from './usernameCheck';
import defaultPicture from "../../../assets/default-user-image.png";

const  Signup = ({ navigation })=> {

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
      }


   const handleEmailUpdate = (text) => setEmail({ value: text, error: '' })
   const handleUsernameUpdate = (text) => setUsername({ value: text, error: '' })
   const handlePasswordUpdate = (text) => setPassword({ value: text, error: '' })


 const registerUser =  async  () => {

        const usersRef = firebase.firestore().collection('users')
        const userProfile = await usersRef.doc(username.value).get()

        if (!userProfile.exists) {
        firebase
                      .auth()
                      .createUserWithEmailAndPassword(email.value, password.value)
                      .then((res) => {

                      res.user.updateProfile({
                          displayName: username.value,
                      });

                        const uid = res.user.uid

                        const data = {
                           id: uid,
                           email: email.value,
                           username: username.value,
                           mapTheme: "default",
                           displayPicture: Image.resolveAssetSource(defaultPicture).uri,
                           friends: [],
                           cuisinesTried: [],
                           wantToGo: [],
                           postLocations: [],
                        }

                        usersRef
                               .doc(username.value)
                               .set(data)
                               .then(() => {
                               alert('Welcome to EATUP, ' + username.value + '!')
                               navigation.navigate('Home',{ data })
                               })
                               .catch((error) => {
                                    alert(error)
                               });
                        }).catch(function(error) {
                                  // Handle Errors here.
                                  var errorCode = error.code
                                  var errorMessage = error.message
                                  if (errorCode == 'auth/weak-password') {
                                    alert('The password is too weak.')
                                    return
                                  } else if (errorCode == 'auth/email-already-in-use') {
                                    alert('An account with this email already exists.')
                                    return
                                  } else if (errorCode == 'auth/invalid-email') {
                                    alert('Email address is not valid.')
                                    return
                                  } else {
                                    alert(errorMessage)
                                  }
                                  }
                                  );

        } else {
             alert('Username has already been taken!')
        }
      }



     return (
     <ScrollView contentContainerStyle = {styles.scroll}>
     <SafeAreaView style={styles.container}>
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
});


export default Signup;
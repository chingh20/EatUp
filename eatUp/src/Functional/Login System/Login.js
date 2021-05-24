import React, { useState } from 'react';
import {
  Image,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View
} from 'react-native';

const Login = ({ navigation })=> {

//  const [email, setEmail] = useState('')
//  const [password, setPassword] = useState('')
//
//  const handleEmailUpdate = (text) => setEmail(text)
//  const handlePasswordUpdate = (text) => setPassword(text)
//
//  const handleButtonPress = () => {
//    setEmail('')
//    setPassword('')
//     }

     return (
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={styles.container}>
//         <TextInput
//           style={styles.textInput}
//           placeholder="Email"
//           onChangeText={handleEmailUpdate}
//           value={email}
//           keyboardType="email-address"
//         />
//         <TextInput
//           style={styles.textInput}
//           placeholder="Password"
//           onChangeText={handlePasswordUpdate}
//           value={password}
//           secureTextEntry
//         />
//       </KeyboardAvoidingView>
//     );
 <View style={styles.container}>
        <Text style={styles.textInput}>hello</Text>
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
  textInput: {
      borderWidth: 1,
      borderColor: 'black',
      fontSize: 20,
      marginBottom: 8,
      width: 200,
      height: 30,
    },
});


export default Login;


import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Login from './Login';



const Start = ({navigation}) => {
  return (
     <View style={styles.container}>
     <Image style={styles.image} source = {require("./Logo/logo-coloured.png")}/>
     <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
     <Text style={styles.btnText}>Log In</Text>
     </TouchableOpacity>
     </View>
  );
};

export default Start;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
     width: 200,
     marginTop: 50,
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
        width: 350
   },
   textInput: {
         color: "black",
         borderWidth: 1,
         borderColor: 'black',
         fontSize: 20,
         marginBottom: 8,
         width: 200,
         height: 30,
       },
});

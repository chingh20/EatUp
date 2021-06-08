import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';



const Start = ({navigation}) => {
  return (
     <View style={styles.container}>
     <Image style={styles.image} source = {require("../../../assets/logo-full-background.png")}/>
     <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.btnText}>Log In</Text>
     </TouchableOpacity>

     <Text style ={styles.nobutton}> No account yet? Sign up
     <TouchableOpacity style={styles.nobutton} onPress={() => navigation.navigate('Signup')}>
             <Text style={styles.nobuttontext}> here!</Text>
          </TouchableOpacity>
     </Text>
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
      marginTop: 30,
      marginBottom: 10,
      alignItems: "center",
      justifyContent: 'center',
      backgroundColor: "#ff5757",
      padding: 15,
      borderRadius: 50,
      },
  nobutton: {
       color: '#3e1f0d',
       fontSize: 20,
       marginTop: 30,
       alignItems: 'center',
       justifyContent: 'center',
    },

  nobuttontext: {
       color: '#bc1824',
       fontSize: 20,
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
   textInput: {
         color: '#3e1f0d',
         borderWidth: 1,
         borderColor: '#3e1f0d',
         fontSize: 20,
         marginBottom: 15,
         width: 200,
         height: 30,
       },
});



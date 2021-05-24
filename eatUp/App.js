import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Login from './src/Functional/Login System/Login';



export default class App extends React.Component{

    press = () => console.log("hello");
    render() {
       return (
       <NavigationContainer>
        <View style={styles.container}>
            <Image style={styles.image} source = {require("./assets/logo-coloured.png")}/>
                <TouchableOpacity style={styles.button} onPress={() => console.log("Hello World!")}>
                    <Text style={styles.btnText}>Log In</Text>
                </TouchableOpacity>
//                <Text style={styles.textInput}>{this.press()}</Text>
        </View>
        </NavigationContainer>


        );
    }
}

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

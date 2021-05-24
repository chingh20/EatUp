import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>JanChing Afterfood! 123</Text>
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

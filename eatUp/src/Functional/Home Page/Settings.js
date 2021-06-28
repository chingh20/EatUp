import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';



const Settings = ({navigation}) => {
  return (
  <SafeAreaView style = {styles.homecontainer}>
     <View style={styles.container}>
     <Text> Settings Page </Text>
     </View>
</SafeAreaView>
  );
};

export default Settings;
const styles = StyleSheet.create({
 homecontainer: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
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
         marginBottom: 8,
         width: 200,
         height: 30,
       },
});



import React, { useState, useEffect } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  FlatList
} from 'react-native';
import FriendSearch from './FriendSearch'
import {firebase} from '../../firebase/config'
import { StatusBar } from 'expo-status-bar'


export default function Friends () {
    var user = firebase.auth().currentUser
    var userDisplayName = user.displayName

  const [userFriendArray, setUserFriendArray] = useState();

  const fetchUserFriendArray = async () => {

            await firebase.firestore()
              .collection('users')
              .doc(userDisplayName)
              .get()
              .then((documentSnapshot) => {
                 if (documentSnapshot.exists) {
                    setUserFriendArray(documentSnapshot.data());

                 }
              })
              .catch((error) => {
                 alert(error);
              });

      }


      useEffect(() =>
         {
          fetchUserFriendArray();
          } , []
      )

      const listHeader = () => {
        return null;
      }

    return (
    <SafeAreaView style={styles.container}>

    <FriendSearch array={userFriendArray? userFriendArray.friends: []} />

     </SafeAreaView>
    );


}
const styles = StyleSheet.create({
     scroll: {
       marginHorizontal: 20,
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
       errorText: {
             fontSize: 20,
             color: '#fd1d1d',
             alignItems: 'center',
             justifyContent: 'center',
             marginTop:20
       },
 })
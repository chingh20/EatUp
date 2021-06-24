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
import FriendListFormat from '../Components/FriendListFormat'
import FriendSearch from './FriendSearch'
import {firebase} from '../../firebase/config'
import { StatusBar } from 'expo-status-bar'


export default function Friends () {


  const [userFriendArray, setUserFriendArray] = useState();

  const fetchUserFriendArray = async () => {

            await firebase.firestore()
              .collection('users')
              .doc(username)
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
    <SafeAreaView>
    <Text> Friend </Text>
    <Search />
    </SafeAreaView>
    );

}
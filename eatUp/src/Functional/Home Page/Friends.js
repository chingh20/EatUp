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
import Search from './Search'
import {firebase} from '../../firebase/config'
import { StatusBar } from 'expo-status-bar'


export default function Friends () {

  var user = firebase.auth().currentUser
  var username = user.displayName

  const [userFriendArray, setUserFriendArray] = useState([]);

  const fetchFriendArray = async () => {
          try {
            const list = [];

            await firebase.firestore()
              .collection('users')
              .doc(username)
              .get()
              .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      const {
                          id,
                          postPhoto,
                          postTag,
                          postDescription,
                          postLocation,
                          likes,
                          wantToGo,
                          user,
                          timestamp,
                          comments
                      } = doc.data();


                      list.push({
                      id: doc.id,
                      user,
                      postPhoto,
                      postTag,
                      postDescription,
                      postLocation,
                      timestamp: timestamp,
                      liked: likes.includes(username),
                      likes: likes.length,
                      wantToGo: wantToGo.includes(username),
                      wantToGoCount: wantToGo.length,
                      comments,
                      });
                    });
                  })
                  .catch((error)=> {
                  alert(error)
                  });

              setPost(list);
              if (loading) {
                setLoading(false);
              }

              } catch (e) {
              console.log(e)
              }
      }

      useEffect(() =>
         {
          fetchPost();
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
import { Platform, Text, SafeAreaView, View, Image, StyleSheet, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';

import { firebase } from '../../firebase/config';

import { IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements';


const OtherUser = ({navigation, route}) => {

    const [userData, setUserData] = useState(null);
    const [post, setPost] = useState([]);

    var username = firebase.auth().currentUser.displayName;

    const getUserDetails = async () => {
    await
      firebase
        .firestore()
        .collection('users')
        .doc(user)
        .get().then((documentSnapshot) => {
            if (documentSnapshot.exists) {
            alert(documentSnapshot.data())
            setUserData(documentSnapshot.data())
            }
         })
    }

    const fetchPost = async () => {
        try {
          const list = [];

          await firestore()
            .collection('posts')
            .where('user', '==', username)
            .orderBy('timestamp', 'desc')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const {
                        id,
                        postPhoto,
                        postTitle,
                        postDescription,
                        postLocation,
                        likes,
                        user,
                        timestamp
                    } = doc.data();
                    list.push({
                    idd: doc.id,
                    id,
                    userName: 'User',
                    userImg: null,
                    timestamp: timeStamp,
                    likes,
                    });
                  });
                });

            setPost(list);

            } catch (e) {
            console.log(e)
            }
    }


    useEffect(() =>
       {getUserDetails();
        fetchPost();
        } , []
    )

    return (
        <SafeAreaView style = {styles.homecontainer}>
        <View style = {styles.upper}>
        <IconButton
            icon="arrow-left-circle"
            onPress={LogoutUser}
            color='#3e1f0d'
            size= {30}
            style={{ margin: 0 }}
        />

        <IconButton
             icon="cog-outline"
             onPress={() => props.navigation.navigate('Settings')}
             color='#3e1f0d'
             size= {30}
             style={{ margin: 0 }}
        />
        </View>

        <View style = {styles.middle}>
        <Text style={styles.name}>Hello, {user}!</Text>

        <Avatar
           rounded
           size='large'
           style={{ width: 100, height: 100 }}
           onPress={() => props.navigation.navigate('ChangeDisplayPic')}
           source={{uri: userData? userData.displayPicture : 'file:///var/mobile/Containers/Data/Application/4ECBB8DE-0801-4A52-8FD8-156C59C30DEF/Library/Caches/ExponentExperienceData/%2540ching123%252FeatUp/ImagePicker/00B19375-78BD-4D8B-A10D-4B24BD2DD146.jpg'}}
        />

        </View>

        <View style = {styles.bottom}>
        <Text> Menus </Text>
        </View>

        </SafeAreaView>
    )
}




const styles = StyleSheet.create({
  homecontainer: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
   scroll: {
      marginHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1
    },
  upper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fffbf1',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  middle: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#fffbf1',
      alignItems: 'stretch',
      justifyContent: 'space-around',
    },
 map: {
      width: 600,
      height: 250,
    },
 name: {
    color: '#3e1f0d',
    fontSize: 20,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
 }
 })

export default OtherUser;
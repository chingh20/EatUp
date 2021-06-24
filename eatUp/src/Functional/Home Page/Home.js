import { Platform, Text, SafeAreaView, View, Image, StyleSheet, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';

import { firebase } from '../../firebase/config';

import { IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements';
import ChangeDisplayPic from './ChangeDisplayPic';
import GooglePlacesInput from './googleMap'
import defaultUserImage from "../../../assets/default-user-image.png";
import Search from './Search'

export default function Home(props) {

    const defaultUserImageUri = Image.resolveAssetSource(defaultUserImage).uri

//    var region = {
//        latitude: 1.3649170000000002,
//        longitude: 103.82287200000002,
//        latitudeDelta: 0.3,
//        longitudeDelta: 0.25,
//    }

    const [userData, setUserData] = useState(null);
    const [post, setPost] = useState([]);

    var username = firebase.auth().currentUser.displayName;


    const getUserDetails = async () => {
    await
      firebase
        .firestore()
        .collection('users')
        .doc(username)
        .get().then((documentSnapshot) => {
            if (documentSnapshot.exists) {
            setUserData(documentSnapshot.data())
            }

         })
    }



    useEffect(() =>
       {getUserDetails();
        } , []
    )



//    var usertheme = mapStyle
//    if (user.mapTheme != "default") {
//        usertheme = mapStyle2
//    }


    const LogoutUser = () => {
    firebase.auth()
      .signOut()
      .then(() => {
       props.navigation.navigate('Start')
       alert('See you soon!')
      })
    }

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
        <Text style={styles.name}>Hello, {username}!</Text>

        <Avatar
           rounded
           size='large'
           avatarStyle={{ width: 100, height: 100, borderRadius: 50 }}
           containerStyle={{ width: 100, height: 100, borderWidth: 1, borderRadius: 50 }}
           onPress={() => {
           props.navigation.navigate("ChangeDisplayPic", {picture: userData? userData.displayPicture : defaultUserImageUri})}}
           source={{
                       uri: userData? userData.displayPicture : defaultUserImageUri
                         }}
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
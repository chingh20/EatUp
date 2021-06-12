import { Platform, Text, SafeAreaView, View, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react';
import MapView , { PROVIDER_GOOGLE } from 'react-native-maps';
import { firebase } from '../../firebase/config';
import { mapStyle, mapStyle2 } from './MapTheme'
import { IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements';
import ChangeDisplayPic from './ChangeDisplayPic';
import GooglePlacesInput from './googleMap'


export default function Home(props, user) {

    var region = {
        latitude: 1.3649170000000002,
        longitude: 103.82287200000002,
        latitudeDelta: 0.3,
        longitudeDelta: 0.25,
    }

    var user = firebase.auth().currentUser.displayName;

    const getUserDetails = () => {
      var user = firebase.auth().currentUser
      return firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(function(doc) {
          let userDetails = doc.data()
          return userDetails
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error)
        })
    }

    const userDetails = getUserDetails()

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
      .catch(error => {
          alert(error)
      });
    }

    return (
//<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='always'>
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
           size="large"
           rounded
           source={userDetails.displayPicture}
           onPress={() => props.navigation.navigate('ChangeDisplayPic')}
        />

         <MapView
          style={styles.map}
          initialRegion={region}
          minZoomLevel = {10}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
         >
          </MapView>
        </View>

        <View style = {styles.bottom}>
        <Text> Menus </Text>
        </View>

        </SafeAreaView>
//        </ScrollView>
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
    backgroundColor: '#3e1f0d',
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
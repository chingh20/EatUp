import { Platform, Text, SafeAreaView, View, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import MapView , { PROVIDER_GOOGLE } from 'react-native-maps';
import { firebase } from '../../firebase/config';
import { mapStyle, mapStyle2 } from './MapTheme'
import { IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import GooglePlacesInput from './googleMap'
export default function Home(props, user) {

    var region = {
        latitude: 1.3649170000000002,
        longitude: 103.82287200000002,
        latitudeDelta: 0.3,
        longitudeDelta: 0.25,
    }


    var usertheme = mapStyle
    if (user.mapTheme != "default") {
        usertheme = mapStyle2
    }


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

        <SafeAreaView style = {styles.homecontainer}>
        <View style = {styles.upper}>
        <IconButton
            icon="arrow-left-circle"
            onPress={LogoutUser}
            color='#3e1f0d'
            size= {30}
            style={{ margin: 0 }}
        />
        <Text style={styles.name}>Hello!{""+JSON.stringify(user.mapTheme)}</Text>

        <IconButton
             icon="cog-outline"
             onPress={() => props.navigation.navigate('Settings')}
             color='#3e1f0d'
             size= {30}
             style={{ margin: 0 }}
        />
        </View>

        <View style = {styles.middle}>
         <MapView
          style={styles.map}
          initialRegion={region}
          minZoomLevel = {10}
          provider={PROVIDER_GOOGLE}
          customMapStyle={usertheme}
         >
          </MapView>
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
  upper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'center',
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
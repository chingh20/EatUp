import { Platform, Text, View, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import MapView , { PROVIDER_GOOGLE } from 'react-native-maps';
import { firebase } from '../../firebase/config';
import { mapStyle, mapStyle2 } from './MapTheme'

export default function HomeScreen(props,user) {

    var region = {
        latitude: 1.3649170000000002,
        longitude: 103.82287200000002,
        latitudeDelta: 0.3,
        longitudeDelta: 0.25,
    }


    var usertheme = mapStyle
    if (user.mapTheme == "default") {
        usertheme = mapStyle2
    }


    return (
        <View style = {styles.homecontainer}>
        <Text>Hello there!</Text>
         <MapView
          style={styles.map}
          Region={region}
          scrollEnabled = {false}
          minZoomLevel = {10}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle2}
         >
          </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
  homecontainer: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
 map: {
      width: 600,
      height: 250,
    },
 })
import { Platform, Text, View, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import MapView , { PROVIDER_GOOGLE } from 'react-native-maps';
import { firebase } from '../../firebase/config';
import { MapTheme } from './MapTheme'

export default function HomeScreen(props,user) {

    var region = {
        latitude: 1.3649170000000002,
        longitude: 103.82287200000002,
        latitudeDelta: 0.3,
        longitudeDelta: 0.25,
    }

    var usertheme = MapTheme.mapStyle

    return (
        <View style = {styles.homecontainer}>
        <Text>Hello there!</Text>
         <MapView
          style={styles.map}
          initialRegion={region}
          provider={PROVIDER_GOOGLE}
          customMapStyle={MapTheme.mapStyle}
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
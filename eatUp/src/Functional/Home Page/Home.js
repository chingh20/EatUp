import { Platform, Text, View, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import MapView , { PROVIDER_GOOGLE } from 'react-native-maps';
import { firebase } from '../../firebase/config';

export default function HomeScreen(props,user) {
//resolve: {
//    alias: {
//        'react-native': 'react-native-web',
//        ...
//        'react-native-maps': 'react-native-web-maps',
//    }npm
//}
    var mapStyle = [
                       {
                         "elementType": "geometry",
                         "stylers": [
                           {
                             "color": "#f5f5f5"
                           }
                         ]
                       },
                       {
                         "elementType": "geometry.fill",
                         "stylers": [
                           {
                             "color": "#cd4c4c"
                           }
                         ]
                       },
                       {
                         "elementType": "labels",
                         "stylers": [
                           {
                             "visibility": "off"
                           }
                         ]
                       },
                       {
                         "elementType": "labels.icon",
                         "stylers": [
                           {
                             "color": "#fafafa"
                           },
                           {
                             "visibility": "on"
                           }
                         ]
                       },
                       {
                         "elementType": "labels.text.fill",
                         "stylers": [
                           {
                             "color": "#616161"
                           }
                         ]
                       },
                       {
                         "elementType": "labels.text.stroke",
                         "stylers": [
                           {
                             "color": "#f5f5f5"
                           }
                         ]
                       },
                       {
                         "featureType": "administrative",
                         "elementType": "geometry",
                         "stylers": [
                           {
                             "visibility": "off"
                           }
                         ]
                       },
                       {
                         "featureType": "administrative.country",
                         "elementType": "geometry.fill",
                         "stylers": [
                           {
                             "color": "#fafafa"
                           }
                         ]
                       },
                       {
                         "featureType": "administrative.land_parcel",
                         "stylers": [
                           {
                             "visibility": "off"
                           }
                         ]
                       },
                       {
                         "featureType": "administrative.land_parcel",
                         "elementType": "labels.text.fill",
                         "stylers": [
                           {
                             "color": "#bdbdbd"
                           }
                         ]
                       },
                       {
                         "featureType": "administrative.neighborhood",
                         "stylers": [
                           {
                             "visibility": "off"
                           }
                         ]
                       },
                       {
                         "featureType": "poi",
                         "stylers": [
                           {
                             "visibility": "off"
                           }
                         ]
                       },
                       {
                         "featureType": "poi",
                         "elementType": "geometry",
                         "stylers": [
                           {
                             "color": "#eeeeee"
                           }
                         ]
                       },
                       {
                         "featureType": "poi",
                         "elementType": "labels.text.fill",
                         "stylers": [
                           {
                             "color": "#757575"
                           }
                         ]
                       },
                       {
                         "featureType": "poi.park",
                         "elementType": "geometry",
                         "stylers": [
                           {
                             "color": "#e5e5e5"
                           }
                         ]
                       },
                       {
                         "featureType": "poi.park",
                         "elementType": "labels.text.fill",
                         "stylers": [
                           {
                             "color": "#9e9e9e"
                           }
                         ]
                       },
                       {
                         "featureType": "road",
                         "stylers": [
                           {
                             "visibility": "off"
                           }
                         ]
                       },
                       {
                         "featureType": "road",
                         "elementType": "geometry",
                         "stylers": [
                           {
                             "color": "#ffffff"
                           }
                         ]
                       },
                       {
                         "featureType": "road",
                         "elementType": "labels.icon",
                         "stylers": [
                           {
                             "visibility": "off"
                           }
                         ]
                       },
                       {
                         "featureType": "road.arterial",
                         "elementType": "labels.text.fill",
                         "stylers": [
                           {
                             "color": "#757575"
                           }
                         ]
                       },
                       {
                         "featureType": "road.highway",
                         "elementType": "geometry",
                         "stylers": [
                           {
                             "color": "#dadada"
                           }
                         ]
                       },
                       {
                         "featureType": "road.highway",
                         "elementType": "labels.text.fill",
                         "stylers": [
                           {
                             "color": "#616161"
                           }
                         ]
                       },
                       {
                         "featureType": "road.local",
                         "elementType": "labels.text.fill",
                         "stylers": [
                           {
                             "color": "#9e9e9e"
                           }
                         ]
                       },
                       {
                         "featureType": "transit",
                         "stylers": [
                           {
                             "visibility": "off"
                           }
                         ]
                       },
                       {
                         "featureType": "transit.line",
                         "elementType": "geometry",
                         "stylers": [
                           {
                             "color": "#e5e5e5"
                           }
                         ]
                       },
                       {
                         "featureType": "transit.station",
                         "elementType": "geometry",
                         "stylers": [
                           {
                             "color": "#eeeeee"
                           }
                         ]
                       },
                       {
                         "featureType": "water",
                         "elementType": "geometry",
                         "stylers": [
                           {
                             "color": "#c9c9c9"
                           }
                         ]
                       },
                       {
                         "featureType": "water",
                         "elementType": "geometry.fill",
                         "stylers": [
                           {
                             "color": "#fac4c4"
                           }
                         ]
                       },
                       {
                         "featureType": "water",
                         "elementType": "labels.text.fill",
                         "stylers": [
                           {
                             "color": "#9e9e9e"
                           }
                         ]
                       }
                     ]
    var region = {
        latitude: 1.3649170000000002,
        longitude: 103.82287200000002,
        latitudeDelta: 0.3,
        longitudeDelta: 0.25,
    }

    return (
        <View style = {styles.container}>
         <MapView style = {styles.map}>
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={region}
            customMapStyle={mapStyle}
          </MapView>
          <Text>Hello there!</Text>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
 map: {
      width: 600,
      height: 250,
    },
 })
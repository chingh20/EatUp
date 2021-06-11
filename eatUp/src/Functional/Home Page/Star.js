import { Text, View, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import ImageMapper from 'react-native-image-mapper';


const imageSource = require("../../../assets/6-pointed-star.png");
const MAPPING = [
   {
     id: '0',
     name: 'First Area Name',
     shape: 'circle',
     radius: 50,
     x1: 200,
     y1: 200,
     prefill: 'red',
     fill: 'transparent',
     strokeColor: 'red',
     lineWidth: 2,
     active: true
   },
 ]
 export default function Star () {
     const area_id = '0'
     return (

     <ImageMapper
             imgHeight={400}
             imgWidth={400}
             imgSource={imageSource}
             imgMap={MAPPING}
             onPress={(item, idx, event) => alert('hi')}
             selectedAreaId= {area_id}
           />

     );
}




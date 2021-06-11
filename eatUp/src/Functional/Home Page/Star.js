import { Text, View, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import ImageMapper from 'react-native-image-mapper';


const imageSource = require("../../../assets/welcome-back-logo.png");
const MAPPING = [
  {
    id: '0',
    name: 'First Area Name',
    shape: 'circle',
    width: 10,
    height: 10,
    x1: 300,
    y1: 18,
    prefill: 'red',
    fill: 'blue'
  },
]

export default function Star () {
 const area_id = '0'
 return (
      <ImageMapper
        imgHeight={600}
        imgWidth={600}
        imgSource={imageSource}
        imgMap={MAPPING}
        onPress={(item, idx, event) => this.onAnyAreaPress(item, idx, event)}
        selectedAreaId= {area_id}
      />
    );
}




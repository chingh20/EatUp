import React, { useState } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Camera } from 'expo';

export default function CameraFunction(props) {
  return (
    <Camera
      ref={ref => {
        this.camera = ref;
      }}
      captureAudio={false}
      style={{flex: 1}}
     />
    );
  }
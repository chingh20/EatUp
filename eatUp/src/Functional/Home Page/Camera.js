import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { IconButton } from 'react-native-paper';


export default function CameraFunction(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePic = () => {

  }

  return (
     <View style={styles.container}>
       <Camera style={styles.camera} type={type}>
         <View style={styles.buttonContainer}>
           <TouchableOpacity
             style={styles.button}
             onPress={() => {
               setType(
                 type === Camera.Constants.Type.back
                   ? Camera.Constants.Type.front
                   : Camera.Constants.Type.back
               );
             }}>
             <Text style={styles.text}> Flip </Text>
           </TouchableOpacity>
         </View>
       </Camera>
     </View>

    );
  }
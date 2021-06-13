import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { IconButton } from 'react-native-paper';
import {StatusBar} from 'expo-status-bar'

export default function CameraFunction() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

    const takePicture = async () => {
      if (!camera) return
      const photo = await camera.takePictureAsync()
      setPreviewVisible(true)
      setCapturedImage(photo)

    }

      const retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
      }

const CameraPreview = ({photo}: any) => {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{
          flex: 1
        }}
      />
    </View>
  )
}
  return (
                 <View style={styles.container}>
                   <Camera  style={{flex: 1,width:"100%"}}
                    ref={(r) => {
                               camera = r
                             }}>

                       <TouchableOpacity
                         style={styles.button}
                         onPress={() => {setType(
                                      type === Camera.Constants.Type.back
                                   ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                          )
                         }}
                         >
                         <Text style={styles.nobutton}> Flip </Text>
                       </TouchableOpacity>
                       <TouchableOpacity
                                    style={styles.button}
                                    onPress={takePic}>
                                    <Text style={styles.nobutton}> Take pic </Text>
                       </TouchableOpacity>

                   </Camera>
                 </View>

    );
  }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#e6e6fa',
    },
     button: {
          width: 200,
          marginTop: 30,
          marginBottom: 10,
          alignItems: "center",
          justifyContent: 'center',
          backgroundColor: "#ff5757",
          padding: 15,
          borderRadius: 50,
          },
        btnText: {
          color: "white",
          fontSize: 20,
          justifyContent: "center",
          textAlign: "center",
        },
        image: {
          height: 250,
          width: 350,
          marginBottom: 10
        },
        nobutton: {
               color: '#3e1f0d',
               fontSize: 20,
               marginTop: 30,
               alignItems: 'center',
               justifyContent: 'center',
            },

});
//import React, { PureComponent, useState, useEffect } from 'react';
//import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
//import { IconButton } from 'react-native-paper';
//import {StatusBar} from 'expo-status-bar'
//import {Camera} from 'expo-camera'
//
//const CameraFunction = ({navigation}) => {
//  const [hasPermission, setHasPermission] = useState(null);
//  const [previewVisible, setPreviewVisible] = useState(false)
//  const [capturedImage, setCapturedImage] = useState(null)
//  const [type, setType] = useState(Camera.Constants.Type.back);
//
//  let camera: Camera
//
//  useEffect(() => {
//    (async () => {
//      const { status } = await Camera.requestPermissionsAsync();
//      if(status === 'granted'){
//         // do something
//      Alert.alert("Access granted")
//       }else{
//         Alert.alert("Access denied")
//       }
//      setHasPermission(status === 'granted');
//    })();
//  }, []);
//
//  if (hasPermission === null) {
//    return <Text>permission is null</Text>;
//  }
//  if (hasPermission === false) {
//    return <Text>No access to camera</Text>;
//  }
//    const takePicture = async () => {
//      if (camera) return
//        try {
//               const data = await camera.takePictureAsync(options);
//               alert('Success', JSON.stringify(data));
//            } catch (err) {
//              alert('Error', 'Failed to take picture: ' + (err.message || err));
//              return;
//        }
//      setPreviewVisible(true)
//      setCapturedImage(photo)
//      alert(photo)
//      CameraPreview(capturedImage)
//    }
//
//      const retakePicture = () => {
//        setCapturedImage(null)
//        setPreviewVisible(false)
//      }
//
//
//const CameraPreview = ({photo}) => {
//  return (
//    <View
//      style={{
//        backgroundColor: 'transparent',
//        flex: 1,
//        width: '100%',
//        height: '100%'
//      }}
//    >
//    <ImageBackground
//        source={{uri: photo && photo.uri}}
//        style={{
//          flex: 1
//        }}
//      />
//    </View>
//  )
//}
//  return (
//  <View>
//  {previewVisible ? (
//                     <CameraPreview photo={capturedImage} />
//                           ) : (
//                 <View style={styles.container}>
//                 <Text>here</Text>
//                 <Camera
//                    style={{flex: 1,width:"100%"}}
//                    ref={(r) => {
//                               camera = r
//                             }}
//                >
//
//                       <TouchableOpacity
//                                    style={styles.button}
//                                    onPress={takePicture}>
//                                    <Text style={styles.nobutton}> Take pic </Text>
//                       </TouchableOpacity>
//
//                 </Camera>
//                 </View>
//                 )}
//                 </View>
//
//    );
//  }
//
//export default CameraFunction;
//
//const styles = StyleSheet.create({
//    container: {
//        flex: 1,
//        width: '100%',
//        height: '100%',
//        backgroundColor: '#e6e6fa',
//    },
//     button: {
//          width: 200,
//          marginTop: 30,
//          marginBottom: 10,
//          alignItems: "center",
//          justifyContent: 'center',
//          backgroundColor: "#ff5757",
//          padding: 15,
//          borderRadius: 50,
//          },
//        btnText: {
//          color: "white",
//          fontSize: 20,
//          justifyContent: "center",
//          textAlign: "center",
//        },
//        image: {
//          height: 250,
//          width: 350,
//          marginBottom: 10
//        },
//        nobutton: {
//               color: '#3e1f0d',
//               fontSize: 20,
//               marginTop: 30,
//               alignItems: 'center',
//               justifyContent: 'center',
//            },
//
//});

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Camera } from 'expo-camera';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

export default function CameraFunction({navigation}) {
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [savedPhoto, setSavedPhoto] = useState(null);

  useEffect(() => {
    onHandlePermission();
  }, []);

  const onHandlePermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType(prevCameraType =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const onSnap = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;


      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        setSavedPhoto(source);
      }
    }
  };

  const savePhoto = async () => {
        navigation.navigate("Post", {photo: {savedPhoto}})

  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.container}
        type={cameraType}
        onCameraReady={onCameraReady}
        useCamera2Api={true}
      />
      <View style={styles.container}>
        {isPreview && (
        <View>
          <TouchableOpacity
            onPress={cancelPreview}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
          <Text>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
             onPress={savePhoto}
             style={styles.closeButton}
             activeOpacity={0.7}
          >
          <Text>Save</Text>

          </TouchableOpacity>
          </View>
        )}
        {!isPreview && (
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
            <Text> Flip </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={!isCameraReady}
              onPress={onSnap}
              style={styles.capture}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  text: {
    color: '#fff'
  },
  bottomButtonsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 28,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButton: {
    top: 35,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5A45FF',
    opacity: 0.7
  },
  capture: {
    backgroundColor: '#5A45FF',
    borderRadius: 5,
    height: CAPTURE_SIZE,
    width: CAPTURE_SIZE,
    borderRadius: Math.floor(CAPTURE_SIZE / 2),
    marginBottom: 28,
    marginHorizontal: 30
  }
});

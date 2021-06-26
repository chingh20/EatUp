import React, { useState, useEffect } from 'react';
import { IconButton } from 'react-native-paper';
import {
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView
} from 'react-native';
import { firebase, storage } from '../../firebase/config';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { CustomizedTextInput as TextInput } from '../Components/CustomizedTextInput';
import uuid from 'uuid';
import ModalSelector from 'react-native-modal-selector'


export default function Post ({navigation, route}) {
  var username = firebase.auth().currentUser.displayName;


  const upload = async (post) => {
    const id = uuid.v4()

        let uri = image.value;

        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });

    let imageName = username + '-' +  id
    let reference = await storage.ref().child(`postPhotos/${imageName}`)

    await reference.put(blob).catch((error) => {
                                 console.log(error);
                               });

    let url = await reference.getDownloadURL()
    const uploadData = {
      id: id,
      postPhoto: url,
      postTag: post.tag,
      postLocation: post.location,
      postDescription: post.description,
      postGeoCoordinates: post.geoCoordinates,
      likes: [],
      wantToGo:[],
      comments: null,
      user: username,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date())
    }


     firebase
       .firestore()
       .collection(username)
       .doc(id)
       .set(uploadData)


     firebase
        .firestore()
        .collection('Posts')
        .doc(id)
        .set(uploadData)

    }


   const selectImage = async () => {
     let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [3,3],
         quality: 1,
       })

       if (!result.cancelled) {
         handleImageUpdate(result.uri)
       }

    }


    const [tag, setTag] = useState({ value: '', error: '' });
    const [image, setImage] = useState({value: null, error: ''})
    const [location, setLocation] = useState({ value: '', error: '' })
    const [description, setDescription] = useState({ value: '', error: '' })


    const handleTagUpdate = (text) => setTag({ value: text, error: '' })
    const handleImageUpdate = (image) => setImage({value: image, error: ''})
    const handleLocationUpdate = (text) => setLocation({ value: text, error: '' })
    const handleDescriptionUpdate = (text) => setDescription({ value: text, error: '' })

    const takePicture = async () => {
        navigation.navigate('CameraFunction')
        if (route.params.photo != null) {
                handleImageUpdate(route.params.photo)
        }
    }


    function titleCheck(title) {
      if (!title) return "This can't be empty!"
      return ''
    }

    function imageCheck(image) {
      if (image === null) return "Please choose an image!"
      return ''
    }

    const onSubmit = async () => {

        const tagError = titleCheck(tag.value)
        const imageError = imageCheck(image.value)
        const locationError = titleCheck(location.value)
        const descriptionError = titleCheck(description.value)


        if (tagError|| imageError || locationError || descriptionError) {
          setTag({ ...tag, error: tagError })
          setImage({...image,error: imageError})
          setLocation({ ...location, error: locationError })
          setDescription({ ...description, error: descriptionError })
          return
        }

        try {
          const post = {
            photo: image.value,
            tag: tag.value,
            location: location.value,
            description: description.value,
            geoCoordinates: place
                            ? new firebase.firestore.GeoPoint(place.coords.latitude, place.coords.longitude)
                            : null
          }


          upload(post)

         handleImageUpdate(null)
         handleLocationUpdate('')
         handleDescriptionUpdate('')
         handleTagUpdate('')

        } catch (e) {
          alert(e)
          console.error(e)
        }
      }

 let index = 0;
        const data = [
            { key: index++, label: 'Indian' },
            { key: index++, label: 'Chinese' },
            { key: index++, label: 'Korean' },
            { key: index++, label: 'Western' },
            { key: index++, label: 'Fast Food' }
        ];

return (
<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='always'>
<SafeAreaView style = {styles.container}>
 <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={styles.container}>
          {image.value ?(
              <View style={styles.container}>
            <Image
              source={{uri: image.value}}
              style = {{width: 300 , height: 300}}
            />

            <TouchableOpacity style={styles.nobutton} onPress={selectImage}>
                <Text style={styles.nobtnText}> Choose Again </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nobutton} onPress={takePicture}>
                <Text style={styles.nobtnText}> Camera </Text>
            </TouchableOpacity>
            </View>
          ) : (
          <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={selectImage}>
              <Text style={styles.btnText}> Pick from Gallery </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.btnText}> Camera </Text>
            </TouchableOpacity>
            <Text style={styles.errorText}> {image.error}</Text>
           </View>
        )}
          <View style={styles.container}>

        <ModalSelector
                    data={data}
                    initValue="Select the type of food!"
                    touchableStyle={styles.picker}
                    accessible={true}
                    supportedOrientations={['portrait']}
                    scrollViewAccessibilityLabel={'Scrollable options'}
                    cancelButtonAccessibilityLabel={'Cancel Button'}
                    onChange={(option)=>{ handleTagUpdate(option.label) }}>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Select the type of food!"
                        editable={true}
                        value={tag.value}
                        error={!!tag.error}
                        errorText={tag.error}/>
                </ModalSelector>

            <TextInput
            placeholder='Enter location of the post'
            style={styles.textInput}
            value={location.value}
            onChangeText={handleLocationUpdate}
            error={!!location.error}
            errorText={location.error}
          />
          <TextInput
            placeholder='Enter description'
            style={styles.textInput}
            value={description.value}
            onChangeText={handleDescriptionUpdate}
            error={!!description.error}
            errorText={description.error}
          />
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
           <Text style={styles.btnText}> Add post </Text>
         </TouchableOpacity>
          </View>



</KeyboardAvoidingView>
 </SafeAreaView>
</ScrollView>
    )

}

const styles = StyleSheet.create({
  scroll: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

  },
  textInput: {
      borderWidth: 1,
      borderColor: '#3e1f0d',
      fontSize: 20,
      marginBottom: 15,
      width: 350,
      height: 40,
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
    errorText: {
          fontSize: 20,
          color: '#fd1d1d',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop:20
    },
    picker: {
        backgroundColor: 'transparent',
        width: 350,
        height: 40,
    }
});
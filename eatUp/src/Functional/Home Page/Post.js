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
import { firebase } from '../../firebase/config';
import { StatusBar } from 'expo-status-bar';
import Camera from './Camera'
import * as ImagePicker from 'expo-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { CustomizedTextInput as TextInput } from '../Components/CustomizedTextInput';
import uuid from 'uuid'
import GooglePlacesInput from './googleMap';

export default function Post () {
  var user = firebase.auth().currentUser.displayName;

  const upload = (post) => {
    const id = uuid.v4()
    const uploadData = {
      id: id,
      postPhoto: post.photo,
      postTitle: post.title,
      postDescription: post.description,
      postLocation: post.location,
      likes: [],
      user: firebase.firestore().collection('users').doc(user),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }

     return firebase
            .firestore()
            .collection(user)
            .add(uploadData)

    }

//      useEffect(() => {
//        (async () => {
//          if (Platform.OS !== 'web') {
//            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//            if (status !== 'granted') {
//              alert('Sorry, we need camera roll permissions to make this work!');
//            }
//          }
//        })();
//      }, []);

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

    const [image, setImage] = useState({value: null, error: ''})
    const [title, setTitle] = useState({ value: '', error: '' })
    const [description, setDescription] = useState({ value: '', error: '' })
    const [location, setLocation] = useState({ value: '', error: '' })

    const handleImageUpdate = (image) => setImage({value: image, error: ''})
    const handleTitleUpdate = (text) => setTitle({ value: text, error: '' })
    const handleDescriptionUpdate = (text) => setDescription({ value: text, error: '' })
    const handleLocationUpdate = (location) => setLocation({ value: location, error: '' })

    function titleCheck(title) {
      if (!title) return "This can't be empty!"
      return ''
    }

    function imageCheck(image) {
      if (image === null) return "Please choose an image!"
      return ''
    }

    const onSubmit = async () => {

        const imageError = imageCheck(image.value)
        const titleError = titleCheck(title.value)
        const descriptionError = titleCheck(description.value)
        const locationError = titleCheck(location.value)


        if (image.value || titleError || descriptionError || locationError) {
          setImage({...image,error: imageError})
          setTitle({ ...title, error: titleError })
          setDescription({ ...description, error: descriptionError })
          setLocation({ ...location, error: locationError })
          return
        }

        try {
          const post = {
            photo: image,
            title: title,
            description: description,
            location: location
          }
          upload(post)

         handleImageUpdate(null)
         handleTitleUpdate('')
         handleDescriptionUpdate('')
         handleLocationUpdate('')

        } catch (e) {
          alert(e)
          console.error(e)
        }
      }

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
            </View>
          ) : (
          <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={selectImage}>
              <Text style={styles.btnText}> Pick from Gallery </Text>
            </TouchableOpacity>
           </View>
        )}
          <View style={styles.container}>
           <Text style={styles.errorText}> {image.error}</Text>
          <TextInput
            placeholder='Enter title of the post'
            style={styles.textInput}
            value={title.value}
            onChangeText={handleTitleUpdate}
            error={!!title.error}
            errorText={title.error}
          />
          <TextInput
            placeholder='Enter description'
            style={styles.textInput}
            value={description.value}
            onChangeText={handleDescriptionUpdate}
            error={!!description.error}
            errorText={description.error}
          />

         // <GooglePlacesInput />

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
    }
});
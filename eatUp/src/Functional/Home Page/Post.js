import React, { useState } from 'react';
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
  TextInput
} from 'react-native';
import { firebase } from '../../firebase/config';
import { StatusBar } from 'expo-status-bar';
import Camera from './Camera'
import ImagePicker from 'react-native-image-picker'
import uuid from 'uuid'

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
            .set(uploadData)

    }

   const selectImage = async () => {
      const options = {
        noData: true
      }
      const response = await ImagePicker.launchImageLibrary(options)
        if (response.didCancel) {
          alert('User cancelled image picker')
        } else if (response.error) {
          alert('ImagePicker Error: ', response.error)
        } else {
          const source = { uri: response.uri }
          console.log(source)
          handleImageUpdate(response)
        }
    }


    const [image, setImage] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')

    const handleImageUpdate = (image) => setImage(image)
    const handleTitleUpdate = (text) => setTitle(text)
    const handleDescriptionUpdate = (text) => setDescription(text)
    const handleLocationUpdate = (location) => setLocation(location)

    const onSubmit = async () => {
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
 <View style={{ marginTop: 80, alignItems: 'center' }}>
        <View>
          {image ? (
            <Image
              source={image}
              style={{ width: '100%', height: 300 }}
            />
          ) : (
            <TouchableOpacity style={styles.button} onPress={selectImage}>
              <Text> Select an image from photo gallery </Text>
            </TouchableOpacity>
        )}
        </View>
        <View style={{ marginTop: 80, alignItems: 'center' }}>
          <Text>Post Details</Text>

          <TextInput
            placeholder='Enter title of the post'
            style={{ margin: 20 }}
            value={title}
            onChangeText={handleTitleUpdate}
          />
          <TextInput
            placeholder='Enter description'
            style={{ margin: 20 }}
            value={description}
            onChangeText={handleDescriptionUpdate}
          />
          <TouchableOpacity onPress={onSubmit}>
            <Text> Add post </Text>
          </TouchableOpacity>
        </View>

 </View>
    )


}

const styles = StyleSheet.create({
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
        marginTop: 15,
        width: 350,
        height: 40,
      },
      button: {
        width: 200,
        marginTop: 30,
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
});

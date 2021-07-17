import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
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
import { IconButton } from 'react-native-paper';
import { firebase } from '../../firebase/config';
import moment from 'moment';
import { Divider } from 'react-native-elements'

const RequestFormat = ({requestFrom, updateFriends}) => {

  var currentUsername = firebase.auth().currentUser.displayName;
  const userFriendNetwork = firebase.firestore().collection('FriendNetwork').doc(currentUsername)
  const requesterFriendNetwork = firebase.firestore().collection('FriendNetwork').doc(requestFrom)

  const [requesterData, setRequesterData] = useState();


  const getRequesterData = async () => {
    await firebase.firestore()
      .collection('users')
      .doc(requestFrom)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setRequesterData(documentSnapshot.data());
        }
      })
      .catch((error) => {
      alert(error);
      });
  };

  useEffect(() => {
    getRequesterData();
  },[requestFrom]);


  const onNotAcceptPressed = (requestFrom) => {
        try {
        userFriendNetwork.update({friendRequests: firebase.firestore.FieldValue.arrayRemove(requestFrom)})
        requesterFriendNetwork.update({requesting: firebase.firestore.FieldValue.arrayRemove(currentUsername)})
        alert("You have removed request from " + requestFrom + "!")
        updateFriends()
        } catch(error) {
        alert("Error occurred. Please contact xxx for assistance.")
        }
  }

  const onAcceptPressed = (requestFrom) => {
        try {
        userFriendNetwork.update({friendRequests: firebase.firestore.FieldValue.arrayRemove(requestFrom)})
        requesterFriendNetwork.update({requesting: firebase.firestore.FieldValue.arrayRemove(currentUsername)})

        userFriendNetwork.update({friends: firebase.firestore.FieldValue.arrayUnion(requestFrom)})
        requesterFriendNetwork.update({friends: firebase.firestore.FieldValue.arrayUnion(currentUsername)})
        alert("You are friends with " + requestFrom + "!")
        updateFriends()
        } catch(error) {
        alert("Error occurred. Please contact xxx for assistance.")
        }
  }

  return (
    <View key={requesterData? requesterData.username: ''}>
   <View style={styles.friendContainer}>
      <View style={styles.friendInfoContainer}>
        <Image style={styles.friendImage}
          source={{
            uri: requesterData
              ? requesterData.displayPicture ||
                'https://reactnative.dev/img/tiny_logo.png'
              : 'https://reactnative.dev/img/tiny_logo.png'
              }}
        />
        <View style={styles.friendInfoText}>
          <TouchableOpacity style = {styles.button} onPress={() => alert("Become friends to view each other's profile!")}>
            <Text style={styles.friendName}>
              {requesterData ? requesterData.username || 'Test' : 'Test'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
        <IconButton icon="check-outline"
                    size={20}
                    onPress={() => onAcceptPressed(requestFrom)}/>
        <IconButton icon="close-outline"
                    size={20}
                    onPress={() => onNotAcceptPressed(requestFrom)}/>
    </View>
   </View>
  );
};

export default RequestFormat;

const styles = StyleSheet.create({
  friendContainer: {
    flex: 1,
    flexDirection: 'row',
    width: 350,
    height: 70,
    backgroundColor: '#fdf4da',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 10,
  },
  friendInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'flex-start',
    borderRadius: 10,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  friendInfoText: {
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'center',
  },
  friendName: {
    color: '#bc1824',
    fontSize: 20,
  },
});
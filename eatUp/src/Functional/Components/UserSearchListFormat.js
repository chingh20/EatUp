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
import { Divider } from 'react-native-elements'

const UserSearchListFormat = ({users, onPress}) => {
  var currentUsername = firebase.auth().currentUser.displayName;
  const userFriendList = firebase.firestore().collection('users').doc(currentUsername)

  const [userFriendArray, setUserFriendArray] = useState();

  const fetchUserFriendArray = async () => {

              await firebase.firestore()
                .collection('users')
                .doc(currentUsername)
                .get()
                .then((documentSnapshot) => {
                   if (documentSnapshot.exists) {
                      setUserFriendArray(documentSnapshot.data());

                   }
                })
                .catch((error) => {
                   alert(error);
                });

  }


  useEffect(()=>{
    fetchUserFriendArray();
  },[]);



  const onAddFriendPressed = () => {
        userFriendList.update({friends: firebase.firestore.FieldValue.arrayUnion(users.username)})
        alert("You have followed " + users.username + "!")
  }

  return (
    <View style={styles.friendContainer} key={users? users.username : ''}>
      <View style={styles.friendInfoContainer}>
        <Image style={styles.friendImage}
          source={{
            uri: users
              ? users.displayPicture ||
                'https://reactnative.dev/img/tiny_logo.png'
              : 'https://reactnative.dev/img/tiny_logo.png'
              }}
        />
        <View style={styles.friendInfoText}>
          <TouchableOpacity style = {styles.button} onPress={onPress}>
            <Text style={styles.friendName}>
              {users? users.username
                             : 'Test'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {users && userFriendArray ? (
        (!userFriendArray.friends.includes(users.username) && currentUsername != users.username ? (
                   <IconButton icon="account-plus-outline"
                                       size={20}
                                       onPress={onAddFriendPressed}/>
               ) : null)
        ) : null}
    </View>
  );
};

export default UserSearchListFormat;

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
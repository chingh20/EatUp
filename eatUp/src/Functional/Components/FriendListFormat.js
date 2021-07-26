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
import defaultPicture from "../../../assets/default-user-image.png";

const FriendListFormat = ({friends, navigation, friendArray,  updateFriends}) => {

  var currentUsername = firebase.auth().currentUser.displayName;
  const userFriendList = firebase.firestore().collection('FriendNetwork').doc(currentUsername)
  const targetFriendList = firebase.firestore().collection('FriendNetwork').doc(friends)

  const [userFriendData, setUserFriendData] = useState();

  const getUserFriendData = async () => {
    await firebase.firestore()
      .collection('users')
      .doc(friends)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserFriendData(documentSnapshot.data());
        }
      })
      .catch((error) => {
      alert(error);
      });
  };

  useEffect(() => {
    getUserFriendData();
  }, [friends]);


const unfriend = () => {
  Alert.alert(
        "UNFOLLOW?",
        "Unfollow " + friends + "?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Yes",
            onPress: () => { try {
                             userFriendList.update({friends: firebase.firestore.FieldValue.arrayRemove(friends)});
                             targetFriendList.update({friends: firebase.firestore.FieldValue.arrayRemove(currentUsername)});
                             updateFriends();
                             } catch(error) {
                             alert('Error occurred while removing friend. Please contact xxx for assistance.');
                             }
                           }

          }
        ]
      );
  }


  const onUsernamePressed = (friends) => {
        if(currentUsername == friends) {
        navigation.navigate('Home')
        } else {
        navigation.navigate('OtherUser', {otherUser: friends, otherUserFriendArray: friendArray})
        }
  }


  return (
    <View  key={userFriendData? userFriendData.username: ''}>
    <View style={styles.friendContainer}>
      <View style={styles.friendInfoContainer}>
        <Image style={styles.friendImage}
          source={{
            uri: userFriendData
              ? userFriendData.displayPicture : null
              }}
        />
        <View style={styles.friendInfoText}>
          <TouchableOpacity style = {styles.button} onPress={() => onUsernamePressed(friends)}>
            <Text style={styles.friendName}>
              {userFriendData ? userFriendData.username || 'Test' : 'Test'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <IconButton icon="account-remove-outline"
                    size={20}
                    onPress={unfriend}/>
    </View>
    </View>
  );
};

export default FriendListFormat;

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
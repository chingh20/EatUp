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

const UserSearchListFormat = ({search, onPress}) => {
  var currentUsername = firebase.auth().currentUser.displayName;
  const userFriendList = firebase.firestore().collection('users').doc(currentUsername)

  const [userSearchData, setUserSearchData] = useState();


  const getUserSearchData = async () => {
    await firebase.firestore()
      .collection('users')
      .doc(search)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserSearchData(documentSnapshot.data());
        }
      })
      .catch((error) => {
      alert(error);
      });
  };

  useEffect(() => {
    getUserSearchData();
  }, []);


  const onUnfriendPressed = () => {
        userFriendList.update({friends: firebase.firestore.FieldValue.arrayRemove(friends)})
        alert("You have unfollowed " + friends + "!")
  }

  return (
    <View style={styles.friendContainer} key={friends}>
      <View style={styles.friendInfoContainer}>
        <Image style={styles.friendImage}
          source={{
            uri: userSearchData
              ? userSearchData.displayPicture ||
                'https://reactnative.dev/img/tiny_logo.png'
              : 'https://reactnative.dev/img/tiny_logo.png'
              }}
        />
        <View style={styles.friendInfoText}>
          <TouchableOpacity style = {styles.button} onPress={onPress}>
            <Text style={styles.friendName}>
              {userSearchData ? userSearchData.username || 'Test' : 'Test'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
//      {currentUser.displayName != post.user ? (
//                   <IconButton icon={wantToGoIcon}
//                               size={20}
//                               color={wantToGoColor}
//                               onPress={() => onWantToGo(currentUser.displayName, post.id)}/>
//       ) : null}
        <IconButton icon="account-remove-outline"
                    size={20}
                    onPress={onUnfriendPressed}/>
    </View>
  );
};

export default FriendListFormat;

const styles = StyleSheet.create({
  friendContainer: {
    flex: 1,
    flexDirection: 'row',
    width: 350,
    height: 200,
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
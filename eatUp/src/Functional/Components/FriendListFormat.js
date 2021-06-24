import React, {useContext, useEffect, useState} from 'react';
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
import { IconButton } from 'react-native-paper';
import { firebase } from '../../firebase/config';
import moment from 'moment';
import { Divider } from 'react-native-elements'

const FriendListFormat = ({friends, onPress}) => {

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
  }, []);

  return (
    <View style={styles.friendContainer} key={friends}>
      <View style={styles.friendInfoContainer}>
        <Image style={styles.friendImage}
          source={{
            uri: userFriendData
              ? userFriendData.displayPicture ||
                'https://reactnative.dev/img/tiny_logo.png'
              : 'https://reactnative.dev/img/tiny_logo.png'
              }}
        />
        <View style={styles.friendInfoText}>
          <TouchableOpacity style = {styles.button} onPress={onPress}>
            <Text style={styles.friendName}>
              {userFriendData ? userFriendData.username || 'Test' : 'Test'}
            </Text>
          </TouchableOpacity>
          <IconButton icon="account-remove-outline"
              size={20}
          onPress={() => alert('comment to be added!')}/>
        </View>
      </View>
    </View>
  );
};

export default FriendListFormat;

const styles = StyleSheet.create({
  friendContainer: {
    flex: 1,
    width: 350,
    height: 200,
    backgroundColor: '#fdf4da',
    justifyContent: 'space-around',
    alignItems: 'stretch',
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
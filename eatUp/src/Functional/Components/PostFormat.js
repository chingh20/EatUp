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

const PostFormat = ({post, onPress}) => {

  var currentUser = firebase.auth().currentUser;
  const [userData, setUserData] = useState(null);

  likeIcon = post.liked ? 'heart' : 'heart-outline';
  likeIconColor = post.liked ? '#2e64e5' : '#333';

  if (post.likes == 1) {
    likeText = '1 Like';
  } else if (post.likes > 1) {
    likeText = item.likes + ' Likes';
  } else {
    likeText = 'Like';
  }

  if (post.comments == 1) {
    commentText = '1 Comment';
  } else if (post.comments > 1) {
    commentText = item.comments + ' Comments';
  } else {
    commentText = 'Comment';
  }

  const getUser = async () => {
    await firebase.firestore()
      .collection('users')
      .doc(post.user)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      })
      .catch((error) => {
      alert(error);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.postContainer} key={post.id}>
      <View style={styles.userInfoContainer}>
        <Image style={styles.userImage}
          source={{
            uri: userData
              ? userData.displayPicture ||
                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
              : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
          }}
        />
        <View style={styles.userInfoText}>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.userName}>
              {userData ? userData.username || 'Test' : 'Test'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.time}>{moment(post.timestamp.toDate()).fromNow()}</Text>
        </View>
      </View>
      <Text style={styles.title}>{post.postTitle}</Text>
      {/* {item.postImg != null ? <PostImg source={{uri: item.postImg}} /> : <Divider />} */}
      {post.postPhoto != null ? (
        <Image style={styles.image}
          source={{uri: post.postPhoto}}
        />
      ) : (
        <Divider color='transparent' orientation='horizontal' width={1}/>
      )}

      <View style={styles.likeBar}>
      <TouchableOpacity>
           <IconButton icon={likeIcon} size={20} color={likeIconColor} />
           <Text style={styles.statusText}>{likeText}</Text>
      </TouchableOpacity>

        <TouchableOpacity>
          <IconButton icon="comment" size={20} />
          <Text style={styles.statusText}>{commentText}</Text>
        </TouchableOpacity>
        {currentUser.displayName == post.user ? (
          <TouchableOpacity onPress={() => alert('delete feature to be added!')}>
            <IconButton icon="delete" size={20} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default PostFormat;

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    width: 300,
    backgroundColor: '#f9ae8f',
    marginBottom: 15,
    borderRadius: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'flex-start',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfoText: {
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'center',
  },
  userName: {
    color: '#bc1824',
    fontSize: 20,
  },
  time: {
    color: '#d26d4d',
    fontSize: 10,
  },
  title: {
    color: '#3e1f0d',
    fontSize: 15,
    padding: 10,
    marginBottom: 10
  },
  userImage: {
    width: 300,
    height: 300,
  },
  likeBar: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#ff5757',
  },
  statusText: {
    color: '#d26d4d',
    fontSize: 10,
    marginTop: 5,
    marginLeft: 5,
  },
});
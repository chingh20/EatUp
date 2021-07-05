import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from "react-native";
import { IconButton } from "react-native-paper";
import { firebase } from "../../firebase/config";
import moment from "moment";
import { Divider } from "react-native-elements";

const PostFormat = ({ post, onPress }) => {
  var currentUser = firebase.auth().currentUser;
  const [userData, setUserData] = useState(null);

  const likeIcon = post.liked ? "heart" : "heart-outline";
  const likeIconColor = post.liked ? "#2e64e5" : "#333";

  const wantToGoIcon = post.wantToGo ? "star-face" : "star-outline";
  const wantToGoColor = post.wantToGo ? "#2e64e5" : "#333";

  var likeText = "";
  var commentText = "";

  if (post.likes == 1) {
    likeText = "1 Like";
    // update firebase
  } else if (post.likes > 1) {
    likeText = post.likes + " Likes";
    // update firebase
  } else {
    likeText = "Like";
    //update firebase
  }

  if (post.comments == 1) {
    commentText = "1 Comment";
  } else if (post.comments > 1) {
    commentText = post.comments + " Comments";
  } else {
    commentText = "Comment";
  }

  const getUser = async () => {
    await firebase
      .firestore()
      .collection("users")
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

  const onLikePost = (currentUsername, postId) => {
    const targetPost = firebase.firestore().collection("Posts").doc(postId);

    post.liked
      ? targetPost.update({
          likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        })
      : targetPost.update({
          likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        });
  };

  const onWantToGo = (currentUsername, postId) => {
    const targetPost = firebase.firestore().collection("Posts").doc(postId);
    const userFoodList = firebase
      .firestore()
      .collection("users")
      .doc(currentUsername);

    post.wantToGo
      ? targetPost.update({
          wantToGo: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        }) &&
        userFoodList.update({
          wantToGo: firebase.firestore.FieldValue.arrayRemove(
            post.postLocation
          ),
        })
      : targetPost.update({
          wantToGo: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        }) &&
        userFoodList.update({
          wantToGo: firebase.firestore.FieldValue.arrayUnion(post.postLocation),
        });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.postContainer} key={post.id}>
      <View style={styles.userInfoContainer}>
        <Image
          style={styles.userImage}
          source={{
            uri: userData
              ? userData.displayPicture ||
                "https://reactnative.dev/img/tiny_logo.png"
              : "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
        <View style={styles.userInfoText}>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.userName}>
              {userData ? userData.username || "Test" : "Test"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.time}>
            {moment(post.timestamp.toDate()).fromNow()}
          </Text>
        </View>
      </View>


      <View style={styles.tagContainer}>
        <IconButton icon="tag-multiple" size={20} />
        <Text style={styles.description}>{post.postTag}</Text>
      </View>

      <View style={styles.tagContainer}>
        <IconButton icon="flag-variant" size={20} />
        <Text style={styles.description}>{post.postLocation}</Text>
      </View>


      <View style={styles.imageView}>
        {post.postPhoto != null ? (
          <Image style={styles.image} source={{ uri: post.postPhoto }} />
        ) : (
          <Divider color="transparent" orientation="horizontal" width={2} />
        )}

        <Text style={styles.description}>{post.postDescription}</Text>
      </View>

      <View style={styles.likeBar}>
        <IconButton
          icon={likeIcon}
          size={20}
          color={likeIconColor}
          onPress={() => onLikePost(currentUser.displayName, post.id)}
        />
        <Text style={styles.statusText}>{likeText}</Text>

        <IconButton
          icon="comment"
          size={20}
          onPress={() => alert("comment to be added!")}
        />
        <Text style={styles.statusText}>{commentText}</Text>

        {currentUser.displayName != post.user ? (
          <IconButton
            icon={wantToGoIcon}
            size={20}
            color={wantToGoColor}
            onPress={() => onWantToGo(currentUser.displayName, post.id)}
          />
        ) : null}

        {currentUser.displayName == post.user ? (
          <IconButton
            icon="delete"
            size={20}
            onPress={() => alert("delete feature to be added!")}
          />
        ) : null}
      </View>
    </View>
  );
};

export default PostFormat;

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    width: 350,
    height: 550,
    backgroundColor: "#fdf4da",
    justifyContent: "center",
    alignItems: "stretch",
    marginBottom: 5,
    borderRadius: 10,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "flex-start",
    borderRadius: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfoText: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
  },
  userName: {
    color: "#bc1824",
    fontSize: 20,
  },
  time: {
    color: "#d26d4d",
    fontSize: 10,
  },
  description: {
    color: "#3e1f0d",
    fontSize: 15,
    padding: 10,
    marginBottom: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 5,
  },
  imageView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  likeBar: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#ff5757",
    borderRadius: 10,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    marginTop: 15,
    marginRight: 15,
  },
  tagContainer: {
    width:'100%',
    flexDirection: "row",
    alignItems: "center",
    padding: 1,
    marginBottom: 2,
    justifyContent: "flex-start",
    borderColor: "#ff5757",
    borderWidth: 1,
    borderRadius: 25,
  },
});

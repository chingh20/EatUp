import React, { useContext, useEffect, useState } from "react";
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
  ScrollView,
} from "react-native";
import { IconButton } from "react-native-paper";
import { firebase, storage } from "../../firebase/config";
import moment from "moment";
import { Divider } from "react-native-elements";

const PostFormat = ({ post, onPress }) => {
  var currentUser = firebase.auth().currentUser;
  const [userData, setUserData] = useState(null);
  const [likePost, setLikePost] = useState(post.liked);
  const [likeIcon, setLikeIcon] = useState(post.liked ? "heart" : "heart-outline");
  const [likeColor, setLikeColor] = useState(post.liked ? "#2e64e5" : "#333");
  const [wantToGo, setWantToGo] = useState(post.wantToGo);
  const [wantToGoIcon, setWantToGoIcon] = useState(post.wantToGo ? "star-face" : "star-outline");
  const [wantToGoColor, setWantToGoColor] = useState(post.wantToGo ? "#2e64e5" : "#333");
  const [likes, setLikes] = useState(post.likes);

  useEffect(() => {
  setLikeIcon(likePost ? "heart" : "heart-outline");
  setLikeColor(likePost ? "#2e64e5" : "#333");
  }, [likePost])

  useEffect(() => {
  setWantToGoIcon(wantToGo ? "star-face" : "star-outline");
  setWantToGoColor( wantToGo? "#2e64e5" : "#333");
  }, [wantToGo])

  var likeText = "";
  var commentText = "";

  if (likes == 1) {
    likeText = "1 Like";
  } else if (likes > 1) {
    likeText = likes + " Likes";
  } else {
    likeText= "Like";
  }

  if (post.comments == 1) {
    commentText = "1 Comment";
  } else if (post.comments > 1) {
    commentText = post.comments + " Comments";
  } else {
    commentText = "Comment";
  }

  function likeTextUpdate(liked) {
  alert('function')
    if (liked) {
        if (post.likes == 0) {
            setLikeText("1 Like");
        } else {
            setLikeText(post.likes + 1 + " Likes");
        }
    } else {
        if (post.likes == 2) {
          setLikeText("1 Like");
        } else if (post.likes > 2) {
          setLikeText(post.likes - 1 + " Likes");
        } else {
          setLikeText("Like");
        }
    }
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

    likePost
      ? targetPost.update({
          likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        }) &&
        setLikePost(false)

      : targetPost.update({
          likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        }) && setLikePost(true);
  };

  const onWantToGo = (currentUsername, postId) => {
    const targetPost = firebase.firestore().collection("Posts").doc(postId);
    const userFoodList = firebase
      .firestore()
      .collection("users")
      .doc(currentUsername);

    wantToGo
      ? targetPost.update({
          wantToGo: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        }) &&
        userFoodList.update({
          wantToGo: firebase.firestore.FieldValue.arrayRemove(
            post.postLocation
          ),
        }) &&
        setWantToGo(false)
      : targetPost.update({
          wantToGo: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        }) &&
        userFoodList.update({
          wantToGo: firebase.firestore.FieldValue.arrayUnion(post.postLocation),
        }) &&
        setWantToGo(true);
  };

  useEffect(() => {
    getUser();
  }, []);

  const onDeletePressed = (currentUsername, postId) => {
   let imageName = currentUsername + "-" + postId;
   Alert.alert(
          "DELETE",
          "Are you sure to delete this post?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "Yes",

              onPress: () => storage.ref()
                                    .child(`postPhotos/${imageName}`)
                                    .delete()
                                    .then(() => { firebase.firestore().collection("Posts").doc(postId).delete()
                                                  &&
                                                  firebase.firestore().collection(currentUsername).doc(postId).delete() })
                                    .catch((error) => { alert(error)
                                    alert('Delete unsuccessful!')})
            }
          ])
 }

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
          color={likeColor}
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
            onPress={() => onDeletePressed(currentUser.displayName, post.id)}
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
    alignSelf: "center",
    padding: 1,
    marginBottom: 2,
    justifyContent: "flex-start",
    borderColor: "#ff5757",
    borderWidth: 1,
    borderRadius: 25,
  },
});

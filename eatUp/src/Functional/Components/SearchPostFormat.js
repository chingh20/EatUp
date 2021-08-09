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

const SearchPostFormat = ({ post, onPress, onComment }) => {
  var currentUser = firebase.auth().currentUser;
  const [userData, setUserData] = useState(null);
  const [likePost, setLikePost] = useState(
    post.likes ? post.likes.includes(currentUser.displayName) : null
  );
  const [likeIcon, setLikeIcon] = useState(
    post.likes
      ? post.likes.includes(currentUser.displayName)
        ? "heart"
        : "heart-outline"
      : null
  );
  const [likes, setLikes] = useState(post.likeCount);
  const [likeText, setLikeText] = useState("");
  const [wantToGo, setWantToGo] = useState(
    post.wantToGo ? post.wantToGo.includes(currentUser.displayName) : null
  );
  const [wantToGoIcon, setWantToGoIcon] = useState(
    post.wantToGo
      ? post.wantToGo.includes(currentUser.displayName)
        ? "crown"
        : "crown-outline"
      : null
  );
  const [wantToGos, setWantToGos] = useState(post.wantToGoCount);
  const [wantToGoText, setWantToGoText] = useState("");
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    setLikeIcon(likePost ? "heart" : "heart-outline");
    setLikeText(showLikes(likes));
  }, [likePost]);

  useEffect(() => {
    setWantToGoIcon(wantToGo ? "crown" : "crown-outline");
    setWantToGoText(showWantToGos(wantToGos));
  }, [wantToGo]);

  var commentText = "";

  function showLikes(likes) {
    if (likes == 1) {
      return "1 Like";
    } else if (likes > 1) {
      return likes + " Likes";
    } else {
      return "Like";
    }
  }

  function showWantToGos(wantToGos) {
    if (wantToGos == 1) {
      return 1 + " Wants To Go!";
    } else if (wantToGos > 1) {
      return wantToGos + " Want To Go!";
    } else {
      return "";
    }
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

  const onLikePost = (currentUsername, postUser, postId) => {
    const targetPublicPost = firebase
      .firestore()
      .collection("Posts")
      .doc(postId);
    const targetPrivatePost = firebase
      .firestore()
      .collection(postUser)
      .doc(postId);
    if (likePost) {
      targetPublicPost.update({
        likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        likeCount: firebase.firestore.FieldValue.increment(-1),
      });
      targetPrivatePost.update({
        likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        likeCount: firebase.firestore.FieldValue.increment(-1),
      });
      setLikes(likes - 1);
      setLikePost(false);
    } else {
      targetPublicPost.update({
        likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        likeCount: firebase.firestore.FieldValue.increment(1),
      });
      targetPrivatePost.update({
        likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        likeCount: firebase.firestore.FieldValue.increment(1),
      });
      setLikes(likes + 1);
      setLikePost(true);
    }
  };

  const onWantToGo = (currentUsername, postUser, postId) => {
    const targetPublicPost = firebase
      .firestore()
      .collection("Posts")
      .doc(postId);
    const targetPrivatePost = firebase
      .firestore()
      .collection(postUser)
      .doc(postId);
    const userFoodList = firebase
      .firestore()
      .collection("users")
      .doc(currentUsername);

    if (wantToGo) {
      targetPublicPost.update({
        wantToGo: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        wantToGoCount: firebase.firestore.FieldValue.increment(-1),
      });
      targetPrivatePost.update({
        wantToGo: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        wantToGoCount: firebase.firestore.FieldValue.increment(-1),
      });
      userFoodList.update({
        wantToGo: firebase.firestore.FieldValue.arrayRemove(postId),
      });
      setWantToGos(wantToGos - 1);
      setWantToGo(false);
    } else {
      targetPublicPost.update({
        wantToGo: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        wantToGoCount: firebase.firestore.FieldValue.increment(1),
      });
      targetPrivatePost.update({
        wantToGo: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        wantToGoCount: firebase.firestore.FieldValue.increment(1),
      });
      userFoodList.update({
        wantToGo: firebase.firestore.FieldValue.arrayUnion(postId),
      });
      setWantToGos(wantToGos + 1);
      setWantToGo(true);
    }
  };

  useEffect(() => {
    getUser();
    setDeleted(false);
  }, [post]);

  const onDeletePressed = (
    currentUsername,
    postId,
    postPath,
    postWantToGoUsers
  ) => {
    Alert.alert("DELETE", "Are you sure to delete this post?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",

        onPress: () => {
          firebase
            .storage()
            .refFromURL(postPath)
            .delete()
            .then(() => {
              firebase.firestore().collection("Posts").doc(postId).delete();
              firebase
                .firestore()
                .collection(currentUsername)
                .doc(postId)
                .delete();
              postWantToGoUsers.forEach((person) => {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(person)
                  .update({
                    wantToGo: firebase.firestore.FieldValue.arrayRemove(postId),
                  });
              });
              firebase
                .firestore()
                .collection("users")
                .doc(currentUsername)
                .update({
                  posts: firebase.firestore.FieldValue.arrayRemove(postId),
                });
              setDeleted(true);
            })
            .catch((error) => {
              alert(error);
              alert("Delete unsuccessful! Please try again.");
            });
        },
      },
    ]);
  };

  return (
    <View>
      {!deleted ? (
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
              color="#3e1f0d"
              onPress={() =>
                onLikePost(currentUser.displayName, post.user, post.id)
              }
            />
            <Text style={styles.statusText}>{likeText}</Text>

            <IconButton
              icon="comment"
              size={20}
              color="#3e1f0d"
              onPress={onComment}
            />
            <Text style={styles.statusText}>{commentText}</Text>

            {currentUser.displayName != post.user ? (
              <IconButton
                icon={wantToGoIcon}
                size={20}
                color="#3e1f0d"
                onPress={() =>
                  onWantToGo(currentUser.displayName, post.user, post.id)
                }
              />
            ) : null}

            {currentUser.displayName == post.user ? (
              <IconButton
                icon="delete"
                size={20}
                color="#3e1f0d"
                onPress={() =>
                  onDeletePressed(
                    currentUser.displayName,
                    post.id,
                    post.postPhoto,
                    post.wantToGo
                  )
                }
              />
            ) : null}
          </View>
          <View style={styles.wantToGoTextContainer}>
            <Text style={styles.wantToGoDescription}>{wantToGoText}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default SearchPostFormat;

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
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    padding: 1,
    marginBottom: 2,
    justifyContent: "flex-start",
    borderColor: "#ff5757",
    borderWidth: 1,
    borderRadius: 25,
  },
  wantToGoTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  wantToGoDescription: {
    color: "#bc1824",
    fontSize: 12,
    fontWeight: "bold",
    padding: 15,
    marginBottom: 5,
  },
});

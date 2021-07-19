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
import { firebase } from "../../firebase/config";
import moment from "moment";
import { Divider } from "react-native-elements";

const PostViewMapFormat = ({ markerPost, onPress, onCommentPressed }) => {
  var currentUser = firebase.auth().currentUser;
  const [postUserData, setPostUserData] = useState(null);
  const [likePost, setLikePost] = useState(markerPost.liked);
  const [likeIcon, setLikeIcon] = useState(
    markerPost.liked ? "heart" : "heart-outline"
  );

  const [likes, setLikes] = useState(markerPost.likes);

  const [wantToGo, setWantToGo] = useState(markerPost.wantToGo);
  const [wantToGoIcon, setWantToGoIcon] = useState(
    markerPost.wantToGo ? "crown" : "crown-outline"
  );

  const [wantToGos, setWantToGos] = useState(markerPost.wantToGoCount);
  const [wantToGoText, setWantToGoText] = useState("");
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    setLikeIcon(likePost ? "heart" : "heart-outline");
    //setLikeText(showLikes(likes));
  }, [likePost]);

  useEffect(() => {
    setWantToGoIcon(wantToGo ? "crown" : "crown-outline");
    setWantToGoText(showWantToGos(wantToGos));
  }, [wantToGo]);

  //  function showLikes(likes) {
  //        if (likes == 1) {
  //          return "1";
  //        } else if (likes > 1) {
  //          return likes;
  //        } else {
  //          return "";
  //        }
  //  }

  function showWantToGos(wantToGos) {
    if (wantToGos == 1) {
      return 1 + " Wants To Go!";
    } else if (wantToGos > 1) {
      return wantToGos + " Want To Go!";
    } else {
      return "";
    }
  }

  var commentText = "";
  if (markerPost.comments == 1) {
    commentText = "1";
  } else if (markerPost.comments > 1) {
    commentText = markerPost.comments;
  } else {
    commentText = "";
  }

  const getUser = async () => {
    await firebase
      .firestore()
      .collection("users")
      .doc(markerPost.user)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setPostUserData(documentSnapshot.data());
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
      });
      targetPrivatePost.update({
        likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
      });
      setLikes(likes - 1);
      setLikePost(false);
    } else {
      targetPublicPost.update({
        likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
      });
      targetPrivatePost.update({
        likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
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
      });
      targetPrivatePost.update({
        wantToGo: firebase.firestore.FieldValue.arrayRemove(currentUsername),
      });
      userFoodList.update({
        wantToGo: firebase.firestore.FieldValue.arrayRemove(postId),
      });
      setWantToGos(wantToGos - 1);
      setWantToGo(false);
    } else {
      targetPublicPost.update({
        wantToGo: firebase.firestore.FieldValue.arrayUnion(currentUsername),
      });
      targetPrivatePost.update({
        wantToGo: firebase.firestore.FieldValue.arrayUnion(currentUsername),
      });
      userFoodList.update({
        wantToGo: firebase.firestore.FieldValue.arrayUnion(postId),
      });
      setWantToGos(wantToGos + 1);
      setWantToGo(true);
    }
  };

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
              alert("Delete unsuccessful! Please contact xxx for assistance!");
            });
        },
      },
    ]);
  };

  useEffect(() => {
    getUser();
    setLikePost(markerPost.liked);
    setWantToGo(markerPost.wantToGo);
    setLikes(markerPost.likes);
    setDeleted(false);
    //  setLikeText(showLikes(markerPost.likes));
  }, [markerPost]);

  return (
    <View style={styles.container} key={markerPost.id}>
      {!deleted ? (
        <View>
          <View style={styles.postContainer}>
            <View style={styles.imageView}>
              {markerPost.postPhoto != null ? (
                <Image
                  style={styles.image}
                  source={{ uri: markerPost.postPhoto }}
                />
              ) : (
                <Divider
                  color="transparent"
                  orientation="horizontal"
                  width={2}
                />
              )}
            </View>
            <View style={styles.imageView}>
              <View style={styles.userInfoContainer}>
                <Image
                  style={styles.userImage}
                  source={{
                    uri: postUserData
                      ? postUserData.displayPicture ||
                        "https://reactnative.dev/img/tiny_logo.png"
                      : "https://reactnative.dev/img/tiny_logo.png",
                  }}
                />
                <View style={styles.userInfoText}>
                  <TouchableOpacity onPress={onPress}>
                    <Text style={styles.userName}>
                      {postUserData ? postUserData.username || "Test" : "Test"}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.time}>
                    {moment(markerPost.timestamp.toDate()).fromNow()}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>
                {markerPost.postDescription}
              </Text>
              <Text style={styles.wantToGoDescription}>{wantToGoText}</Text>
            </View>
          </View>
          <View style={styles.likeBar}>
            <IconButton
              icon={likeIcon}
              size={20}
              color="#3e1f0d"
              onPress={() =>
                onLikePost(
                  currentUser.displayName,
                  markerPost.user,
                  markerPost.id
                )
              }
            />

            <IconButton
              icon="comment"
              size={20}
              color="#3e1f0d"
              onPress={onCommentPressed}
            />

            {currentUser.displayName != markerPost.user ? (
              <IconButton
                icon={wantToGoIcon}
                size={20}
                color="#3e1f0d"
                onPress={() =>
                  onWantToGo(
                    currentUser.displayName,
                    markerPost.user,
                    markerPost.id
                  )
                }
              />
            ) : null}

            {currentUser.displayName == markerPost.user ? (
              <IconButton
                icon="delete"
                size={20}
                color="#3e1f0d"
                onPress={() =>
                  onDeletePressed(
                    currentUser.displayName,
                    markerPost.id,
                    markerPost.postPhoto,
                    markerPost.wantToGoUsers
                  )
                }
              />
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default PostViewMapFormat;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
  },
  postContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#fdf4da",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: 10,
    width: "100%",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginBottom: 1,
    justifyContent: "flex-start",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfoText: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
  },
  userName: {
    color: "#bc1824",
    fontSize: 18,
  },
  time: {
    color: "#d26d4d",
    fontSize: 8,
  },
  description: {
    color: "#3e1f0d",
    fontSize: 15,
    padding: 1,
  },
  image: {
    width: 160,
    height: 160,
    marginLeft: 1,
    marginRight: 1,
    marginTop: 1,
    marginBottom: 1,
  },
  imageView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf4da",
    borderRadius: 5,
  },
  statusText: {
    color: "black",
    fontSize: 10,
    marginTop: 15,
    marginLeft: 15,
  },
  tagContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 1,
    borderColor: "#ff5757",
    borderWidth: 1,
    borderRadius: 25,
  },
  wantToGoDescription: {
    color: "#bc1824",
    fontSize: 12,
    fontWeight: "bold",
    padding: 5,
  },
});

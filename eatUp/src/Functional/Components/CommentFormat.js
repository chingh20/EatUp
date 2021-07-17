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

const CommentFormat = ({ owner, postId, commentDoc, onPress }) => {
  var currentUser = firebase.auth().currentUser;
  const [userData, setUserData] = useState(null);
  const [likeComment, setLikeComment] = useState(commentDoc.liked);
  const [likeIcon, setLikeIcon] = useState(
    commentDoc.liked ? "heart" : "heart-outline"
  );
  const [likes, setLikes] = useState(commentDoc.likes);
  const [likeText, setLikeText] = useState("");

  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    setLikeIcon(likeComment ? "heart" : "heart-outline");
    setLikeText(showLikes(likes));
  }, [likePost]);

  function showLikes(likes) {
    if (likes == 1) {
      return "1";
    } else if (likes > 1) {
      return likes;
    } else {
      return null;
    }
  }

  const onLikeComment = (currentUsername, postUser, postId, commenter) => {
    const targetPublicPostComment = firebase
      .firestore()
      .collection("Posts")
      .doc(postId)
      .collection("Comments")
      .doc(commenter);
    const targetPrivatePostComment = firebase
      .firestore()
      .collection(postUser)
      .doc(postId)
      .collection("Comments")
      .doc(commenter);
    if (likeComment) {
      targetPublicPostComment.update({
        likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
      });
      targetPrivatePostComment.update({
        likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
      });
      setLikes(likes - 1);
      setLikePost(false);
    } else {
      targetPublicPostComment.update({
        likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
      });
      targetPrivatePostComment.update({
        likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
      });
      setLikes(likes + 1);
      setLikePost(true);
    }
  };

  useEffect(() => {
    setDeleted(false);
  }, [post]);

  const onDeletePressed = (currentUsername, postId, postOwner) => {
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
            .firestore()
            .collection("Posts")
            .doc(postId)
            .collection("Comments")
            .doc(currentUsername)
            .delete()
            .then(() => {
              firebase
                .firestore()
                .collection(postOwner)
                .doc(postId)
                .collection(currentUsername)
                .doc(postId)
                .delete();

              firebase.firestore().collection(postOwner).doc(postId).update({comments: firebase.firestore.FieldValue.increment(-1)})
              firebase.firestore().collection("Posts").doc(postId).update({comments: firebase.firestore.FieldValue.increment(-1)})

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

  return (
    <View>
      {!deleted ? (
        <View style={styles.postContainer} key={commentDoc.user}>
          <View style={styles.userInfoText}>
            <TouchableOpacity onPress={onPress}>
              <Text style={styles.userName}>{commentDoc.user}</Text>
            </TouchableOpacity>

            <Text style={styles.description}>{commentDoc.commentText}</Text>
          </View>

          <View style={styles.likeBar}>
            <Text style={styles.time}>
              {moment(commentDoc.timestamp.toDate()).fromNow()}
            </Text>

            {currentUser.displayName == commentDoc.user ? (
              <IconButton
                icon="delete"
                size={20}
                color="#3e1f0d"
                onPress={() =>
                  onDeletePressed(currentUser.displayName, postId, owner)
                }
              />
            ) : (
              <View>
                <IconButton
                  icon={likeIcon}
                  size={20}
                  color="#3e1f0d"
                  onPress={() =>
                    onLikePost(
                      currentUser.displayName,
                      owner,
                      postId,
                      commentDoc.user
                    )
                  }
                />
                <Text style={styles.statusText}>{likeText}</Text>
              </View>
            )}
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default CommentFormat;

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    width: 350,
    height: 70,
    backgroundColor: "#fdf4da",
    justifyContent: "flex-start",
    alignItems: "stretch",
    marginBottom: 5,
    borderRadius: 10,
  },

  userInfoText: {
    flexDirection: "column",
    padding: 2,
    justifyContent: "center",
  },
  userName: {
    color: "#bc1824",
    fontSize: 15,
    fontWeight: "bold",
  },
  time: {
    color: "white",
    fontSize: 10,
  },
  description: {
    color: "#3e1f0d",
    fontSize: 15,
    padding: 10,
    marginBottom: 5,
  },
  likeBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ff5757",
    borderRadius: 10,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    marginTop: 15,
    marginRight: 15,
  },
});

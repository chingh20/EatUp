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
  }, [likeComment]);

  function showLikes(likes) {
    if (likes == 1) {
      return "1";
    } else if (likes > 1) {
      return likes;
    } else {
      return null;
    }
  }

  const onLikeComment = (currentUsername, postUser, postId, commentId) => {
    if (!currentUsername || !postUser || !postId || !commentId) {
      alert("Error occurred! Please try again.");
      return;
    }
    const targetPublicPostComment = firebase
      .firestore()
      .collection("Posts")
      .doc(postId)
      .collection("Comments")
      .doc(commentId);
    const targetPrivatePostComment = firebase
      .firestore()
      .collection(postUser)
      .doc(postId)
      .collection("Comments")
      .doc(commentId);

    if (likeComment) {
      targetPublicPostComment
        .update({
          likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        })
       .catch((e) => {
             alert(e)
             alert("An error occurred! Please try again.")
        });
      targetPrivatePostComment
        .update({
          likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        })
        .catch((e) => {
              alert(e)
              alert("An error occurred! Please try again.")
        });
      setLikes(likes - 1);
      setLikeComment(false);
    } else {
      targetPublicPostComment
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        })
        .catch((e) => {
              alert(e)
              alert("An error occurred! Please try again.")
        });
      targetPrivatePostComment
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        })
        .catch((e) => {
             alert(e)
             alert("An error occurred! Please try again.")
        });
      setLikes(likes + 1);
      setLikeComment(true);
    }
  };

  useEffect(() => {
    setDeleted(false);
  }, [commentDoc]);

  const onDeletePressed = (postId, postOwner, commentId) => {
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
            .doc(commentId)
            .delete()
            .then(() => {
              firebase
                .firestore()
                .collection(postOwner)
                .doc(postId)
                .collection("Comments")
                .doc(commentId)
                .delete();

              firebase
                .firestore()
                .collection(postOwner)
                .doc(postId)
                .update({
                  comments: firebase.firestore.FieldValue.increment(-1),
                });
              firebase
                .firestore()
                .collection("Posts")
                .doc(postId)
                .update({
                  comments: firebase.firestore.FieldValue.increment(-1),
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

   useEffect(() => {
     setDeleted(false);
   }, [commentDoc]);

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
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon={likeIcon}
                  size={20}
                  color="#3e1f0d"
                  onPress={() =>
                    onLikeComment(
                      currentUser.displayName,
                      owner,
                      postId,
                      commentDoc.user + "-" + commentDoc.timestamp
                    )
                  }
                />
                <Text style={styles.statusText}>{likeText}</Text>
                <IconButton
                  icon="delete"
                  size={20}
                  color="#3e1f0d"
                  onPress={() =>
                    onDeletePressed(
                      postId,
                      owner,
                      currentUser.displayName + "-" + commentDoc.timestamp
                    )
                  }
                />
              </View>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon={likeIcon}
                  size={20}
                  color="#3e1f0d"
                  onPress={() =>
                    onLikeComment(
                      currentUser.displayName,
                      owner,
                      postId,
                      commentDoc.user + "-" + commentDoc.timestamp
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
    // width: 350,
    marginRight: 20,
    marginLeft: 20,
    backgroundColor: "#fdf4da",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: 5,
    borderRadius: 10,
    flexDirection: "column",
  },

  userInfoText: {
    flexDirection: "column",
    padding: 2,
    justifyContent: "center",
  },
  userName: {
    color: "#bc1824",
    fontSize: 15,
    marginLeft: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  time: {
    color: "white",
    fontSize: 10,
    marginLeft: 10,
    flexDirection: "column",
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
    alignItems: "center",
    backgroundColor: "#ff5757",
    height: 30,
    borderRadius: 10,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    marginTop: 15,
    marginRight: 15,
  },
});

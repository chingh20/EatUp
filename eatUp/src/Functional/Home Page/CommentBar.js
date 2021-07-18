import { firebase } from "../../firebase/config";
import React, { useState, useEffect } from "react";
import {
  RefreshControl,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { IconButton } from "react-native-paper";
import { CustomizedTextInput as TextInput } from "../Components/CustomizedTextInput";

const CommentBar = ({postId, owner}) => {
  const currentUser = firebase.auth().currentUser.displayName;

  const [comment, setComment] = useState({ value: "", error: "" });
  const handleCommentUpdate = (text) => setComment({ value: text, error: "" });

  const upload = async (commentText) => {
    const uploadData = {
      commentText: commentText,
      likes: [],
      user: currentUser,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
    };

    firebase
      .firestore()
      .collection(owner)
      .doc(postId)
      .collection("Comments")
      .doc(currentUser)
      .set(uploadData)
      .then(() => {
        firebase
          .firestore()
          .collection("Posts")
          .doc(postId)
          .collection("Comments")
          .doc(currentUser)
          .set(uploadData);

        firebase.firestore().collection(owner).doc(postId).update({comments: firebase.firestore.FieldValue.increment(1)})
        firebase.firestore().collection("Posts").doc(postId).update({comments: firebase.firestore.FieldValue.increment(1)})
      })
      .catch((e) => {
        alert(e);
      });
  };

  function commentCheck(title) {
    if (!title) return "Add your comment here!";
    return "";
  }

  const onSubmit = async () => {
    const commentError = commentCheck(comment.value);

    if (commentError) {
      setComment({ ...comment, error: commentError });
    }

    try {

      upload(comment.value);

      handleCommentUpdate("");
    } catch (e) {
      alert(e);
      console.error(e);
    }
  };

  return (
  <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={handleCommentUpdate}
        value={comment.value}
        placeholder="Comment"
        error={!!comment.error}
        errorText={comment.error}
      />
      <IconButton
        icon="send-circle-outline"
        onPress={onSubmit}
        color="#3e1f0d"
        size={30}
        style={{ padding: 2 }}
       />
    </View>
  );
};

export default CommentBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
    flexDirection:"row",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#3e1f0d",
    fontSize: 20,
    marginBottom: 15,
    width: 300,
    height: 40,
  },
  button: {
    width: 200,
    marginTop: 30,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff5757",
    padding: 15,
    borderRadius: 50,
  },
  btnText: {
    color: "white",
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
  },
});

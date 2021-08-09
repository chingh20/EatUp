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
import { Divider } from "react-native-elements";

const UserSearchListFormat = ({
  users,
  onPress,
  userFriendArray,
  updateFriendArray,
}) => {
  var currentUsername = firebase.auth().currentUser.displayName;
  const friendNetwork = firebase.firestore().collection("FriendNetwork");

  const onNotAcceptPressed = () => {
    friendNetwork
      .doc(currentUsername)
      .update({
        friendRequests: firebase.firestore.FieldValue.arrayRemove(
          users.username
        ),
      })
      .catch((e) => alert(e));
    friendNetwork
      .doc(users.username)
      .update({
        requesting: firebase.firestore.FieldValue.arrayRemove(currentUsername),
      })
      .catch((e) => alert(e));
    alert("You have removed request from " + users.username + "!");
    updateFriendArray();
  };

  const onAcceptPressed = () => {
    friendNetwork
      .doc(currentUsername)
      .update({
        friendRequests: firebase.firestore.FieldValue.arrayRemove(
          users.username
        ),
      })
      .catch((e) => alert(e));
    friendNetwork
      .doc(users.username)
      .update({
        requesting: firebase.firestore.FieldValue.arrayRemove(currentUsername),
      })
      .catch((e) => alert(e));

    friendNetwork
      .doc(currentUsername)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(users.username),
      })
      .catch((e) => alert(e));
    friendNetwork
      .doc(users.username)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(currentUsername),
      })
      .catch((e) => alert(e));
    alert("You are friends with " + users.username + "!");
    updateFriendArray();
  };

  const onRequestAddFriendPressed = () => {
    friendNetwork
      .doc(users.username)
      .update({
        friendRequests:
          firebase.firestore.FieldValue.arrayUnion(currentUsername),
      })
      .catch((e) => alert(e));
    friendNetwork
      .doc(currentUsername)
      .update({
        requesting: firebase.firestore.FieldValue.arrayUnion(users.username),
      })
      .catch((e) => alert(e));
    alert("You have requested to follow " + users.username + "!");
    updateFriendArray();
  };

  const onRemoveRequestPressed = () => {
    friendNetwork
      .doc(users.username)
      .update({
        friendRequests:
          firebase.firestore.FieldValue.arrayRemove(currentUsername),
      })
      .catch((e) => alert(e));
    friendNetwork
      .doc(currentUsername)
      .update({
        requesting: firebase.firestore.FieldValue.arrayRemove(users.username),
      })
      .catch((e) => alert(e));
    alert("You have cancelled your request to follow " + users.username + "!");
    updateFriendArray();
  };

  const unfriend = () => {
    Alert.alert("UNFOLLOW?", "Unfollow " + users + "?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          friendNetwork
            .doc(currentUsername)
            .update({
              friends: firebase.firestore.FieldValue.arrayRemove(
                users.username
              ),
            })
            .catch((e) => alert(e));
          friendNetwork
            .doc(users.username)
            .update({
              friends:
                firebase.firestore.FieldValue.arrayRemove(currentUsername),
            })
            .catch((e) => alert(e));
          updateFriendArray();
        },
      },
    ]);
  };

  return (
    <View style={styles.friendContainer} key={users ? users.username : ""}>
      <View style={styles.friendInfoContainer}>
        <Image
          style={styles.friendImage}
          source={{
            uri: users
              ? users.displayPicture ||
                "https://reactnative.dev/img/tiny_logo.png"
              : "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
        <View style={styles.friendInfoText}>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.friendName}>
              {users ? users.username : "Test"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {users && userFriendArray ? (
        userFriendArray.friendRequests.includes(users.username) ? (
          <View>
            <IconButton
              icon="check-outline"
              size={20}
              onPress={onAcceptPressed}
            />
            <IconButton
              icon="close-outline"
              size={20}
              onPress={onNotAcceptPressed}
            />
          </View>
        ) : userFriendArray.requesting.includes(users.username) ? (
          <IconButton icon="undo" size={20} onPress={onRemoveRequestPressed} />
        ) : !userFriendArray.friends.includes(users.username) &&
          currentUsername != users.username ? (
          <IconButton
            icon="account-plus-outline"
            size={20}
            onPress={onRequestAddFriendPressed}
          />
        ) : userFriendArray.friends.includes(users.username) &&
          currentUsername != users.username ? (
          <IconButton
            icon="account-remove-outline"
            size={20}
            onPress={unfriend}
          />
        ) : null
      ) : null}
    </View>
  );
};

export default UserSearchListFormat;

const styles = StyleSheet.create({
  friendContainer: {
    flex: 1,
    flexDirection: "row",
    width: 350,
    height: 70,
    backgroundColor: "#fdf4da",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: 10,
  },
  friendInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "flex-start",
    borderRadius: 10,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  friendInfoText: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
  },
  friendName: {
    color: "#bc1824",
    fontSize: 20,
  },
});

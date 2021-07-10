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

const PostViewMapFormat = ({ markerPost, onPress }) => {
  var currentUser = firebase.auth().currentUser;
  const [postUserData, setPostUserData] = useState(null);
  const [likePost, setLikePost] = useState(markerPost.liked);
  const [likeIcon, setLikeIcon] = useState(markerPost.liked ? "heart" : "heart-outline");
  const [likeColor, setLikeColor] = useState(markerPost.liked ? "#2e64e5" : "#333");
  const [wantToGo, setWantToGo] = useState(markerPost.wantToGo);
  const [wantToGoIcon, setWantToGoIcon] = useState(markerPost.wantToGo ? "star-face" : "star-outline");
  const [wantToGoColor, setWantToGoColor] = useState(markerPost.wantToGo ? "#2e64e5" : "#333");
  const [likes, setLikes] = useState(markerPost.likes);
  const [likeText, setLikeText] = useState('')

  useEffect(() => {
  setLikeIcon(likePost ? "heart" : "heart-outline");
  setLikeColor(likePost ? "#2e64e5" : "#333");
  setLikeText(showLikes(likes));
  }, [likePost])

  useEffect(() => {
  setWantToGoIcon(wantToGo ? "star-face" : "star-outline");
  setWantToGoColor( wantToGo? "#2e64e5" : "#333");
  }, [wantToGo])



  function showLikes(likes) {
        if (likes == 1) {
          return "1 Like";
        } else if (likes > 1) {
          return likes + " Likes";
        } else {
          return "Like";
        }
    }


  var commentText = "";
  if (markerPost.comments == 1) {
    commentText = "1 Comment";
  } else if (markerPost.comments > 1) {
    commentText = markerPost.comments + " Comments";
  } else {
    commentText = "Comment";
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

 // writing to other user's docs??
   const onLikePost = (currentUsername, postUser, postId) => {
     const targetPublicPost = firebase.firestore().collection("Posts").doc(postId);
     const targetPrivatePost = firebase.firestore().collection(postUser).doc(postId);
     if (likePost) {
            targetPublicPost.update({
               likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
             })
            targetPrivatePost.update({
                likes: firebase.firestore.FieldValue.arrayRemove(currentUsername),
            })
            setLikes(likes - 1)
            setLikePost(false)
     } else {
            targetPublicPost.update({
                likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
            })
            targetPrivatePost.update({
               likes: firebase.firestore.FieldValue.arrayUnion(currentUsername),
            })
            setLikes(likes + 1)
            setLikePost(true)
     }
}
  const onWantToGo = (currentUsername, postId) => {
    const targetPost = firebase.firestore().collection("Posts").doc(postId);
    const userFoodList = firebase
      .firestore()
      .collection("users")
      .doc(currentUsername);

    markerPost.wantToGo
      ? targetPost.update({
          wantToGo: firebase.firestore.FieldValue.arrayRemove(currentUsername),
        }) &&
        userFoodList.update({
          wantToGo: firebase.firestore.FieldValue.arrayRemove(
            markerPost.postLocation
          ),
        }) &&
        setWantToGo(false)
      : targetPost.update({
          wantToGo: firebase.firestore.FieldValue.arrayUnion(currentUsername),
        }) &&
        userFoodList.update({
          wantToGo: firebase.firestore.FieldValue.arrayUnion(markerPost.postLocation),
        }) &&
        setWantToGo(true);
  };

  useEffect(() => {
    getUser();
    setLikePost(markerPost.liked);
    setWantToGo(markerPost.wantToGo);
    setLikes(markerPost.likes);
    setLikeText(showLikes(markerPost.likes));
  }, [markerPost]);

  return (
    <View style={styles.postContainer} key={markerPost.id}>
    <View style={styles.imageView}>
            {markerPost.postPhoto != null ? (
              <Image style={styles.image} source={{ uri: markerPost.postPhoto }} />
            ) : (
              <Divider color="transparent" orientation="horizontal" width={2} />
            )}

            <Text style={styles.description}>{markerPost.postDescription}</Text>
    </View>

    <View style= {styles.imageView}>
      <View>
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

      <View style={styles.tagContainer}>
        <IconButton icon="tag-multiple" size={20} />
        <Text style={styles.description}>{markerPost.postTag}</Text>
      </View>

      <View style={styles.tagContainer}>
        <IconButton icon="flag-variant" size={20} />
        <Text style={styles.description}>{markerPost.postLocation}</Text>
      </View>

      <View style={styles.likeBar}>
        <IconButton
          icon={likeIcon}
          size={20}
          color={likeColor}
          onPress={() => onLikePost(currentUser.displayName, markerPost.user, markerPost.id)}
        />
        <Text style={styles.statusText}>{likeText}</Text>

        <IconButton
          icon="comment"
          size={20}
          onPress={() => alert("comment to be added!")}
        />
        <Text style={styles.statusText}>{commentText}</Text>

        {currentUser.displayName != markerPost.user ? (
          <IconButton
            icon={wantToGoIcon}
            size={20}
            color={wantToGoColor}
            onPress={() => onWantToGo(currentUser.displayName, markerPost.id)}
          />
        ) : null}

        {currentUser.displayName == markerPost.user ? (
          <IconButton
            icon="delete"
            size={20}
            onPress={() => alert("delete feature to be added!")}
          />
        ) : null}
      </View>
     </View>
     </View>
    </View>
  );
};

export default PostViewMapFormat;

const styles = StyleSheet.create({
  postContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#fdf4da",
    justifyContent: "space-between",
    alignItems: "center",
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
    width: 150,
    height: 150,
    marginLeft: 1,
    marginRight: 1,
    marginTop: 1,
    marginBottom: 1,
  },
  imageView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  likeBar: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#ff5757",
    borderRadius: 10,
    width: '100%'
  },
  statusText: {
    color: "white",
    fontSize: 10,
    marginTop: 15,
    marginRight: 15,
  },
  tagContainer: {
    width: '100%',
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

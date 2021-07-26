import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { firebase } from "../../firebase/config";
import UserSearchListFormat from "../Components/UserSearchListFormat";
import SearchPostFormat from "../Components/SearchPostFormat";

export default function SearchBar({
  navigation,
  searchUsers,
  searchLocations,
  searchTags,
  changeSearchNow,
}) {
  const [searchResult, setSearchResult] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState(null);
  const [userFriendNetwork, setUserFriendNetwork] = useState(null);
  const username = firebase.auth().currentUser.displayName;

  const handleSearchTextUpdate = (search) => {
    setSearchText(search);
    return search;
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUserDetails();
      getUserFriendNetwork();
      handleSearchTextUpdate("");
      fetchSearchResult("");
    });
    return unsubscribe;
  }, [navigation]);

  const fetchSearchResult = (search) => {
    setSearchResult([]);
    if (search == "" || search == null) {
      setSearchResult([]);
      return;
    }

    if (search.length > 0 && search != " ") {
      if (searchUsers) {
        firebase
          .firestore()
          .collection("users")
          .where("username", ">=", search)
          .where("username", "<=", search + "\uf8ff")
          .get()
          .then((snapshot) => {
            let user = snapshot.docs.map((doc) => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data };
            });
            setSearchResult(user);
          })
          .catch((e) => alert(e));
      } else if (searchLocations) {
        firebase
          .firestore()
          .collection("Posts")
          .where("postLocation", "==", search)
          .where("postLocation", "<=", search + "\uf8ff")
          .get()
          .then((snapshot) => {
            let post = snapshot.docs.map((doc) => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data };
            });
            setSearchResult(mergeSort(post));
          });
      } else if (searchTags) {
        firebase
          .firestore()
          .collection("Posts")
          .where("postTag", ">=", search)
          .where("postTag", "<=", search + "\uf8ff")
          .get()
          .then((snapshot) => {
            let post = snapshot.docs.map((doc) => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data };
            });
            setSearchResult(mergeSort(post));
          });
      } else {
        setSearchResult([]);
      }
    }
  };

  const getUserDetails = async () => {
    if (username == null) return;
    await firebase
      .firestore()
      .collection("users")
      .doc(username)
      .get()
      .then((documentSnapshot) => {
        setUserData(documentSnapshot.data());
      })
      .catch((e) => {
        alert(e);
      });
  };

  const getUserFriendNetwork = async () => {
    await firebase
      .firestore()
      .collection("FriendNetwork")
      .doc(username)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserFriendNetwork(documentSnapshot.data());
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const updateFriends = () => {
    getUserFriendNetwork();
  };

  const onPressed = (item) => {
    const friends = userFriendNetwork ? userFriendNetwork.friends : [];
    if (item.username == username) {
      navigation.navigate("Home");
      return;
    }
    if (friends.includes(item.username)) {
      setSearchResult([]);
      handleSearchTextUpdate("");
      navigation.navigate("OtherUser", {
        otherUser: item.username,
        otherUserFriendArray: friends,
      });
    } else {
      alert("Viewing profile is only available after adding friend");
    }
  };

  const onCommentPressed = (item) => {
    navigation.navigate("Comment", {
      postId: item.id,
      postOwner: item.user,
      postComment: item.comments,
      userFriends: userFriendNetwork ? userFriendNetwork.friends : [],
    });
  };

  function merge(left, right) {
    let sortedArr = []; // the sorted elements will go here

    while (left.length && right.length) {
      // insert the smallest element to the sortedArr
      if (left[0].likeCount > right[0].likeCount) {
        sortedArr.push(left.shift());
      } else if (left[0].likeCount < right[0].likeCount) {
        sortedArr.push(right.shift());
      } else {
        if (left[0].wantToGoCount > right[0].wantToGoCount) {
          sortedArr.push(left.shift());
        } else if (left[0].wantToGoCount < right[0].wantToGoCount) {
          sortedArr.push(right.shift());
        } else {
          if (left[0].timestamp > right[0].timestamp) {
            sortedArr.push(left.shift());
          } else {
            sortedArr.push(right.shift());
          }
        }
      }
    }

    // use spread operator and create a new array, combining the three arrays
    return [...sortedArr, ...left, ...right];
  }

  function mergeSort(arr) {
    const half = arr.length / 2;

    // the base case is array length <=1
    if (arr.length <= 1) {
      return arr;
    }

    const left = arr.splice(0, half); // the first half of the array
    const right = arr;
    return merge(mergeSort(left), mergeSort(right));
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    getUserFriendNetwork();
  }, []);

  useEffect(() => {
    setSearchResult(null);
    fetchSearchResult(searchText);
  }, [changeSearchNow]);

  return (
    <View>
      <TextInput
        style={styles.textInput}
        placeholder="Search"
        value={searchText}
        onChangeText={(search) =>
          fetchSearchResult(handleSearchTextUpdate(search))
        }
      />
      {searchUsers ? (
        <FlatList
          data={searchResult}
          renderItem={({ item }) => (
            <UserSearchListFormat
              users={item}
              onPress={() => onPressed(item)}
              userFriendArray={userFriendNetwork}
              updateFriendArray={updateFriends}
            />
          )}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="always"
        />
      ) : (
        <FlatList
          data={searchResult}
          renderItem={({ item }) => (
            <SearchPostFormat
              post={item}
              onPress={() => onPressed(item)}
              onComment={() => onCommentPressed(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="always"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "#3e1f0d",
    fontSize: 20,
    marginBottom: 15,
    width: 350,
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
});

import {
  Platform,
  Text,
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../../firebase/config";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { IconButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Avatar } from "react-native-elements";
import ChangeDisplayPic from "./ChangeDisplayPic";
import GooglePlacesInput from "./googleMap";
import defaultUserImage from "../../../assets/default-user-image.png";
import Search from "./Search";
import { mapStyle, mapStyle2 } from "./MapTheme";
import PostViewMapFormat from "../Components/PostViewMapFormat";

export default function OtherUser({navigation, route}) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      let person ='';
      if (route.params) {
          person = route.params.otherUser;
          setFriendArray(route.params.otherUserFriendArray);
      } else {
          person = firebase.auth().currentUser.displayName;
      }
      getUsername(person);
      getUserDetails(person);
      PostPlaces(person);
      WantToGoPlace(person);
    });
    return unsubscribe;
  }, [navigation, route]);


  var initRegion = {
    latitude: 1.3649170000000002,
    longitude: 103.82287200000002,
    latitudeDelta: 0.3,
    longitudeDelta: 0.25,
  };

  const [username, setUserName] = useState(null);
  const [userData, setUserData] = useState(null);
  const [wantToGo, setWantToGo] = useState(null);
  const [postPlaces, setPostPlaces] = useState(null);
  const [starMarkerFilter, setStarMarkerFilter] = useState(true);
  const [postMarkerFilter, setPostMarkerFilter] = useState(true);
  const [backToInitialRegion, setBackToInitialRegion] = useState(false);
  const [markerPressed, setMarkerPressed] = useState(null);
  const [friendArray, setFriendArray] = useState(null);

  const currentUser = firebase.auth().currentUser.displayName;


  const starMarkerFilterIcon = starMarkerFilter ? "star" : "star-outline";
  const postMarkerFilterIcon = postMarkerFilter ? "eye" : "eye-outline";

  const onMarkerPressed = (id) => {
    setMarkerPressed(id);
  };

  const onStarMarkerFilterPressed = () => {
    if (starMarkerFilter) {
      setStarMarkerFilter(false);
    } else {
      setStarMarkerFilter(true);
    }
  };

  const onPostMarkerFilterPressed = () => {
    if (postMarkerFilter) {
      setPostMarkerFilter(false);
    } else {
      setPostMarkerFilter(true);
    }
  };

  const onBackToInitialRegionPressed = () => {
    if (!backToInitialRegion) {
      setBackToInitialRegion(true);
    }
  };


  const getUsername = (person) => {
      setUserName(person);
  }


  const getUserDetails = async (person) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(person)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const PostPlaces = async (person) => {
    try {
      const PostPlacesArray = [];

      await firebase
        .firestore()
        .collection(person)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              id,
              postPhoto,
              postTag,
              postDescription,
              postLocation,
              postGeoCoordinates,
              likes,
              wantToGo,
              user,
              timestamp,
              comments,
            } = doc.data();

            PostPlacesArray.push({
              id: doc.id,
              user,
              postPhoto,
              postTag,
              postDescription,
              postLocation,
              postGeoCoordinates,
              timestamp: timestamp,
              liked: likes.includes(currentUser),
              likes: likes.length,
              wantToGo: wantToGo.includes(currentUser),
              wantToGoCount: wantToGo.length,
              comments,
            });
          });
        })
        .catch((error) => {
          alert(error);
        });

      setPostPlaces(PostPlacesArray);
    } catch (e) {
      console.log(e);
    }
  };

  const WantToGoPlace = async (person) => {
    try {
      const wantToGoArray = [];

      await firebase
        .firestore()
        .collection("Posts")
        .where("wantToGo", "array-contains", person)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              id,
              postPhoto,
              postTag,
              postDescription,
              postLocation,
              postGeoCoordinates,
              likes,
              wantToGo,
              user,
              timestamp,
              comments,
            } = doc.data();

            wantToGoArray.push({
              id: doc.id,
              user,
              postPhoto,
              postTag,
              postDescription,
              postLocation,
              postGeoCoordinates,
              timestamp: timestamp,
              liked: likes.includes(currentUser),
              likes: likes.length,
              wantToGo: wantToGo.includes(currentUser),
              wantToGoCount: wantToGo.length,
              comments,
            });
          });
        })
        .catch((error) => {
          alert(error);
        });

      setWantToGo(wantToGoArray);
    } catch (e) {
      console.log(e);
    }
  };



  const onUserPressed = (markerPressed) => {
          if (friendArray == null){
          alert('Viewing profile is only available after adding friend')
          return;}
          if (markerPressed.user == currentUser) {
          alert(currentUser)
          navigation.navigate('Home')
          return;
          }
          if (friendArray.includes(markerPressed.user)){
             navigation.navigate('OtherUser', {otherUser: markerPressed.user, otherUserFriendArray: friendArray})
          } else {
           alert('Viewing profile is only available after adding friend')
          }
  }

  return (
    <SafeAreaView style={styles.homecontainer}>
      <View style={styles.upper}>
        <IconButton
          icon="home-import-outline"
          onPress={() => navigation.navigate('Home')}
          color="#3e1f0d"
          size={30}
          style={{ margin: 0 }}
        />
      </View>

      <View style={styles.middle}>
      <View style={styles.userInfo}>
        <Avatar
          rounded
          size="large"
          avatarStyle={{ width: 100, height: 100, borderRadius: 50 }}
          containerStyle={{
            width: 100,
            height: 100,
            borderWidth: 1,
            borderRadius: 50,
            marginBottom: 10,
          }}
          source={{ uri: userData ? userData.displayPicture : null }}
        />
        <View style={styles.userInfoText}>
        <Text style={styles.name}>{username}</Text>
        <Text>
        {" "}
        Following {userData ? userData.friends.length : null} other Food
        Lover(s)!{" "}
        </Text>
        </View>
      </View>

        <MapView
          style={styles.map}
          scrollEnabled={false}
          initialRegion={initRegion}
          region={onBackToInitialRegionPressed ? initRegion : null}
          scrollEnabled={true}
          minZoomLevel={10}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
        >
          {wantToGo && starMarkerFilter
            ? wantToGo.map((post) => (
                <Marker
                  onPress={() => onMarkerPressed(post)}
                  pinColor={"#fffcc7"}
                  key={post.id}
                  coordinate={{
                    latitude: post.postGeoCoordinates.latitude,
                    longitude: post.postGeoCoordinates.longitude,
                  }}
                >
                  <Callout tooltip style={{ width: 150 }}>
                    <Text style={styles.name}>{post.postLocation}</Text>
                  </Callout>
                </Marker>
              ))
            : null}

          {postPlaces && postMarkerFilter ? (
            postPlaces.map((post) => (
              <Marker
                key={post.id}
                coordinate={{
                  latitude: post.postGeoCoordinates.latitude,
                  longitude: post.postGeoCoordinates.longitude,
                }}
                onPress={() => onMarkerPressed(post)}
              >
                <Callout style={{ width: 150 }}>
                  <View>
                    <Text style={styles.name}>{post.postLocation}</Text>
                  </View>
                </Callout>
              </Marker>
            ))
          ) : (
            <View />
          )}
        </MapView>
      </View>

      <View style={styles.filter}>
        <IconButton
          icon={starMarkerFilterIcon}
          onPress={onStarMarkerFilterPressed}
          color="#3e1f0d"
          size={30}
          style={{ margin: 0 }}
        />
        <IconButton
          icon={postMarkerFilterIcon}
          onPress={onPostMarkerFilterPressed}
          color="#3e1f0d"
          size={30}
          style={{ margin: 0 }}
        />
      </View>

      <View style={styles.postcontainer}>
        {markerPressed ? (
          <PostViewMapFormat
            markerPost={markerPressed}
            onPress={() =>onUserPressed(markerPressed)}
          />
        ) : (
          <View />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf1",
  },

  homecontainer: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 3,
    backgroundColor: "#fffbf1",
    alignItems: "stretch",
    justifyContent: "space-around",
  },

  postcontainer: {
    flex: 1,
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
  },

  upper: {
    flexDirection: "row",
    backgroundColor: "#fffbf1",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  userInfo: {
    backgroundColor: "#fffbf1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  middle: {
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfoText: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
  },
  filter: {
    flexDirection: "row",
    backgroundColor: "#fffbf1",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  map: {
    width: 600,
    height: 250,
  },
  name: {
    color: "#3e1f0d",
    fontSize: 20,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 150,
    marginTop: 30,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff5757",
    padding: 15,
    borderRadius: 50,
  },
});

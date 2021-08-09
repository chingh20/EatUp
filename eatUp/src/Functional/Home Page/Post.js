import React, { useState, useEffect } from "react";
import { IconButton } from "react-native-paper";
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
import { firebase, storage } from "../../firebase/config";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { CustomizedTextInput as TextInput } from "../Components/CustomizedTextInput";
import uuid from "uuid";
import ModalSelector from "react-native-modal-selector";
import * as Location from "expo-location";

export default function Post({ navigation, route }) {
  var username = firebase.auth().currentUser.displayName;

  const upload = async (post) => {
    const id = uuid.v4();

    let uri = image.value;

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    let imageName = username + "-" + id;
    let reference = await storage.ref().child(`postPhotos/${imageName}`);

    await reference.put(blob).catch((error) => {
      console.log(error);
    });

    let url = await reference.getDownloadURL();

    const uploadData = {
      id: id,
      postPhoto: url,
      postTag: post.tag,
      postLocation: post.location,
      postDescription: post.description,
      postGeoCoordinates: post.geoCoordinates,
      likes: [],
      likeCount: 0,
      wantToGo: [],
      wantToGoCount: 0,
      comments: 0,
      user: username,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
    };

    firebase
      .firestore()
      .collection(username)
      .doc(id)
      .set(uploadData)
      .then(() => {
        firebase.firestore().collection("Posts").doc(id).set(uploadData);

        if (newTag.value != "") {
          firebase
            .firestore()
            .collection("users")
            .doc(username)
            .update({
              posts: firebase.firestore.FieldValue.arrayUnion(id),
              customTags: firebase.firestore.FieldValue.arrayUnion(
                newTag.value
              ),
            });
        } else {
          firebase
            .firestore()
            .collection("users")
            .doc(username)
            .update({
              posts: firebase.firestore.FieldValue.arrayUnion(id),
            });
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      handleImageUpdate(result.uri);
    }
  };

  const [tag, setTag] = useState({ value: "", error: "" });
  const [image, setImage] = useState({ value: null, error: "" });
  const [location, setLocation] = useState({ value: "", error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });
  const [geolocation, setGeolocation] = useState({ value: "", error: "" });
  const [userData, setUserData] = useState(null);
  const [newTag, setNewTag] = useState({ value: "", error: "" });

  const handleTagUpdate = (text) => {
    setTag({ value: text, error: "" });
  };
  const handleNewTagUpdate = (text) => {
    setNewTag({ value: text, error: "" });
  };

  const handleImageUpdate = (image) => setImage({ value: image, error: "" });
  const handleLocationUpdate = (text) =>
    setLocation({ value: text, error: "" });
  const handleDescriptionUpdate = (text) =>
    setDescription({ value: text, error: "" });
  const handleGeolocationUpdate = (geoPoint) =>
    setGeolocation({ value: geoPoint, error: "" });

  const takePicture = async () => {
    navigation.navigate("CameraFunction");
  };

  function titleCheck(title) {
    if (!title) return "This can't be empty!";
    return "";
  }

  function imageCheck(image) {
    if (image === null) return "Please choose an image!";
    return "";
  }

  function geolocationCheck(geolocation) {
    if (!geolocation) return "Geolocation must be loaded to post";
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access geolocation was denied");
        return;
      }
      let place = await Location.getCurrentPositionAsync({});
      handleGeolocationUpdate(place);
    })();
  }, []);

  useEffect(() => {
    if (route.params) {
      handleImageUpdate(route.params.photo);
    }
  }, [route.params]);

  useEffect(() => {
    getUserDetails();
  }, []);
  let text = "";
  if (!geolocation.value) {
    text = "Waiting for geolocation...";
  }

  const onSubmit = async () => {
    const tagError = titleCheck(tag.value);
    const newTagError =
      tag.value == "New Tags!" ? titleCheck(newTag.value) : null;
    const imageError = imageCheck(image.value);
    const locationError = titleCheck(location.value);
    const descriptionError = titleCheck(description.value);
    const geolocationError = geolocationCheck(geolocation.value);

    if (
      tagError ||
      newTagError ||
      imageError ||
      locationError ||
      descriptionError ||
      geolocationError
    ) {
      setNewTag({ ...newTag, error: newTagError });
      setImage({ ...image, error: imageError });
      setLocation({ ...location, error: locationError });
      setDescription({ ...description, error: descriptionError });
      setGeolocation({ ...geolocation, error: geolocationError });
      return;
    }

    try {
      const post = {
        photo: image.value,
        tag: newTag.value ? newTag.value : tag.value,
        location: location.value,
        description: description.value,
        geoCoordinates: geolocation
          ? new firebase.firestore.GeoPoint(
              geolocation.value.coords.latitude,
              geolocation.value.coords.longitude
            )
          : null,
      };

      upload(post);

      handleImageUpdate(null);
      handleLocationUpdate("");
      handleDescriptionUpdate("");
      handleTagUpdate("");
      handleNewTagUpdate("");
      handleGeolocationUpdate("");
    } catch (e) {
      alert(e);
      console.error(e);
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

  const defaultData = [
    { key: 0, label: "Indian" },
    { key: 1, label: "Chinese" },
    { key: 2, label: "Korean" },
    { key: 3, label: "Western" },
    { key: 4, label: "Fast Food" },
    { key: 5, label: "Drinks" },
    { key: 6, label: "Desserts" },
    { key: 7, label: "Japanese" },
    { key: 8, label: "New Tags!" },
  ];

  const modalSelectorData = (tags) => {
    const totalTags = tags.length;
    if (totalTags > 0) {
      let index = 0;
      const data = [
        { key: index++, label: "Indian" },
        { key: index++, label: "Chinese" },
        { key: index++, label: "Korean" },
        { key: index++, label: "Western" },
        { key: index++, label: "Fast Food" },
        { key: index++, label: "Drinks" },
        { key: index++, label: "Desserts" },
        { key: index++, label: "Japanese" },
      ];

      for (let i = 0; i < totalTags; i++) {
        data.push({ key: index++, label: tags[i] });
      }
      data.push({ key: index++, label: "New Tags!" });
      return data;
    } else {
      return defaultData;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="always"
        >
          <View>
            <View style={styles.imageContainer}>
              {image.value ? (
                <View>
                  <Image
                    source={{ uri: image.value }}
                    style={{ width: 300, height: 300 }}
                  />
                  <View style={styles.retake}>
                    <TouchableOpacity
                      style={styles.nobutton}
                      onPress={selectImage}
                    >
                      <Text style={styles.nobtnText}> Choose Again </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.nobutton}
                      onPress={takePicture}
                    >
                      <Text style={styles.nobtnText}> Camera </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <TouchableOpacity style={styles.button} onPress={selectImage}>
                    <Text style={styles.btnText}> Pick from Gallery </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Text style={styles.btnText}> Camera </Text>
                  </TouchableOpacity>
                  <Text style={styles.errorText}> {image.error}</Text>
                </View>
              )}
            </View>
            <View style={styles.detailContainer}>
              <ModalSelector
                data={
                  userData
                    ? modalSelectorData(userData.customTags)
                    : defaultData
                }
                initValue="Select the type of food!"
                touchableStyle={styles.picker}
                accessible={true}
                supportedOrientations={["portrait"]}
                scrollViewAccessibilityLabel={"Scrollable options"}
                cancelButtonAccessibilityLabel={"Cancel Button"}
                onChange={(option) => {
                  handleTagUpdate(option.label);
                }}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Select the type of food!"
                  editable={true}
                  value={tag.value}
                  error={!!tag.error}
                  errorText={tag.error}
                />
              </ModalSelector>

              {tag.value == "New Tags!" ? (
                <TextInput
                  placeholder="Enter your new tag!"
                  style={styles.textInput}
                  value={newTag.value}
                  onChangeText={handleNewTagUpdate}
                  error={!!newTag.error}
                  errorText={newTag.error}
                />
              ) : null}

              <TextInput
                placeholder="Enter location of the post"
                style={styles.textInput}
                value={location.value}
                onChangeText={handleLocationUpdate}
                error={!!location.error}
                errorText={location.error}
              />

              <TextInput
                placeholder="Enter description"
                style={styles.textInput}
                value={description.value}
                onChangeText={handleDescriptionUpdate}
                error={!!description.error}
                errorText={description.error}
              />

              <Text>{text} </Text>
              <Text style={styles.errorText}>{geolocation.error}</Text>
              <TouchableOpacity style={styles.button} onPress={onSubmit}>
                <Text style={styles.btnText}> Add post </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 2,
  },
  container: {
    flex: 2.5,
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  retake: {
    flexDirection: "row",
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1.5,
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
  },
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
  btnText: {
    color: "white",
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
  },
  nobutton: {
    color: "#3e1f0d",
    fontSize: 20,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 20,
    color: "#fd1d1d",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  picker: {
    backgroundColor: "transparent",
    width: 350,
    height: 40,
  },
});

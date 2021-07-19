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
import React, { useState } from "react";
import { firebase } from "../../firebase/config";
import * as ImagePicker from "expo-image-picker";
import { CustomizedTextInput as TextInput } from "../Components/CustomizedTextInput";
import { StatusBar } from "expo-status-bar";
import { storage } from "../../firebase/config";
import defaultUserImage from "../../../assets/default-user-image.png";

const ChangeDisplayPic = ({ navigation, route }) => {
  var user = firebase.auth().currentUser;
  var username = user.displayName;
  const defaultUserImageUri = Image.resolveAssetSource(defaultUserImage).uri;

  const changePic = async (avatarImage) => {
    var reference = await storage.ref().child(`profilePhotos/${username}`);
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

    await reference.put(blob).catch((error) => {
      alert(error);
    });

    let url = await reference.getDownloadURL();
    firebase.firestore().collection("users").doc(username).update({
      displayPicture: url,
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

  const [image, setImage] = useState({
    value: route.params.picture,
    error: "",
  });
  const handleImageUpdate = (image) => setImage({ value: image, error: "" });

  function imageCheck(image) {
    if (image === null) return "Please choose an image!";
    return "";
  }

  const onChange = async () => {
    const imageError = imageCheck(image.value);

    if (imageError) {
      setImage({ ...image, error: imageError });
      return;
    }

    try {
      const avatarImage = image.value;

      changePic(avatarImage);
      handleImageUpdate(avatarImage);

      navigation.navigate("Home", {pic:avatarImage});
    } catch (e) {
      console.error(e);
    }
  };

  const onRemove = () => {
    alert("You have removed your profile picture!");

    handleImageUpdate(defaultUserImageUri);
  };

  return (
    <SafeAreaView style={styles.container}>
      {image.value ? (
        <View style={styles.container}>
          <Image
            source={{ uri: image.value }}
            style={{ width: 300, height: 300 }}
          />

          <TouchableOpacity style={styles.button} onPress={selectImage}>
            <Text style={styles.btnText}> Choose Another Picture </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onRemove}>
            <Text style={styles.btnText}> Remove Picture </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={selectImage}>
            <Text style={styles.btnText}> Pick from Gallery </Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.errorText}> {image.error}</Text>

      <TouchableOpacity style={styles.button} onPress={onChange}>
        <Text style={styles.btnText}> Save </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
  image: {
    height: 250,
    width: 350,
    marginBottom: 10,
  },
  nobutton: {
    color: "#3e1f0d",
    fontSize: 20,
    marginTop: 30,
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
});

export default ChangeDisplayPic;

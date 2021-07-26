import React, { useState } from "react";
import { firebase } from "../../firebase/config";
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
import { StatusBar } from "expo-status-bar";
import { CustomizedTextInput as TextInput } from "../Components/CustomizedTextInput";
import { emailCheck } from "./emailCheck";
import { passwordCheck } from "./passwordCheck";
import { usernameCheck } from "./usernameCheck";
import defaultPicture from "../../../assets/default-user-image.png";

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const defaultUserImageUri = Image.resolveAssetSource(defaultPicture).uri;

  const onSignupPressed = () => {
    const emailError = emailCheck(email.value);
    const usernameError = usernameCheck(username.value);
    const passwordError = passwordCheck(password.value);

    if (emailError || passwordError || usernameError) {
      setEmail({ ...email, error: emailError });
      setUsername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    registerUser();
  };

  const handleEmailUpdate = (text) => setEmail({ value: text, error: "" });
  const handleUsernameUpdate = (text) =>
    setUsername({ value: text, error: "" });
  const handlePasswordUpdate = (text) =>
    setPassword({ value: text, error: "" });

  const changePic = async () => {
    var reference = await storage
      .ref()
      .child(`profilePhotos/${username.value}`);
    let uri = defaultUserImageUri;
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
    return url;
  };

  const registerUser = async () => {
    const usersRef = firebase.firestore().collection("users");
    const userProfile = await usersRef.doc(username.value).get();

    if (!userProfile.exists) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value)
        .then((res) => {
          res.user.updateProfile({
            displayName: username.value,
          });

          const uid = res.user.uid;
          const pic = changePic();

          const data = {
            id: uid,
            email: email.value,
            username: username.value,
            mapTheme: "default",
            displayPicture: pic,
            customTags: [],
            wantToGo: [],
            posts: [],
          };

          usersRef
            .doc(username.value)
            .set(data)
            .then(() => {
              const friendNetworkFields = {
                friends: [],
                friendRequests: [],
                requesting: [],
              };

              firebase
                .firestore()
                .collection("FriendNetwork")
                .doc(username.value)
                .set(friendNetworkFields);

              alert("Welcome to EATUP, " + username.value + "!");
              navigation.navigate("Home", { data });
            })
            .catch((error) => {
              alert(error);
            });
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/weak-password") {
            setPassword({
              ...password,
              error: "Password should be more than 8 characters!",
            });
            return;
          } else if (errorCode == "auth/email-already-in-use") {
            setEmail({ ...email, error: "Email address is invalid." });
            return;
          } else if (errorCode == "auth/invalid-email") {
            setEmail({ ...email, error: "Email address is invalid." });
            return;
          } else {
            alert(errorMessage);
          }
        });
    } else {
      setUsername({ ...username, error: "Choose another username!" });
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
          <Image
            style={styles.image}
            source={require("../../../assets/create-account-logo.png")}
          />
          <TextInput
            placeholder="Username"
            returnKeyType="next"
            value={username.value}
            style={styles.textInput}
            onChangeText={handleUsernameUpdate}
            error={!!username.error}
            errorText={username.error}
          />
          <TextInput
            placeholder="Email"
            returnKeyType="next"
            returnKeyType="done"
            value={email.value}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            style={styles.textInput}
            onChangeText={handleEmailUpdate}
            error={!!email.error}
            errorText={email.error}
          />
          <TextInput
            placeholder="Password"
            value={password.value}
            style={styles.textInput}
            onChangeText={handlePasswordUpdate}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={onSignupPressed}>
            <Text style={styles.btnText}>To Food Adventures!</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  scroll: {
    flexDirection: "column",
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
});

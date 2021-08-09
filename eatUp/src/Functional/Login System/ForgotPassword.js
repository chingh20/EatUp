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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { emailCheck } from "./emailCheck";
import { CustomizedTextInput as TextInput } from "../Components/CustomizedTextInput";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: "" });

  const onResetPressed = () => {
    const emailError = emailCheck(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    resetPassword(email);
  };

  const resetPassword = (email) => {
    firebase
      .auth()
      .sendPasswordResetEmail(email.value)
      .then(function (user) {
        alert("A link has been sent to your email!");
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  const handleEmailUpdate = (text) => setEmail({ value: text, error: "" });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.nobutton}>
          Enter your registered email account to reset password!
        </Text>
        <TextInput
          placeholder="Email"
          returnKeyType="next"
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
        <TouchableOpacity style={styles.button} onPress={onResetPressed}>
          <Text style={styles.btnText}>Reset Password</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 200,
    marginTop: 50,
    backgroundColor: "#ff5757",
    padding: 15,
    borderRadius: 50,
  },
  nobutton: {
    color: "#3e1f0d",
    fontSize: 20,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  nobuttontext: {
    color: "#bc1824",
    fontSize: 20,
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
  textInput: {
    color: "#3e1f0d",
    borderWidth: 1,
    borderColor: "#3e1f0d",
    fontSize: 20,
    marginBottom: 8,
    width: 200,
    height: 30,
  },
});

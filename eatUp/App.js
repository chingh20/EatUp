import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Start from "./src/Functional/Login System/Start";
import Login from "./src/Functional/Login System/Login";
import ForgotPassword from "./src/Functional/Login System/ForgotPassword";
import Signup from "./src/Functional/Login System/Signup";
import BottomTab from "./src/Functional/Home Page/BottomTab";
import ChangeDisplayPic from "./src/Functional/Home Page/ChangeDisplayPic";
import OtherUser from "./src/Functional/Home Page/OtherUser";
import CameraFunction from "./src/Functional/Home Page/CameraFunction";
import FriendSearch from "./src/Functional/Home Page/FriendSearch";
import Comment from "./src/Functional/Home Page/Comment";

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="ChangeDisplayPic" component={ChangeDisplayPic} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Home" component={BottomTab} />
          <Stack.Screen name="OtherUser" component={OtherUser} />
          <Stack.Screen name="CameraFunction" component={CameraFunction} />
          <Stack.Screen name="FriendSearch" component={FriendSearch} />
          <Stack.Screen name="Comment" component={Comment} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

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
  btnText: {
    color: "white",
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
  },
  image: {
    height: 250,
    width: 350,
  },
  textInput: {
    color: "black",
    borderWidth: 1,
    borderColor: "black",
    fontSize: 20,
    marginBottom: 8,
    width: 200,
    height: 30,
  },
});

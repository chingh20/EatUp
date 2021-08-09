import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { IconButton } from "react-native-paper";
import SearchBar from "./SearchBar";

const Search = ({ navigation }) => {
  const [searchUsers, setSearchUsers] = useState(true);
  const [searchLocations, setSearchLocations] = useState(false);
  const [searchTags, setSearchTags] = useState(false);
  const [changeSearch, setChangeSearch] = useState(false);

  const onSearchingUsers = () => {
    setSearchUsers(true);
    setSearchLocations(false);
    setSearchTags(false);
    setChangeSearch(!changeSearch);
  };

  const onSearchingLocations = () => {
    setSearchUsers(false);
    setSearchLocations(true);
    setSearchTags(false);
    setChangeSearch(!changeSearch);
  };

  const onSearchingTags = () => {
    setSearchUsers(false);
    setSearchLocations(false);
    setSearchTags(true);
    setChangeSearch(!changeSearch);
  };

  const userSearchFilterIcon = searchUsers ? "account" : "account-outline";
  const locationSearchFilterIcon = searchLocations
    ? "flag-variant"
    : "flag-variant-outline";
  const tagSearchFilterIcon = searchTags
    ? "tag-multiple"
    : "tag-multiple-outline";

  return (
    <SafeAreaView style={styles.homecontainer}>
      <View style={styles.container}>
        <View style={styles.filterIcon}>
          <IconButton
            icon={userSearchFilterIcon}
            size={20}
            color="#3e1f0d"
            onPress={onSearchingUsers}
          />

          <IconButton
            icon={locationSearchFilterIcon}
            size={20}
            color="#3e1f0d"
            onPress={onSearchingLocations}
          />

          <IconButton
            icon={tagSearchFilterIcon}
            size={20}
            color="#3e1f0d"
            onPress={onSearchingTags}
          />
        </View>

        <SearchBar
          navigation={navigation}
          searchUsers={searchUsers}
          searchLocations={searchLocations}
          searchTags={searchTags}
          changeSearchNow={changeSearch}
        />
      </View>
    </SafeAreaView>
  );
};

export default Search;
const styles = StyleSheet.create({
  homecontainer: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: "#fffbf1",
    alignItems: "center",
    justifyContent: "space-around",
  },
  container: {
    flex: 1,
    backgroundColor: "#fffbf1",
  },
  filterIcon: {
    flexDirection: "row",
    justifyContent: "flex-end",
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

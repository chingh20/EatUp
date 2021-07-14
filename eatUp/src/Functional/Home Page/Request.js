import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { firebase } from '../../firebase/config';
import RequestFormat from '../Components/RequestFormat'


export default function Request({friendRequestsArray, updateFriendsNow}) {

    return (
    <View>
    <Text> FRIEND REQUESTS! </Text>

     <FlatList
                data={friendRequestsArray}
                renderItem={({ item }) => (
                <RequestFormat
                requestFrom={item}
                updateFriendsNow={updateFriendsNow}
                />
                )}
                keyExtractor={(item) => (item)}
            />
     </View>
    )
}

const styles = StyleSheet.create({
  textInput: {
      borderWidth: 1,
      borderColor: '#3e1f0d',
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
                justifyContent: 'center',
                backgroundColor: "#ff5757",
                padding: 15,
                borderRadius: 50,
                },


})

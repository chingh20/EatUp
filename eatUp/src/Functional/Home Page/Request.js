import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { firebase } from '../../firebase/config';
import RequestFormat from '../Components/RequestFormat'


export default function Request() {

    var user = firebase.auth().currentUser
    var userDisplayName = user.displayName

    const [network, setNetwork] = useState(null)

  const fetchUserFriendNetworkArray = async () => {

            await firebase.firestore()
              .collection('FriendNetwork')
              .doc(userDisplayName)
              .get()
              .then((documentSnapshot) => {
                 if (documentSnapshot.exists) {
                    setNetwork(documentSnapshot.data());

                 }
              })
              .catch((error) => {
                 alert(error);
              });

      }


      useEffect(() =>
         {
          fetchUserFriendNetworkArray();
          } , []
      )

    return (
    <View>
    <Text> FRIEND REQUESTS! </Text>

     <FlatList
                data={network ? network.friendRequests : null}
                renderItem={({ item }) => (
                <RequestFormat
                requestFrom={item}
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

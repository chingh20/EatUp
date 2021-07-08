import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { firebase } from '../../firebase/config';
import FriendListFormat from '../Components/FriendListFormat'


export default function FriendSearch({array, navigation}) {

    var user = firebase.auth().currentUser
    var userDisplayName = user.displayName

    const [userFriends, setUserFriends] = useState(null)



    const fetchUsers = (search) => {
          if (search != '' || search != ' '){
           const friend = array.filter( (person) => {
                         return person.startsWith(search)
                    })
                    setUserFriends(friend);
          }
    }


    return (
        <View>
            <TextInput
                style= {styles.textInput}
                placeholder="Search Friends"
                onChangeText={(search) => fetchUsers(search)} />

     <FlatList
                data={userFriends == null ? array : userFriends}
                renderItem={({ item }) => (
                <FriendListFormat
                friends={item}
                navigation= {navigation}/>
                )}
                keyExtractor={(item) => item}
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

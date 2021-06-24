import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { firebase } from '../../firebase/config';


export default function FriendSearch({array}) {
    var user = firebase.auth().currentUser
    var userDisplayName = user.displayName

    const [friends, setFriends] = useState([])

    const fetchUsers = (search) => {
          if (search.length > 0 && search != " ") {
          const friend = array.filter( (person) => {
                       return person.startsWith(search)
          })
             setFriends(friend);

          } else {
          setFriends([])
          }

    }

    const onPressed = (user) => {
    alert(user)
    setFriends([])
    }

    return (
        <View>
            <TextInput
                style= {styles.textInput}
                placeholder="Search Friends"
                onChangeText={(search) => fetchUsers(search)} />

     <FlatList
               numColumns={1}
                horizontal={false}
                data={friends}
                renderItem={({ item }) => (
                <TouchableOpacity
                style = {styles.button}
                onPress = {(item) => onPressed(item)}
                >
                    <Text>{item}</Text>
                </TouchableOpacity>
                )}
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

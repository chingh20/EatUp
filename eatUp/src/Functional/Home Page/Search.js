import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { firebase } from '../../firebase/config';
import UserSearchListFormat from '../Components/UserSearchListFormat'

export default function Search() {
    const [users, setUsers] = useState([])


    const fetchUsers = (search) => {
    if(search.length > 0 && search != " ") {
    firebase.firestore()
                .collection('users')
                .where('username', '>=', search).where('username', '<=', search+ '\uf8ff')
                .get()
                .then((snapshot) => {

        let user = snapshot.docs.map(doc => {
                const data = doc.data();
                      const id = doc.id;
                     return { id, ...data }
                  });
                    setUsers(user);
                })
    } else {
    setUsers([])
    }
    }

    const onPressed = (item) => {
    alert(item.username)
    setUsers([])
    }

    return (
        <View>
            <TextInput
                style= {styles.textInput}
                placeholder="Search"
                onChangeText={(search) => fetchUsers(search)} />

     <FlatList
                data={users}
                renderItem={({ item }) => (
                <UserSearchListFormat
                users={item}
                onPress = {() => onPressed(item)}
                />
                )}
                keyExtractor={(item) => item.username}
                showsVerticalScrollIndicator={false}
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

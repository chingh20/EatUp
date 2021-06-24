import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { firebase } from '../../firebase/config';


export default function Search({navigation}) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('username', '>=', search)
            .get()
            .then((snapshot) => {

    let user = snapshot.docs.map(doc => {
            const data = doc.data();
                  const id = doc.id;
                 return { id, ...data }
              });
                setUsers(user);
            })
    }

    const onPressed = (user) => {
    alert(user.username)
    setUsers([])
    }

    return (
        <View>
            <TextInput
                style= {styles.textInput}
                placeholder="Type Here..."
                onChangeText={(search) => fetchUsers(search)} />

     <FlatList
               numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                <TouchableOpacity
                style = {styles.button}
                onPress = {(item) => onPressed(item)}
                >
                    <Text>{item.username}</Text>
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

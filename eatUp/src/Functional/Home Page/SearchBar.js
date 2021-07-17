import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { firebase } from '../../firebase/config';
import UserSearchListFormat from '../Components/UserSearchListFormat'

export default function SearchBar({navigation}) {

    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [userData, setUserData] = useState(null);
    const [userFriendNetwork, setUserFriendNetwork] = useState(null);
    const username = firebase.auth().currentUser.displayName;

    const handleSearchTextUpdate = (search) => {
    setSearchText(search);
    return search;
    }

     React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
         // alert("Refreshed");
          getUserDetails();
          getUserFriendNetwork();
          handleSearchTextUpdate('');
          fetchUsers('');
        });
        return unsubscribe;
      }, [navigation]);

    const fetchUsers = (search) => {
    if (search == '') { setUsers([])};
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
    }
    }

      const getUserDetails = async () => {
        await firebase
          .firestore()
          .collection("users")
          .doc(username)
          .get()
          .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
              setUserData(documentSnapshot.data());
            }
          })
          .catch((e) => {
            alert(e);
          });
      };

      const getUserFriendNetwork = async () => {
        await firebase
          .firestore()
          .collection("FriendNetwork")
          .doc(username)
          .get()
          .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
              setUserFriendNetwork(documentSnapshot.data());
            }
          })
          .catch((e) => {
            alert(e);
          });
      };

    const updateFriends = () => {
        getUserFriendNetwork();
    }

    const onPressed = (item) => {
        const friends = userFriendNetwork ? userFriendNetwork.friends : [];
        if (item.username == username) {
        navigation.navigate('Home')
        return;}
        if (friends.includes(item.username)){
           setUsers([])
           handleSearchTextUpdate('')
           navigation.navigate('OtherUser', {otherUser: item.username, otherUserFriendArray: friends})
        } else {
         alert('Viewing profile is only available after adding friend')
        }
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    useEffect(() => {
        getUserFriendNetwork();
    }, []);

    return (
        <View>
            <TextInput
                style= {styles.textInput}
                placeholder="Search"
                value={searchText}
                onChangeText={(search) => fetchUsers(handleSearchTextUpdate(search))} />

     <FlatList
                data={users}
                renderItem={({ item }) => (
                <UserSearchListFormat
                users={item}
                onPress = {() => onPressed(item)}
                userFriendArray ={userFriendNetwork}
                updateFriendArray ={updateFriends}
                />
                )}
                keyExtractor={(item) => item.username}
                keyboardShouldPersistTaps="always"
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

import {firebase} from '../../firebase/config';
import React, { useState, useEffect } from 'react';
import {
  RefreshControl,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  FlatList
} from 'react-native';
import PostFormat from '../Components/PostFormat'
import { StatusBar } from 'expo-status-bar';



const Feed = (props) => {
  var user = firebase.auth().currentUser
  var username = user.displayName

  React.useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', () => {
        alert('Refreshed');
        fetchPost();
      });
      return unsubscribe;
    }, [props.navigation]);

  const [refreshing, setRefreshing] = useState(false);

    const wait = (timeout) => {
      return new Promise(resolve => setTimeout(resolve, timeout));
    }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState([]);

  const fetchPost = async () => {
          try {
            const list = [];

            await firebase.firestore()
              .collection('Posts')
              .orderBy('timestamp', 'desc')
              .get()
              .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      const {
                          id,
                          postPhoto,
                          postTag,
                          postDescription,
                          postLocation,
                          likes,
                          wantToGo,
                          user,
                          timestamp,
                          comments
                      } = doc.data();


                      list.push({
                      id: doc.id,
                      user: user,
                      postPhoto,
                      postTag,
                      postDescription,
                      postLocation,
                      timestamp: timestamp,
                      liked: likes.includes(username),
                      likes: likes.length,
                      wantToGo: wantToGo.includes(username),
                      wantToGoCount: wantToGo.length,
                      comments,
                      });
                    });
                  })
                  .catch((error)=> {
                  alert(error)
                  });

              setPost(list);
              if (loading) {
                setLoading(false);
              }

              } catch (e) {
              console.log(e)
              }
      }

      useEffect(() =>
         {
          fetchPost();
          } , []
      )

      const listHeader = () => {
        return null;
      }

      return (
      <SafeAreaView style={styles.container}>

         <FlatList
                 refreshControl={
                   <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                   />
                 }
            data={post}
            renderItem={({item}) => (
               <PostFormat
                 post={item}
                 onPress={() => props.navigation.navigate('OtherUser',{friend: item.user})}
               />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={listHeader}
            ListFooterComponent={listHeader}
            showsVerticalScrollIndicator={false}
         />
      </SafeAreaView>
      )

 }
export default Feed;

const styles = StyleSheet.create({
  scroll: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

  },
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
    btnText: {
      color: "white",
      fontSize: 20,
      justifyContent: "center",
      textAlign: "center",
    },
    image: {
      height: 250,
      width: 350,
      marginBottom: 10
    },
    nobutton: {
           color: '#3e1f0d',
           fontSize: 20,
           marginTop: 30,
           alignItems: 'center',
           justifyContent: 'center',
        },
    errorText: {
          fontSize: 20,
          color: '#fd1d1d',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop:20
    }
});



import { firebase } from "../../firebase/config";
import React, { useState, useEffect } from "react";
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
  FlatList,
} from "react-native";
import { IconButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { CustomizedTextInput as TextInput } from "../Components/CustomizedTextInput";
import CommentBar from "./CommentBar";
import CommentFormat from "../Components/CommentFormat";


const Comment = ({ navigation, route }) => {
  const currentUser = firebase.auth().currentUser.displayName;

  React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        alert('Refreshed');
        fetchComments();
      });
      return unsubscribe;
    }, [navigation]);

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
      return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    alert('Refreshed');
    fetchComments();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(false);
  const [comment, setComment] = useState([]);


  const fetchComments = async () => {
  setLoad(true)
          try {
            const list = [];

            await firebase.firestore()
              .collection('Posts')
              .doc(route.params.postId)
              .collection('Comments')
              .orderBy('timestamp', 'desc')
              .get()
              .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      const {
                          likes,
                          user,
                          timestamp,
                          commentText
                      } = doc.data();

                      list.push({
                      user: user,
                      timestamp: timestamp,
                      liked: likes.includes(currentUser),
                      likes: likes.length,
                      commentText: commentText,
                      });
                    });
                  })
                  .catch((error)=> {
                  alert(error)
                  });

              setComment(list);
              if (loading) {
                setLoading(false);
              }

              } catch (e) {
              alert(e)
              }
      }

      useEffect(() => {
      if(route.params) {
           if (route.params.postComment > 0) {
             fetchComments();
            return;
           }
      }},[]
      )

       const onUserPressed = (item) => {
               const friendArray = route.params.userFriends;
               if (item.user == currentUser) {
                  navigation.navigate('Home');
               }
               else if (friendArray && friendArray.includes(item.user)){
                  navigation.navigate('OtherUser', {otherUser: item.user, otherUserFriendArray: friendArray})
               } else {
                  alert('Viewing profile is only available after adding friend')
               }
       }

      const refreshComments = () => {
                   fetchComments();
                   alert("refreshed!");
      }

      return (
      <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >

      <View style={styles.upper}>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          color="#3e1f0d"
          size={30}
          style={{ alignItems: 'flex-start', }}
        />
        <Text style = {styles.nobutton}>Comments</Text>
      </View>
       {load ? <FlatList
                        refreshControl={
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                          />
                        }
                   data={comment}
                   renderItem={({item}) => (
                      <CommentFormat
                        commentDoc={item}
                        postId={route.params.postId}
                        owner={route.params.postOwner}
                        onPress={() => onUserPressed(item)}
                      />
                   )}
                   keyExtractor={(item) => item.user+"-"+item.timestamp}
                   ListHeaderComponent={
                   <CommentBar
                   postId={route.params? route.params.postId:null}
                   owner={route.params? route.params.postOwner:null}
                   refresh={refreshComments}/>}
                   showsVerticalScrollIndicator={false}
                   keyboardShouldPersistTaps="always"
                /> : null}
      </KeyboardAvoidingView>
      </SafeAreaView>
      )
 }



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
//    alignItems: 'center',
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
           marginTop: 15,
           alignItems: 'center',
           justifyContent: 'center',
           fontWeight: 'bold',
        },
    errorText: {
          fontSize: 20,
          color: '#fd1d1d',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop:20
    },
     upper: {
       flexDirection: "row",
       backgroundColor: "#fffbf1",
      // alignItems: "stretch",
       justifyContent: "flex-start",
     },
});


export default Comment;
import { Platform, Text, SafeAreaView, View, Image, StyleSheet, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import { firebase } from '../../firebase/config';
import { StatusBar } from 'expo-status-bar';
import storage from '@react-native-firebase/storage';


 const HandlingImage = ({path}, {imageName}) => {

  const reference = storage().ref(imageName);
  reference.putFile(path);

}

export default HandlingImage




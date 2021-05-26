import { Text, View, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { firebase } from '../../firebase/config';

export default function HomeScreen(props,user) {
    return (
        <View style = {styles.container}>
            <Text>Home Screen</Text>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbf1',
    alignItems: 'center',
    justifyContent: 'center',
  }
 })
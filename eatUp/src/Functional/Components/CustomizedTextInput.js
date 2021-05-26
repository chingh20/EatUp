import React from 'react'
import { View, StyleSheet, Text,TextInput } from 'react-native'

export function CustomizedTextInput({ errorText, ...props }) {
  return (
  <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        {...props}
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
  </View>
  )
}

const styles = StyleSheet.create({
   textInput: {
       borderWidth: 1,
       borderColor: '#3e1f0d',
       fontSize: 20,
       marginTop: 15,
       width: 350,
       height: 40,
     },
   container: {
     flex: 1,
     backgroundColor: '#fffbf1',
     alignItems: 'center',
     justifyContent: 'center',
   },
   errorText: {
      fontSize: 10,
      marginTop: 0,
   }
})
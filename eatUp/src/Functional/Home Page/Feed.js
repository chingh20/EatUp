import React from 'react';
import { Platform, Text, SafeAreaView, View, } from 'react-native';

import Star from './Star';



export default function Feed () {
    const area_id = '0'
    return (
    <SafeAreaView>
    <Text> Feed </Text>
    <View>
   <Star />
          </View>
    </SafeAreaView>
    );

}
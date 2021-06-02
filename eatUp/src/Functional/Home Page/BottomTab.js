import React from 'react';
import Settings from './Settings';
import Feed from './Feed';
import Post from './Post';
import Home from './Home';
import Friends from './Friends';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


export default function BottomTab () {

const Tab = createBottomTabNavigator();

      return (
               <Tab.Navigator
                   initialRouteName="Home"
                      tabBarOptions={{
                      activeTintColor: '#e91e63',
               }}
               >
               <Tab.Screen name="Home" component={Home} />
               <Tab.Screen name="Feed" component={Feed} />
               <Tab.Screen name="Post" component={Post} />
               <Tab.Screen name="Friends" component={Friends} />
               <Tab.Screen name="Settings" component={Settings} />
               </Tab.Navigator>
      );

 }

import { useAuth } from "@clerk/expo"
import { Ionicons } from "@expo/vector-icons"
import { Redirect, Tabs } from 'expo-router'
import React from 'react'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import "../global.css"

const TabsLayout = () => {

  const {isSignedIn, isLoaded} = useAuth()

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="../(auth)" />;
  const insets  = useSafeAreaInsets();
  
  return (
    <Tabs
    screenOptions={
      {
        headerShown:false,
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#B3B3B3",
        tabBarStyle: {
          position: 'absolute',
        backgroundColor:'#202020',
          borderTopWidth: 0,
          height:  38 + insets.bottom,
          paddingTop: 4,
          marginHorizontal: 70,
          marginBottom: insets.bottom,
          borderRadius: 16,
          overflow: "hidden"
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 600
        },
      }
    }
    >

      <Tabs.Screen 
        name='index' 
        options={{
          title: 'Shop',
          tabBarIcon: ({color,size}) => <Ionicons name="grid" size={size} color={color} />
        }}
      />
      <Tabs.Screen 
        name='cart' 
        options={{
          title: 'Cart',
          tabBarIcon: ({color,size}) => <Ionicons name="cart" size={size} color={color} />
        }}
      />
      <Tabs.Screen 
        name='profile' 
        options={{
          title: 'Profil',
          tabBarIcon: ({color,size}) => <Ionicons name="person" size={size} color={color} />
        }}
      />

    </Tabs>
  )
}

export default TabsLayout
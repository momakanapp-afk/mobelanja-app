import { Ionicons } from "@expo/vector-icons"
import { Tabs } from 'expo-router'
import React from 'react'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import "../global.css"

const TabsLayout = () => {

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
          backgroundColor:'#121212',
          borderTopWidth: 0,
          height:  60,
          paddingTop: 4,
          paddingBottom: 2,
          marginHorizontal: 50,
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
          title: 'Belanja',
          tabBarIcon: ({color,size}) => <Ionicons name="bag-handle-sharp" size={28} color={color} />
        }}
      />
      <Tabs.Screen 
        name='cart' 
        options={{
          title: 'Keranjang',
          tabBarIcon: ({color,size}) => <Ionicons name="cart" size={32} color={color} />
        }}
      />
      <Tabs.Screen 
        name='profile' 
        options={{
          title: 'Profil',
          tabBarIcon: ({color,size}) => <Ionicons name="person-sharp" size={size} color={color} />
        }}
      />
      <Tabs.Screen 
        name='shop' 
        options={{
          title: 'Jualan',
          tabBarIcon: ({color,size}) => <Ionicons name="storefront" size={30} color={color} />
        }}
      />

    </Tabs>
  )
}

export default TabsLayout
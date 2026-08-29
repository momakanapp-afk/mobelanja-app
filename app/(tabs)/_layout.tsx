import { useAuth } from "@clerk/expo"
import { Ionicons } from "@expo/vector-icons"
import { Redirect, Tabs } from 'expo-router'
import React from 'react'

const TabsLayout = () => {

  const {isSignedIn, isLoaded} = useAuth()

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="../(auth)" />;
  
  return (
    <Tabs>

      <Tabs.Screen 
        name='index' 
        options={{
          title: 'Shop',
          tabBarIcon: ({color,size}) => <Ionicons name="grid" />
        }}
      />
      <Tabs.Screen 
        name='cart' 
        options={{
          title: 'Cart',
          tabBarIcon: ({color,size}) => <Ionicons name="cart" />
        }}
      />
      <Tabs.Screen 
        name='profile' 
        options={{
          title: 'Profil',
          tabBarIcon: ({color,size}) => <Ionicons name="person" />
        }}
      />

    </Tabs>
  )
}

export default TabsLayout
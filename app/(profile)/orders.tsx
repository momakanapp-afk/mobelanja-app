import SafeScreen from '@/components/SafeScreen'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const ordersScreen = () => {
  return (
    <SafeScreen>
      <View className="px-6 py-3 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#ff7f23" />
        </TouchableOpacity>
        <Text className="text-primary text-xl font-bold">Daftar Transaksi</Text>
      </View>
    </SafeScreen>
  )
}

export default ordersScreen
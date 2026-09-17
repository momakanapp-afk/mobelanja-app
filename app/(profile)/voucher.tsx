import SafeScreen from '@/components/SafeScreen'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const VoucherScreen = () => {
  return (
  <SafeScreen> 

    <View className="mt-2 px-6 pb-5 border-b border-surface flex-row items-center">
      <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <Ionicons name="arrow-back" size={28} color="#E3D3CC" />
      </TouchableOpacity>
      <Text className="text-text-primary text-xl font-bold">Kupon Diskon Aktif</Text>
    </View>

    
    
  </SafeScreen>
  )
}

export default VoucherScreen
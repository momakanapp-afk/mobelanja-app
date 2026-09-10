import SafeScreen from '@/components/SafeScreen';
import { Ionicons } from '@expo/vector-icons';
import { Image } from "expo-image";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ShopScreen = () => {
  return (
    <SafeScreen>
        {/* +++++++ HEADER ++++++++++ */}
        <View className="px-6 pb-5 border-b border-surface flex-row items-center">
          <Text className="text-primary text-xl font-bold">Kelola Toko</Text>
        </View>
        <View className="px-6 pb-8">
          <View className="rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="relative">
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={()=>{}}
                >
                  <Image
                    source=""
                    style={{ width: 90, height: 90, borderRadius: 50 }}
                    transition={200}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="absolute w-[35px] h-[35px] -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center border border-surface"
                  activeOpacity={0.5}
                  onPress={()=>{}}
                >
                  <Ionicons name="camera" size={24} color="#121212" />
                </TouchableOpacity>
              </View>

              <View className="flex-1 ml-4"> 
                <Text className="text-text-primary text-xl font-bold mb-1">
                  NAMA_MERCHANT
                </Text>
                <Text className="text-text-secondary text-sm">
                  PIN_MERCHANT
                </Text>
              </View>
            </View>
          </View>
        </View>    
      </SafeScreen>
  )
}

export default ShopScreen
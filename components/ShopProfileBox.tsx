import { FormToko } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";


interface ShopProfileProps {
  datatoko: FormToko | null;
  isLoading: boolean;
}

const ShopProfileBox = ({datatoko,isLoading}:ShopProfileProps) => {

  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color="#fbd502" />
        <Text className="text-text-secondary text-xl mt-4">Sedang memuat data</Text>
      </View>
    );
  }
  
  if (datatoko?.name===undefined) {
    return (
      <View className="flex-row rounded-2xl bg-surface p-4 mx-6 mt-6">
        <Ionicons name="storefront-outline" size={55} color="#B3B3B3" />
        <View className="ml-4">
          <Text className="text-xl text-text-secondary mb-1 font-bold">
            Mau Jualan ?
          </Text>
          <View className="w-[240px]">
            <Text className="text-sm text-text-secondary mb-3 break-words">
              Buka toko kamu sendiri, nikmati fleksibilitas dalam mengelola produk,
              pembayaran dan pengiriman. </Text>
          </View>
          <TouchableOpacity 
            className="bg-primary w-1/2 items-center py-2 rounded-xl"
            activeOpacity={0.7}
            onPress={()=>router.push('/bukatoko')}
          >
            <Text className="text-black text-lg font-bold">Buka Toko</Text> 
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View className="px-6 py-4">
      <View className="rounded-3xl px-6">
        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={()=>{}}
          >
            <Image
              source={datatoko?.imageUrl}
              style={{ width: 100, height: 100, borderRadius: 50 }}
              transition={200}
            />
          </TouchableOpacity>

          <View className="flex-1 ml-4"> 
            <Text className="text-text-primary text-xl font-bold">
              {datatoko?.name}
            </Text>
            <Text className="text-text-secondary text-sm">
              {datatoko?.kotakab} 
            </Text>
            <Text className="text-text-secondary text-sm">
              Sejak {datatoko?.waktu} 
            </Text>
          </View>

        </View>
      </View>
    </View>
  )
  
}

export default ShopProfileBox;
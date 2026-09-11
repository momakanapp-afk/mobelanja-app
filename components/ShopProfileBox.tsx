import { FormToko } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";


interface ShopProfileProps {
  datatoko: FormToko | null;

}

const ShopProfileBox = ({datatoko}:ShopProfileProps) => {

  if (datatoko===null) {
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
    <View className="px-6 pb-8">
      <View className="rounded-3xl p-6">
        <View className="flex-row items-center">
          <View className="relative">
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={()=>{}}
            >
              <Image
                source={datatoko.imageUrl}
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
  )
  
}

export default ShopProfileBox;
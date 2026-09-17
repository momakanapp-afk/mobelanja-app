import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function AddressesHeader() {
  return (
    <View className="px-6 py-3 border-b border-surface flex-row items-center">
      <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
      </TouchableOpacity>
      <Text className="text-text-primary text-xl font-bold">Daftar alamat</Text>
    </View>
  );
}

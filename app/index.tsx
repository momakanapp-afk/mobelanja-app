import { Text, View } from "react-native";
import "./global.css";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-orange-100">
      <Text className="text-xl font-bold text-red-800">
        Welcome to Nativewind!
      </Text>
    </View>
  );
}
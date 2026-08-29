import SafeScreen from '@/components/SafeScreen';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';

interface categories {
  name: string;
  image: number;
}

const CATEGORIES = [
  { name: "Gadget", image: require("@/assets/images/electronics.png") },
  { name: "Fashion", image: require("@/assets/images/fashion.png") },
  { name: "Sports", image: require("@/assets/images/sports.png") },
  { name: "Books", image: require("@/assets/images/books.png") },
];

const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
      marginLeft: 20
    },
    logo: {
      width: 24,
      height: 24,
      marginBottom: 8,
    },
  });

  const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const renderItem = ({ item }:{item:categories}) => (
  <TouchableOpacity
    key={item.name}
    onPress={() => setSelectedCategory(item.name)}
    className={`mr-4 rounded-2xl overflow-hidden items-center justify-center 
      ${selectedCategory === item.name ? "bg-primary" : "bg-surface"}`}
    style = {
      {width:100,height:100,borderRadius:14}
    }
  >
      <Image source={item.image} className="size-12 mb-2" resizeMode="cover" />
      <Text className={`text-lg text-center leading-tight
        ${selectedCategory === item.name ? "text-black font-bold" : "text-white font-normal"}`}
      > {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{
          paddingBottom: 100
        }} 
        showsVerticalScrollIndicator ={false}
      >
        {/* HEADER */}
        <View className="px-6 pb-4 pt-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-text-primary text-3xl font-bold tracking-tight">MoBelanja</Text>
              <Text className="text-text-secondary text-sm mt-1">Toko pilihan anda beserta produknya</Text>
            </View>
            <TouchableOpacity className="bg-surface p-3 rounded-full" activeOpacity={0.7}>
              <Ionicons name="add-outline" size={24} color={"#fff"} />
            </TouchableOpacity>
          </View>
        </View>  

        {/* SEARCH BAR */}
        <View className="bg-surface mb-6 flex-row items-center mx-5 px-5 py-2 rounded-2xl">
          <Ionicons color={"#666"} size={22} name="search" />
          <TextInput
            className="flex-1 ml-3 text-xl text-text-primary"
            placeholder="Pencarian Produk"
            placeholderTextColor={"#666"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.container}>
          <FlatList
            data={CATEGORIES}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
          />
        </View>
        
      </ScrollView>
    </SafeScreen>
  );

}

export default ShopScreen
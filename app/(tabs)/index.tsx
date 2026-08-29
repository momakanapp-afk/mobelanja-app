import SafeScreen from '@/components/SafeScreen';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("@/assets/images/electronics.png") },
  { name: "Fashion", image: require("@/assets/images/fashion.png") },
  { name: "Sports", image: require("@/assets/images/sports.png") },
  { name: "Books", image: require("@/assets/images/books.png") },
];

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
            <TouchableOpacity className="bg-surface/50 p-3 rounded-full" activeOpacity={0.7}>
              <Ionicons name="options-outline" size={22} color={"#fff"} />
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

        {/* CATEGORY FILTER */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.name;
              return (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center ${isSelected ? "bg-primary" : "bg-surface"}`}
                >
                  {category.icon ? (
                    <Ionicons
                      name={category.icon}
                      size={36}
                      color={isSelected ? "#121212" : "#fff"}
                    />
                  ) : (
                    <Image source={category.image} className="size-12" resizeMode="contain" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        
      </ScrollView>
    </SafeScreen>
  )
}

export default ShopScreen
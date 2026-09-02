import ProductsGrid from '@/components/ProductsGrid';
import SafeScreen from '@/components/SafeScreen';
import useDebounce from '@/hooks/useDebounce';
import useProducts from '@/hooks/useProducts';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList, Image,
  StyleSheet, Text,
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
      paddingTop: 2,
      paddingBottom: 25,
      marginLeft: 10
    },
    card: {
      width:100,
      height:100,
      borderRadius:14
    }
  });

const ShopScreen = () => 
{
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: listproduk = [], isLoading, isError, error } = useProducts();

  // Teknik debounce request search
  const debouncedQuery = useDebounce(searchQuery, 700);
  const filteredProducts = useMemo(() => 
  {
    if (!listproduk) return [];

    let filtered = listproduk;

    // filtering by category
    // if (selectedCategory !== "All") {
    //   filtered = filtered.filter((product) => product.category === selectedCategory);
    // }

    // filtering by searh query
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [listproduk, selectedCategory, debouncedQuery]);

  if (isError) {
    console.log(error);
  }

  const renderItem = ({ item }:{item:categories}) => (
  <TouchableOpacity
    key={item.name}
    onPress={() => setSelectedCategory(item.name)}
    className={`mr-4 rounded-2xl overflow-hidden items-center justify-center 
      ${selectedCategory === item.name ? "bg-primary" : "bg-surface"}`}
    style = {styles.card}
  >
      <Image source={item.image} className="size-12 mb-2" resizeMode="cover" />
      <Text className={`text-lg text-center leading-tight
        ${selectedCategory === item.name ? "text-black font-bold" : "text-white font-normal"}`}
      > {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className='flex-1'>
        <View style={styles.container}>
          <FlatList
            data={CATEGORIES}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
  );

  return (
    <SafeScreen>

      {/* HEADER */}
      <View className="px-4 pt-2">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-text-primary text-2xl font-bold tracking-tight">MoBelanja</Text>
          </View>
          <TouchableOpacity 
            className="bg-surface p-2 rounded-full" activeOpacity={0.7}
            onPress={()=>{}}
          >
            <Ionicons name="add-outline" size={24} color={"#fff"} />
          </TouchableOpacity>
        </View>
      </View>  

      {/* SEARCH BAR */}
      <View className="bg-surface mb-4 flex-row items-center mx-2 px-4 rounded-2xl">
        <Ionicons color={"#666"} size={22} name="search" />
        <TextInput
          className="flex-1 ml-3 text-xl text-text-primary"
          placeholder="Pencarian"
          placeholderTextColor={"#666"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View>
        <ProductsGrid 
          products={filteredProducts}
          isLoading={isLoading}
          isError = {isError}
          header={renderHeader}
        />
      </View>


    </SafeScreen>
  );

} // End ShopScreen

export default ShopScreen
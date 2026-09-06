import ProductsGrid from '@/components/ProductsGrid';
import SafeScreen from '@/components/SafeScreen';
import useDebounce from '@/hooks/useDebounce';
import useProducts from '@/hooks/useProducts';
import { useApi } from '@/lib/api';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList, Image,
  StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import { ToastContainer } from 'rn-toastify';


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

const MarketScreen = () => 
{
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayProd, setDisplayProd] = useState<Product[]>();
  const { data: listproduk = [], isLoading, isError, error } = useProducts();

  // Teknik debounce request search
  const debouncedQuery = useDebounce(searchQuery, 700);

  // Init all product
    useEffect (() => {
      if (!isLoading) {
        setDisplayProd(listproduk);
      }
    },[isLoading])

  // Filter first, lanjut ke backend jika filter kosong
  useEffect (() => {
    let filtered = listproduk;

    if (debouncedQuery.trim() !== '') 
    {
      // FILTER DULU (Manfaatkan cache)
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      // Panggil server jika hasil filter kosong
      if (filtered.length===0) {
        searchFromBackend(debouncedQuery);
        console.log("POST search:",debouncedQuery)
      }
      else {
        setDisplayProd(filtered);
      }
    }
  }, [debouncedQuery])

  const api = useApi(); 
  
  const searchFromBackend = async (searchq:string) => 
  {
    // Hanya ambil data dari respon axios
    const {data} = await api.post<Product[]>("/products.php", {
      searchq: searchq,
    });
    setDisplayProd(data);
  }

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

  const clearText = () => {
    setSearchQuery('');
  }

  return (
    <SafeScreen>

      {/* HEADER */}
      <View className="px-4 pt-2">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-primary text-2xl font-bold tracking-tight">MoBelanja</Text>
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
        <Ionicons color={"#ff7f23"} size={22} name="search" />
        <TextInput
          className="flex-1 ml-3 text-xl text-text-primary"
          placeholder="Ketik untuk mencari"
          placeholderTextColor={"#666"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearText} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={28} color="#ff7f23" />
          </TouchableOpacity>
        )}
      </View>

      <View>
        <ProductsGrid 
          products={displayProd ?? []}
          isLoading={isLoading}
          isError = {isError}
          header={renderHeader}
        />
      </View>

      <ToastContainer maxVisible={3} />


    </SafeScreen>
  );

} // End MarketScreen

export default MarketScreen
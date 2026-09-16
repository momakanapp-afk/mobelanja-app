import ProductsGrid from '@/components/ProductsGrid';
import SafeScreen from '@/components/SafeScreen';
import useCart from '@/hooks/useCart';
import useDebounce from '@/hooks/useDebounce';
import useProducts from '@/hooks/useProducts';
import { useApi } from '@/lib/api';
import { LsToko, Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList, Image,
  Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import useToast, { ToastContainer } from 'rn-toastify';

const MarketScreen = () => 
{
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayProd, setDisplayProd] = useState<Product[]>();
  const { data: dataprod, isLoading, isError, error } = useProducts();

  // Init all product
  useEffect (() => {
    if (dataprod?.plist) {
      setDisplayProd(dataprod.plist);
      setSelectedCategory("All");
    }
  },[dataprod])

  // Teknik debounce request search
  const debouncedQuery = useDebounce(searchQuery, 1000);

 // Filter first, lanjut ke backend jika filter kosong
  useEffect (() => {
    if (dataprod?.plist===undefined) return;
    let filtered = dataprod.plist;
    if (debouncedQuery.trim() !== '') 
    {
      // FILTER DULU (Manfaatkan cache)
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      // Panggil server jika hasil filter kosong
      if (filtered.length===0) {
        searchFromBackend(debouncedQuery);
      }
      else {
        setDisplayProd(filtered);
      }
    }
  }, [debouncedQuery]);

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
  
  // Parameter adalah masing2 item dalam array list {item}
  const renderToko = ({item}:{item:LsToko}) => (
  <TouchableOpacity
    key={item._id}
    onPress={() => setSelectedCategory(item._id)}
  >
    <View className={`mr-4 p-2 items-center rounded-xl justify-center border-2
      ${selectedCategory===item._id ? "border-primary bg-primary/25" : 
        "border-surface bg-surface"}`}
    >
      <Image source={{uri:item.image}} className="size-20 mb-1 rounded-full" resizeMode="cover" />
      <Text className={`text-sm text-center leading-tight 
       ${selectedCategory===item._id ? 'text-[#faa96f]' : 'text-text-primary' } `}
      > {item.name}
      </Text> 
    </View>
  </TouchableOpacity> 
  );

  const renderHeader = () => (
    <View className='flex-row'>
      <TouchableOpacity 
      className='items-center mr-3 mt-4 p-2'
      onPress={() => setSelectedCategory('All')}
      >
        <Ionicons name='grid-outline' size={45} 
        color={selectedCategory==='All' ? '#ff7f23' : '#E3D3CC'} />
        <Text className={`${selectedCategory==='All' ? 
          'text-primary' : 'text-text-primary'} text-sm mt-2`}>
          Semua Toko
        </Text>
      </TouchableOpacity>
      <View className='flex-1'>
        <FlatList
          data={dataprod?.tlist}
          renderItem={renderToko}
          keyExtractor={(item) => item._id}
          horizontal={true} 
          showsHorizontalScrollIndicator={false}
          contentContainerClassName='mb-2'
        />
      </View>
    </View>
  );

  const clearText = () => {
    setSearchQuery('');
  }

  // ADD TO CART HANDLE
  const toast = useToast();
  const masuKeranjang = (barang:string) => {
    toast.success('Telah ditambahkan ke keranjang belanja', {
      title: barang,
      duration: 3500,
    });
  };
  const { isAddingToCart, addToCart } = useCart();
  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId },
      {
        onSuccess: () =>  masuKeranjang(productName),
        onError: (error: any) => {
          toast.error("Terjadi error saat menambahkan barang", {
            title: "Error",
            duration: 3500,
          });
        },
      }
    );
  };


  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="px-4 pt-2">
        <View className="flex-row justify-center">
          <Image 
            source={require("../../assets/images/ico_mo_oren.png")} 
            className='size-11 mr-3' 
            resizeMode="contain"
          />
          <View>
            <Text className="text-primary text-xl font-bold mt-2">Belanja</Text>
          </View>
          
          {/* <TouchableOpacity 
            className="bg-surface p-2 rounded-full" activeOpacity={0.7}
            onPress={()=>{}}
          >
            <Ionicons name="add-outline" size={24} color={"#fff"} />
          </TouchableOpacity> */}
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

      <ProductsGrid 
        products={displayProd ?? []}
        isLoading={isLoading}
        isError = {isError} 
        header={renderHeader}
        handleAddToCart={handleAddToCart}
        isAddingToCart={isAddingToCart}
      />

      <ToastContainer maxVisible={3} />


    </SafeScreen>
  );

} // End MarketScreen

export default MarketScreen
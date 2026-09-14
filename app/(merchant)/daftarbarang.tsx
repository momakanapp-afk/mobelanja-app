import SafeScreen from '@/components/SafeScreen';
import InputProductModal from '@/components/ShopProductModal';
import { useMerchant } from '@/hooks/useMerchant';
import { useMerchantProducts } from '@/hooks/useMerchantProducts';
import { formatRupiah, generateId } from "@/lib/utils";
import { M_Produk, tipeListImg } from '@/types';
import { Entypo } from '@expo/vector-icons';
import { Image } from "expo-image";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import useToast, { ToastContainer } from 'rn-toastify';

const ScreenDaftarBarang = () => {
  
  const [mytoastMsg,setMytoastmsg] = useState('');
  const [searchQuery,setSearchQuery] = useState('');
  const [mytoastVisible,setMytoastvisible] = useState(false);
  const [itemSelected,setItemSelected] = useState('');
  const {merchantData} = useMerchant();
  const {MProducts,waitData,hapusProduk,tungguHapus, 
    addUpdateProduk,tungguAddUpdate} = useMerchantProducts();
  const [modalVisible,setModalVisible] = useState(false);
  const clearText = () => {
    setSearchQuery('');
  }
  const emptyForm = {
    _id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    images: [],
  }
  const[formBarang,setFormBarang] = useState<M_Produk>(emptyForm);
  const [displayNominal,setDisplayNom] = useState('');
  const [listImgProd,setListImgProd] = useState<tipeListImg[]>([]);

  // Single Source of Truth : Fungsi setState harus di lokasi tempat dibuat pertama 
  const addImageToList = (imageurl:string) => {
    const itembaru = {
      id:'img-'+ generateId(),
      imgurl: imageurl
    }
    setListImgProd((prev)=>[...prev,itembaru]);
  }
  const handleInsertDisplay = (text:string) => {
    setDisplayNom(text);
  }
  const handleHapusGambar = (idImg:string) => {
    setListImgProd((prev) => prev.filter((item) => item.id !== idImg));
  }
  const handleHapusList = (productId: string, productName: string) => {
    Alert.alert("Hapus", `Hapus ${productName} dari daftar ?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => hapusProduk({prodId:productId}),
      },
    ]);
  }
  const onCloseModal = () => {
    setModalVisible(false);
    setListImgProd([]);
  }
  // MODAL TAMBAH ITEM
  const inputNewItem = ()=> {
    setListImgProd([]);
    setDisplayNom('');
    setFormBarang(emptyForm);
    setModalVisible(true);
  }
  // MODAL EDIT ITEM
  const inputEditItem = (item:M_Produk) => {
    setFormBarang({
      _id: item._id,
      name: item.name,
      description: item.description,
      images: item.images,
      price: item.price,
      category: item.category
    });
    item.images.forEach((item,idx)=>{
      setListImgProd((prev)=>(
        [...prev,{id:'img-'+generateId(),imgurl:item}]
      ));
    })
    setDisplayNom(formatRupiah(item.price).replace('Rp.',''));
    setModalVisible(true);
  }

  const toast = useToast();
  
  // SAVE FORM MODAL 
  const handleSaveForm = (imgUpl:string[]) => { 
    // Jika id toko tidak ditemukan, STOP
    if (merchantData?._id===undefined) return;
    // Save data produk bersama id toko
    addUpdateProduk({
      dataprod:formBarang,
      idToko:merchantData._id,
      imgUploaded: imgUpl
    },
      {
        onSuccess: ()=>{
          setModalVisible(false);
          toast.success('Item baru telah ditambahkan', {
            title: 'Item Baru Disimpan',
            duration: 3500,
          });
        }
      }
    );
  }

  function NoProductsFound() {
    return (
      <View className="mt-10 py-20 items-center justify-center">
        <Entypo color={"#B3B3B3"} size={60} name="shopping-bag" />
        <Text className="text-text-secondary text-lg font-semibold mt-4">
          Daftar Kosong
        </Text>
        <Text className="text-text-secondary text-base mt-2">Tambahkan produk pertama untuk dijual</Text>
      </View>
    );
  }

  // Parameter "tiap item" dari MProducts (Flatlist data) bertipe definisi M_Produk
  const renderProduk = ({item}:{item:M_Produk}) => {
  return (
    <TouchableOpacity
      className={`mx-6 mb-3 p-3 border-2 rounded-2xl relative
        ${itemSelected===item._id ? 'border-primary bg-[#3d1e08]' : 'border-surface bg-surface '}`}
      activeOpacity={0.7}
      onPressIn={()=>{setItemSelected(item._id)}}
    >
      {/* MAIN WRAPPER */}
      <View className='flex-row'>
        <Image 
          style={{ width: 80, height: 80, borderRadius: 40 }}
          transition={200}
          source={item.images[0]} 
        />
        {/* DETAIL ITEM */}
        <View className='flex-1 px-2 ml-2'>
          <Text className='text-text-primary text-base font-bold leading-tight'>
            {item.name}
          </Text>
          <Text className='text-text-primary text-lg'>{formatRupiah(item.price)}</Text>
        </View>
        {/* TOMBOL EDIT & HAPUS */}
        {itemSelected===item._id ? (
          <View className='flex-row mx-2 absolute bottom-0 right-0'>
            <Pressable className='flex-row px-3 py-2 bg-[#b40f0f] active:bg-[#fd1111] rounded-xl mr-2'
              onPress={()=>{handleHapusList(item._id,item.name)}}
              disabled={tungguHapus===item._id}
            >
              <Entypo name='trash' size={28} color='#fff' />
            </Pressable>
            <Pressable className='flex-row px-3 py-2 bg-[#00854b] rounded-xl active:bg-[#02b96a]' 
              onPress={()=>inputEditItem(item)} 
              disabled={modalVisible}
            >
              <Entypo name='new-message' size={28} color='#fff' />
            </Pressable>
          </View>
        ) : ""}
      </View>
      
    </TouchableOpacity>
  )}

  if (waitData) {
    return (
      <SafeScreen>
        <View className="mt-20 py-20 items-center justify-center">
          <ActivityIndicator size="large" color="#fbd502" />
          <Text className="text-text-secondary text-xl mt-4">Memuat Daftar Barang</Text>
        </View>
      </SafeScreen>
    )
  }
  
  return (
    <SafeScreen>
      <ToastContainer maxVisible={3} />
      <View className="flex-row px-6 py-3 items-center">
        {/* BACK ARROW */}
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Entypo name="chevron-left" size={26} color="#ff7f23" />
        </TouchableOpacity>
        {/* TITLE */}
        <Text className="text-primary text-xl font-bold">
          Daftar Barang
        </Text>
      </View>

      {/* SEARCH BAR */}
      <View className="bg-surface mb-3 flex-row items-center 
        mx-6 px-4 mt-1 rounded-2xl border-2 border-[#2f2f2f]">
        <Entypo color={"#ff7f23"} size={22} name="magnifying-glass" />
        <TextInput
          className="flex-1 ml-3 text-xl text-text-primary"
          placeholder="Pencarian"
          placeholderTextColor={"#666"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearText} activeOpacity={0.7}>
            <Entypo name="circle-with-cross" size={28} color="#ff7f23" />
          </TouchableOpacity>
        )}
      </View>

    {/* TAMBAH ITEM BARU */}
    <Pressable
      className="border-2 border-green-700 bg-green-700/30 
      active:bg-[#16a34a] rounded-2xl items-center mb-3 mx-6"
      onPress={inputNewItem}
    >
      <View className="flex-row items-center pr-5">
        <View className="rounded-full w-16 h-[48px] items-center justify-center mr-4">
          <Entypo name="plus" size={26} color="#dcfce7" />
        </View>
        <View className="flex-1 mt-1">
          <Text className="text-green-100 font-bold text-base mb-1">
            Tambah Item Baru
          </Text>
        </View>
        <Entypo name="chevron-right" size={20} color="#dcfce7" />
      </View>
    </Pressable>

    {/* SCROLL LIST BARANG */}
    <FlatList 
      data={MProducts}
      keyExtractor={(item)=>item._id}
      renderItem={renderProduk}
      ListEmptyComponent={NoProductsFound}
      contentContainerStyle={{paddingBottom:200}}
    />

    {/* MODAL INPUT BARANG */}
    <InputProductModal 
      FormProduct={formBarang}
      onFormChange={setFormBarang}
      ListImg={listImgProd}
      addListImg={addImageToList}
      visible={modalVisible}
      onClose={onCloseModal}
      stateDspPrice={displayNominal}
      setDisplayNom={handleInsertDisplay}
      hapusGambarList={handleHapusGambar}
      onFormSave={handleSaveForm}
      waitFormSave={tungguAddUpdate}
    />

      
    </SafeScreen>
  )
}

export default ScreenDaftarBarang
import { MyToast } from '@/components/MyToast';
import { useCloudinaryUpload } from '@/hooks/useCloudinary';
import { useImageProcess } from '@/hooks/useImageProcess';
import useProfileImage from '@/hooks/useProfileImage';
import { sleepTimeout } from '@/lib/utils';
import { M_Produk, tipeListImg } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Modal, Platform,
  Pressable, ScrollView, Text, TextInput, TouchableOpacity, useWindowDimensions, View
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import useToast, { ToastContainer } from 'rn-toastify';


export interface PropInputProdModal {
  FormProduct: M_Produk;
  onFormChange: (form:M_Produk)=>void;
  ListImg: tipeListImg[] | [];
  addListImg: (imgurl:string)=>void;
  hapusGambarList: (idImg:string)=>void;
  visible: boolean;
  onClose: ()=>void;
  stateDspPrice: string;
  setDisplayNom: (text:string)=>void
  onFormSave: (imgUploaded:string[])=>void;
  waitFormSave: boolean;
}

// +++++++ MAIN EXPORT +++++++ //
const InputProductModal = (
  {FormProduct,ListImg,visible,onClose,onFormChange,setDisplayNom,
    addListImg,stateDspPrice,hapusGambarList,onFormSave,waitFormSave
  }:PropInputProdModal
) => {
  const [mytoastMsg,setMytoastmsg] = useState('');
  const [mytoastVisible,setMytoastvisible] = useState(false);
  const { width: deviceWidth } = useWindowDimensions();

  const listImgEmpty = ()=>{
    // Auto center live device width - padding right (pr-6)
    const devWi = Number(deviceWidth.toFixed(0)) - 24;
    return (
      <View className={`py-10 items-center justify-center`} style={{width:devWi}}>
        <Ionicons color={"#B3B3B3"} size={50} name="image-outline" />
        <Text className="text-text-secondary w-[80%] leading-tight
        text-center text-base font-semibold mt-1">
          Belum ada gambar produk
        </Text>
      </View>
    )
  }
  const renderImgProd = ({item}:{item:tipeListImg}) => {
    return (
    <View className='relative mr-3'>
      <Image 
      source={item.imgurl} 
      transition={200} 
      style = {{height:130, aspectRatio: 4/3, borderRadius:12}}
      contentFit='cover' 
    />
    <TouchableOpacity 
    onPress={()=>{hapusGambarList(item.id)}}
    className='absolute items-center left-2 bottom-2 rounded-xl bg-red-600'>
      <Ionicons name='trash' size={30} color="#E3D3CC" className='m-2' />
    </TouchableOpacity>
    </View>)
  }
  const toast = useToast();

  const handleDisplayNominal = (text:string) => {
    const cleanNumber = text.replace(/\D/g, '');
    // Raw Value
    onFormChange({ ...FormProduct, price: Number(cleanNumber) })
    // Format Value
    const formatted = cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setDisplayNom(formatted);
  }
  
  const addImageToList = (urlImage:string) => {
    addListImg(urlImage);
  }
  const flatListImgRef = useRef<FlatList<any>>(null);
  const scrollToIndex = (idx:number) => {
    if (idx < 1) return;
    flatListImgRef.current?.scrollToIndex({
      index: idx,
      animated: true,
    });
  };
  const {processImage} = useImageProcess();
  const {imagePicked,takePhoto,pickImageFromGallery,resetImagePicked} = useProfileImage();
  const handleImagePick = (mode:'camera'|'galeri')=> {
    // Cek jumlah MAX Sebelum eksekusi picker
    const totalImg = ListImg.length;
    if (totalImg===4) {
      toast.error('Jumlah Max 4 gambar telah dipakai', {
        title: 'Gambar Max 4',
        duration: 3500,
      });
      return;
    }
    // Eksekusi 
    if (mode==='camera') {
      takePhoto();
    } else {
      pickImageFromGallery();
    }
  }
  // HANDLE IMAGE PICKED
  useEffect(()=>{
    if (imagePicked===null) return;
    // Jeda resize 1 detik agar toast terlihat
    setMytoastvisible(true);
    setMytoastmsg('Memproses ukuran gambar...');
  
    // IIFE Async
    (async () => {
      await sleepTimeout(1000); // jeda 1 detik
      const ImgResized = await processImage(imagePicked, {
        maxDimension: 1280, compress: 0.8 }); 
      addImageToList(ImgResized.uri);
      resetImagePicked();
      setMytoastmsg('Gambar telah ditambahkan');
      setTimeout(function(){setMytoastvisible(false)},1000);
      scrollToIndex(ListImg.length-1);
    })();
  },[imagePicked])

  const { uploadToCloudinary, progress, statusText, isUploading} = useCloudinaryUpload();
  
  const imgToUpload = useRef<string[]>([]);
  const imgUploaded = useRef<string[]>([]);

  // ++++++ SAVE ITEM
  const handleSaveItem = async () => 
  {
    // Validasi jika image masih kosong
    if (ListImg.length===0) {
      toast.error('Upload gambar minimal 1 untuk thumbnail', {
        title: 'Belum ada Foto',
        duration: 3500,
      });
      return;
    }
    // Nama dan harga kosong
    if (FormProduct.name==='' || FormProduct.price===0) {
      toast.error('Nama dan Harga tidak boleh kosong', {
        title: 'Nama/Harga harus diisi',
        duration: 3500,
      });
      return;
    }
    // Kosongkan filter upload
    imgUploaded.current = [];
    const imagesOri = FormProduct.images;
    // Cek image yang belum diupload dari ListImg
    ListImg.forEach((item,idx)=>{
      if (imagesOri.includes(item.imgurl)===false) {
        imgToUpload.current.push(item.imgurl);
      }
    })
    // Toast Save
    setMytoastvisible(true);
    setMytoastmsg("Proses menyimpan");
    sleepTimeout(1000); // jeda 1 detik

    // Upload gambar yang terjaring 
    if (imgToUpload.current.length > 0) {

      // Upload batch (hasil upload disimpan ke imgUploaded)
      await uploadBatch(imgToUpload.current);
    } 

    // Post data ke backend 
    setMytoastmsg("Mengirim data ke server");
    sleepTimeout(500);
    setMytoastvisible(false);
    onFormSave(imgUploaded.current);
  }

  async function uploadBatch(list:string[]) {
    const totalGambar = list.length;
    let idx = 0;
    for (const item of list) {
      idx++;
      setMytoastmsg(`Upload ${idx} dari ${totalGambar} gambar`);
      sleepTimeout(500);
      const respon = await uploadToCloudinary(item,'produk');
      // Tampung hasil upload 
      if (respon!==null) imgUploaded.current.push(respon.secure_url);
    }
  }

  return (
  <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{flex:1}}
  >
    <View className='flex-1 bg-background'>

      {/* HEADER */}
      <View className="px-6 py-5 border-b border-surface flex-row 
      items-center justify-between">
        <Text className="text-primary text-xl font-bold">
          Input Barang
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color="#ff7f23" />
        </TouchableOpacity>
      </View> 

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* PRODUCT IMAGE WRAPPER */}
        <View className='mb-4'>
          {/* IMAGE LIST */}
          <View className='flex-1'>
            <FlatList 
              ref={flatListImgRef}
              data={ListImg}
              keyExtractor={(item)=>item.id}
              renderItem={renderImgProd}
              ListEmptyComponent={listImgEmpty}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName='mx-5 mt-4 pr-6 rounded-2xl'
            />
          </View>
          {/* WRAPPER DEKORASI + TOMBOL */}
          <View className='mt-2 items-center'>
            {/*< GESER >*/}
            <View className='flex-row my-3'>
              <Ionicons name='chevron-back' size={16} color='#E3D3CC' />
              <Text className='mx-4 text-text-primary text-base'>
                Tambah foto produk (max 4)
              </Text>
              <Ionicons name='chevron-forward' size={16} color='#E3D3CC' />
            </View>
            {/* TOMBOL GROUP */}
            <View className='flex-row justify-between'>
              {/* TOMBOL GALERI */}
              <Pressable
                onPress={()=>{handleImagePick('galeri')}}
                className="border-2 border-sky-800 bg-cyan-950 
                active:bg-cyan-800 px-5 py-2 rounded-xl items-center 
                justify-center flex-row mr-3"
              >
                <Ionicons name="images-outline" size={26} color="#E3D3CC" />
                <Text className='text-text-primary ml-2'>Galeri</Text>
              </Pressable>
              {/* TOMBOL CAMERA */}
              <Pressable
                onPress={()=>{handleImagePick('camera')}}
                className="border-2 border-red-800 bg-red-950 
                active:bg-red-800 px-3 py-2 rounded-xl items-center 
                justify-center flex-row"
              >
                <Ionicons name="camera-outline" size={26} color="#E3D3CC" />
                <Text className='text-text-primary ml-2'>Kamera</Text>
              </Pressable>
            </View>
          </View>
        </View>
        
        {/* BOX INPUT FORM */}
        <View className='p-4 mx-3'>
          {/* NAMA Produk */}
          <View className="mb-5">
            <Text className="text-text-primary font-semibold mb-2">
              Nama Produk
            </Text>
            <TextInput
              className="bg-surface text-text-primary p-3
              rounded-2xl h-[80px] text-lg"
              placeholder = "Isikan nama produk"
              placeholderTextColor="#666"
              value={FormProduct.name}
              multiline={true}
              numberOfLines={2}
              style = {{textAlignVertical:"top"}}
              onChangeText={(text) => onFormChange({ ...FormProduct, name: text })}
            />
          </View>

          {/* DESKRIPSI */}
          <View className="mb-5">
            <Text className="text-text-primary font-semibold mb-2">
              Deskripsi Produk
            </Text>
            <TextInput
              className="bg-surface text-text-primary h-[200px] p-4 
              rounded-2xl text-lg"
              placeholder="Deskripsikan produk anda"
              placeholderTextColor="#666"
              value={FormProduct.description}
              multiline={true}
              numberOfLines={7}
              style = {{textAlignVertical:"top"}}
              onChangeText={(text) => onFormChange({ ...FormProduct, description: text })}
            />
          </View>

          {/* HARGA PRODUK */}
          <View className="mb-5">
            <Text className="text-text-primary font-semibold mb-2">
              Harga Produk
            </Text>
            <View className='bg-surface rounded-2xl flex-row '>
              <Text className='text-xl text-text-primary 
              ml-[14px] mt-[14px]'>Rp.</Text>
              <TextInput
                className=" text-text-primary ml-7 text-xl w-[90%] h-[55px]"
                placeholder="Input harga produk"
                placeholderTextColor="#666"
                value={stateDspPrice}
                keyboardType="numeric"
                onChangeText={handleDisplayNominal}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-primary rounded-2xl py-5 items-center"
            activeOpacity={0.8}
            onPress={handleSaveItem}
            disabled={waitFormSave}
          >
            { waitFormSave ? (
              <View className='flex-row'>
                <ActivityIndicator size="small" color="#121212" />
                <Text className="text-background font-bold text-lg ml-4">
                  Menyimpan ke server
                </Text>
              </View>
            ) : (
              <Text className="text-background font-bold text-lg">
                Simpan Data
              </Text>
            )}
          </TouchableOpacity>

          
        </View>
      </ScrollView>
      <MyToast  
        message={mytoastMsg}
        isVisible={mytoastVisible}
        onHide={()=>{setMytoastvisible(false)}}
      />
      <ToastContainer maxVisible={3} />
    </View>
  </KeyboardAvoidingView>
  </Modal>
  
  )
}

export default InputProductModal
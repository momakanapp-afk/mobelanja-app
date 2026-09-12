import { MyToast } from '@/components/MyToast'
import SafeScreen from '@/components/SafeScreen'
import { useCloudinaryUpload } from '@/hooks/useCloudinary'
import { useGetMyGeolocation } from '@/hooks/useGetMyGeolocation'
import { useImageProcess } from '@/hooks/useImageProcess'
import { useMerchant } from '@/hooks/useMerchant'
import useProfileImage from '@/hooks/useProfileImage'
import { FormToko } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import { Image } from "expo-image"
import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import useToast, { ToastContainer } from 'rn-toastify'

const screenBukaToko = () => {

  // Upload Hooks 
  const { uploadToCloudinary, statusText, isUploading} =
    useCloudinaryUpload();
  const {merchantData,saveMerchant} = useMerchant();
  const [mytoastMsg,setMytoastmsg] = useState('');
  const [mytoastVisible,setMytoastvisible] = useState(false);
  const {imagePicked,takePhoto,pickImageFromGallery,resetImagePicked} = 
    useProfileImage();
  const {processImage} = useImageProcess();
  const [tokoForm,setTokoForm] = 
  useState<Omit<FormToko,"imageUrl"|"waktu"|"_id">>({
    name:"",
    desc:"",
    alamat: "",
    kotakab: "",
    kodepos: "",
    kontak: "",
    geolokasi: "",
  })
  const toast = useToast();
  const urlUploaded = useRef('');
  const [logoToko, setLogoToko] = useState('');

  // HANDLE SAVE DATA TO SERVER
  const handleSave = async ()=>{
    if (!tokoForm.name || !tokoForm.kotakab) {
      toast.error('Nama Toko dan Kota harus diisi', {
        title: 'Isi Nama dan Kota',
        duration: 3500,
      });
      return;
    }
    if (logoToko==='') {
        toast.error('Pilih dulu gambar / logo toko anda', {
          title: 'Pilih gambar',
          duration: 3500,
        });
      return;
    }
    setMytoastvisible(true);

    // Cek dalam mode edit gambar direplace / tidak
    if (imagePicked!==null) {
      setMytoastmsg('Upload gambar');
      // Resize Dimension
      const ImgResized = await processImage(logoToko, {
        maxDimension: 1920,
        compress: 0.8,
      }); 
      // UPLOAD
      const uploadRes = await uploadToCloudinary(ImgResized.uri);
      if (uploadRes?.secure_url!==undefined) {
        urlUploaded.current = uploadRes.secure_url;
      }
      else { 
        setMytoastvisible(false);
        toast.error('Upload foto gagal, coba kembali', {
          title: 'Error Upload',
          duration: 3500,
        });
        return;
      }
    }

    // SAVE TO BACKEND
    const actSave = merchantData?.name===undefined ? 'newForm' : 'editForm';
    setMytoastmsg('Menyimpan data di server');
    saveMerchant(
    {
      act:actSave,
      mdata:tokoForm,
      imgurl:urlUploaded.current
    },
    {
      onSuccess: ()=>{
        setMytoastmsg('Data berhasil disimpan');
        setTimeout(()=>setMytoastvisible(false),1500);
      }
    });
  }

  // Interaktif status upload 
  useEffect(()=>{
    if (statusText!=='') {
      setMytoastmsg(statusText);
    }
  },[statusText])

  // HANDLE GEOLOKASI 
  const {loadLoc,getMyGeolocation,akurasi,hasilGeoLokasi} = useGetMyGeolocation();
  useEffect(()=>{
    if (loadLoc) {
      setMytoastvisible(true);
      setMytoastmsg('Mengambil geolokasi anda');
    }
    else {
      setMytoastmsg(`Akurasi ${akurasi} m ulangi jika kurang akurat`);
      setTimeout(()=>setMytoastvisible(false),3000);
      setTokoForm({ ...tokoForm, geolokasi: hasilGeoLokasi });
    }
    
  },[loadLoc]);

  // HANDLE imagePicked
  useEffect(()=>{
    if (imagePicked!==null) {
      setLogoToko(imagePicked)
    }
  },[imagePicked])

  // HANDLE EDIT DATA
  useEffect(()=>{
    if (merchantData===null) {
      return
    }
    setTokoForm({
      name: merchantData.name,
      desc: merchantData.desc,
      alamat: merchantData.alamat,
      kotakab: merchantData.kotakab,
      kodepos: merchantData.kodepos,
      kontak: merchantData.kontak,
      geolokasi: merchantData.geolokasi,
    })
    setLogoToko(merchantData.imageUrl)
  },[merchantData])
  
  return (
  <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex:1}}
    >
    <SafeScreen>
      <MyToast  
        message={mytoastMsg}
        isVisible={mytoastVisible}
        onHide={()=>{setMytoastvisible(false)}}
      />
      <View className="px-6 py-3 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={26} color="#ff7f23" />
        </TouchableOpacity>
        <Text className="text-primary text-xl font-bold">
          {merchantData===null ? "Buka Toko" : "Update Data Toko"}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
      <View className='items-center'>
        <View className='w-1/2 items-center py-8'>
          <Text className='text-text-secondary mb-2'>Pilih Logo/Gambar Toko</Text>
          {/* +++ IMAGE INIT & IMAGE PICKED */}
          {logoToko==='' ?
            (<Ionicons name='image-outline' size={100} color="#B3B3B3" />)
          :
            (<Image
                source={logoToko}
                style={{ width: 150, height: 150, borderRadius: 75 }}
                transition={200}
            />)}
          <Text className='text-text-secondary text-center mb-3'>
            Sebaiknya gunakan gambar dengan rasio 1:1
          </Text>
          {/* +++ TOMBOL GALERI & CAMERA */}
          <View className='flex-row justify-between'>
            <Pressable
              onPress={pickImageFromGallery}
              className="border-2 border-sky-800 bg-cyan-950 
              active:bg-cyan-800 px-5 py-2 rounded-xl items-center 
              justify-center flex-row mr-3"
            >
              <Ionicons name="images-outline" size={26} color="#E3D3CC" />
              <Text className='text-text-primary ml-2'>Galeri</Text>
            </Pressable>
            <Pressable
              onPress={takePhoto}
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

      <View className='p-4'>

        {/* NAMA TOKO */}
        <View className="mb-5">
          <Text className="text-text-primary font-semibold mb-2">
            Nama Toko
          </Text>
          <TextInput
            className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
            placeholder="Isikan nama toko"
            placeholderTextColor="#666"
            value={tokoForm.name}
            onChangeText={(text) => setTokoForm({ ...tokoForm, name: text })}
          />
        </View>

        {/* DESKRIPSI TOKO */}
        <View className="mb-5">
          <Text className="text-text-primary font-semibold mb-2">
            Deskripsi
          </Text>
          <TextInput
            className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
            placeholder="Deskripsikan toko anda"
            placeholderTextColor="#666"
            value={tokoForm.desc}
            multiline={true}
            numberOfLines={3}
            onChangeText={(text) => setTokoForm({ ...tokoForm, desc: text })}
          />
        </View>

        {/* ALAMAT */}
        <View className="mb-5">
          <Text className="text-text-primary font-semibold mb-2">
            Alamat Toko
          </Text>
          <TextInput
            className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
            placeholder="Detil alamat toko"
            placeholderTextColor="#666"
            value={tokoForm.alamat}
            multiline={true}
            numberOfLines={2}
            onChangeText={(text) => setTokoForm({ ...tokoForm, alamat: text })}
          />
        </View>

        {/* KOTA KABUPATEN */}
        <View className="mb-5">
          <Text className="text-text-primary font-semibold mb-2">
            Kota Kabupaten
          </Text>
          <TextInput
            className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
            placeholder="Kota/kabupaten dari alamat toko"
            placeholderTextColor="#666"
            value={tokoForm.kotakab}
            onChangeText={(text) => setTokoForm({ ...tokoForm, kotakab: text })}
          />
        </View>

        {/* KODEPOS */}
        <View className="mb-5">
          <Text className="text-text-primary font-semibold mb-2">
            Kode Pos
          </Text>
          <TextInput
            className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
            placeholder="Kode Pos alamat"
            placeholderTextColor="#666"
            value={tokoForm.kodepos}
            keyboardType="numeric"
            onChangeText={(text) => setTokoForm({ ...tokoForm, kodepos: text })}
          />
        </View>

        {/* NOMOR KONTAK */}
        <View className="mb-5">
          <Text className="text-text-primary font-semibold mb-2">
            Kontak Telp, Whatsapp
          </Text>
          <TextInput
            className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
            placeholder="Nomor kontak yang bisa dihubungi"
            placeholderTextColor="#666"
            value={tokoForm.kontak}
            keyboardType="numeric"
            onChangeText={(text) => setTokoForm({ ...tokoForm, kontak: text })}
          />
        </View>

        {/* GEOLOKASI */}
        <View className="mb-3">
          <Text className="text-text-primary font-semibold mb-2">
            Geolokasi Toko (copy paste)
          </Text>
          <TextInput
            className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
            placeholder="contoh: -7.6015835537, 110.9682985)"
            placeholderTextColor="#666"
            value={tokoForm.geolokasi}
            keyboardType="numeric"
            onChangeText={(text) => setTokoForm({ ...tokoForm, geolokasi: text })}        />
        </View>
        <Pressable
          onPress={getMyGeolocation}
          className="border-2 border-sky-700 bg-sky-900 active:bg-sky-700 
          px-5 py-1 rounded-xl items-center justify-center flex-row"
        >
          <Ionicons name="locate-sharp" size={23} color="#FFFFFF" />
          <Text className="text-white font-semibold text-base ml-3">
            Gunakan lokasi saya saat ini
          </Text>
        </Pressable>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          className="bg-primary rounded-2xl py-5 mt-7 items-center"
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={mytoastVisible}
        >
          {mytoastVisible ? (
            <View className='flex-row'>
              <ActivityIndicator size="small" color="#121212" />
              <Text className="text-background font-bold text-lg ml-3">
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
      <ToastContainer  maxVisible={3} />
    </SafeScreen>
  </KeyboardAvoidingView>
  )
}

export default screenBukaToko
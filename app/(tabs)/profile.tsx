import SafeScreen from "@/components/SafeScreen";
import { useCloudinaryUpload } from "@/hooks/useCloudinary";
import { useImageProcess } from '@/hooks/useImageProcess';
import { useProfile } from "@/hooks/useProfile";
import useProfileImage from "@/hooks/useProfileImage";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Gallery from 'react-native-awesome-gallery';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const MENU_ITEMS = [
  { id: 1, icon: "person-outline", title: "Ubah Profil", color: "#3B82F6", action: "/profile-detail" },
  { id: 2, icon: "newspaper-outline", title: "Daftar Transaksi", color: "#10B981", action: "/orders" },
  { id: 3, icon: "location-outline", title: "Alamat Kirim", color: "#F59E0B", action: "/addresses" },
  { id: 4, icon: "ticket-outline", title: "Kupon Diskon", color: "#b91010", action: "/voucher" },
] as const;

const ProfileScreen = () => 
{
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    router.push(action);
  };

  const [showPopup, setShowPopup] = useState(false);
  const {imagePicked,takePhoto,pickImageFromGallery,resetImagePicked} = useProfileImage();
  const [gambar,setGambar] = useState<string|null>();

  // Upload Hooks 
  const { uploadToCloudinary, progress, statusText, isUploading, urlUpl} =
    useCloudinaryUpload();
  const {usertbl, saveImage} = useProfile();
  const {processImage} = useImageProcess();

  // IMAGE VIEWER
  const [imvVisible, setImvVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  interface ImageItem {
    id: string;
    uri: string;
  }
  const [IMAGES, setIMAGES] = useState<ImageItem[]>([]);

  const addImageWithCheck = (newUri: string): void => {
    // 1. Cek apakah URI sudah ada di dalam array state
    const isDuplicate = IMAGES.some((item) => item.uri === newUri);
    if (isDuplicate) {
      return;
    }
    const newImage: ImageItem = {
      id: `img-${IMAGES.length+1}`,
      uri: newUri,
    };
    setInitialIndex((prev)=>prev+1);
    setIMAGES((prev) => [...prev, newImage]);
  };
  const imageUrls: string[] = IMAGES.map((item) => item.uri);

  // Init data 
  useEffect(()=>{
    if (usertbl===undefined) return
    if (usertbl.imageUrl!==undefined) {
      setGambar(usertbl.imageUrl);
      addImageWithCheck(usertbl.imageUrl)
    } else {
      setGambar(user?.imageUrl)
      if (user?.imageUrl!==undefined) {
        addImageWithCheck(user.imageUrl)
      }
    }
  },[usertbl]) 

  useEffect(()=>{
    setShowPopup(false)
    if (imagePicked!==null) {
      (async () => {
        // Resize Dimension
        const processed = await processImage(imagePicked, {
          maxDimension: 1500,
          compress: 0.8,
        }); 
        const respon = await uploadToCloudinary(processed.uri);
        if (respon!==null) {
          saveImage(respon.secure_url);
        }
        resetImagePicked();
      })()
    }
  },[imagePicked])

  return (
    <SafeScreen>
      {/* MODAL IMAGE VIEWER */}
      <Modal 
        visible={imvVisible} 
        transparent={true} 
        onRequestClose={() => setImvVisible(false)}
      >
        <GestureHandlerRootView style={{flex:1}}>
        <Gallery
          data={imageUrls}
          initialIndex={initialIndex}
          // onSwipeToClose={() => setImvVisible(false)}
        />
        </GestureHandlerRootView>
      </Modal>


      {/* PROGRESS BAR UPLOAD */}
      {isUploading && (<View className="relative">
        <View className="absolute w-40 h-8 rounded-full item left-4 top-9 flex-row bg-text-primary py-1 px-1 z-20">
          <View className="h-auto bg-primary rounded-full" style={{width:`${progress}%`}}>
            <Text className="text-base text-center font-bold">{statusText}</Text>
          </View>
        </View>
      </View>)}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* +++++++ HEADER ++++++++++ */}
        <View className="px-6 pb-5 border-b border-surface flex-row items-center">
          <Text className="text-primary text-xl font-bold">Profil Pengguna</Text>
        </View>
        <View className="px-6 pb-8">
          <View className="rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="relative">
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={()=>{setImvVisible(true)}}
                >
                  <Image
                    source={gambar}
                    style={{ width: 90, height: 90, borderRadius: 50 }}
                    transition={200}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="absolute w-[35px] h-[35px] -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center border border-surface"
                  activeOpacity={0.5}
                  onPress={()=>setShowPopup(!showPopup)}
                >
                  <Ionicons name="camera" size={24} color="#121212" />
                </TouchableOpacity>

                {/* POPUP 2 TOMBOL BULAT HORIZONTAL */}
                {showPopup && (
                  <View className="absolute -bottom-[32px] -right-[80px] flex-row bg-background-lighter p-2 rounded-full shadow-lg border border-slate-700 z-20 space-x-2">
                    {/* Tombol Bulat 1: Kamera */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      className="w-10 h-10 bg-blue-700 rounded-full items-center justify-center"
                      onPress={takePhoto}
                    >
                      <Ionicons name="camera-outline" size={26} color="#FFF" />
                    </TouchableOpacity>
                    {/* Tombol Bulat 2: Galeri */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      className="w-10 h-10 bg-red-800 rounded-full items-center justify-center"
                      onPress={pickImageFromGallery}
                    >
                      <Ionicons name="images-outline" size={22} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                )}

              </View>

              <View className="flex-1 ml-4"> 
                <Text className="text-text-primary text-xl font-bold mb-1">
                  {usertbl?.name ? usertbl.name : user?.firstName+' '+user?.lastName}
                </Text>
                {/* TAMPILKAN KOTA */}
                {usertbl?.kotakab ? (
                <Text className="text-text-secondary text-sm mb-1">
                  {usertbl.kotakab} {usertbl.kontak}
                </Text>
                ) : ''}
                <Text className="text-text-secondary text-sm">
                  {user?.emailAddresses?.[0]?.emailAddress || "No email"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* MENU ITEMS */}
        <View className="flex-row flex-wrap gap-2 mx-6 mb-3 justify-start">

          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-surface rounded-2xl p-5 items-center justify-center"
              style={{ width: "47%",backgroundColor: item.color + "20" }}
              activeOpacity={0.5}
              onPress={() => handleMenuPress(item.action)}
            >
              <View
                className="rounded-full w-16 h-16 items-center justify-center mb-4"
              >
                <Ionicons name={item.icon} size={42} color={item.color} />
              </View>
              <Text className="text-text-primary font-bold text-base">{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SIGNOUT BTN */}
        <TouchableOpacity
          className="mx-6 mb-3 bg-surface rounded-2xl py-4 flex-row items-center justify-center border-2 border-red-500/20"
          activeOpacity={0.8}
          onPress={() => signOut()}
        >
          <Ionicons name="log-out-outline" size={28} color="#ff7f23" />
          <Text className="text-primary text-xl font-bold ml-3">Sign Out</Text>
        </TouchableOpacity>

        <Text className="mx-6 mb-3 text-center text-text-secondary text-xs">Version 1.0.0</Text>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;

// REACT NATIVE IMAGE VS EXPO IMAGE:

// React Native Image (what we have used so far):
// import { Image } from "react-native";
//
// <Image source={{ uri: url }} />

// Basic image component
// No built-in caching optimization
// Requires source={{ uri: string }}

// Expo Image (from expo-image):
// import { Image } from "expo-image";

// <Image source={url} />

// Caching - automatic disk/memory caching
// Placeholder - blur hash, thumbnail while loading
// Transitions - crossfade, fade animations
// Better performance - optimized native rendering
// Simpler syntax: source={url} or source={{ uri: url }}
// Supports contentFit instead of resizeMode

// Example with expo-image:
// <Image   source={user?.imageUrl}  placeholder={blurhash}  transition={200}  contentFit="cover"  className="size-20 rounded-full"/>

// Recommendation: For production apps, expo-image is better — faster, cached, smoother UX.
// React Native's Image works fine for simple cases though.

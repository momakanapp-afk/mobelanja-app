import SafeScreen from "@/components/SafeScreen";
import useProfileImage from "@/hooks/useProfileImage";
import { useAuth, useUser } from "@clerk/expo";

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  { id: 1, icon: "person-outline", title: "Ubah Profil", color: "#3B82F6", action: "/profile-detail" },
  { id: 2, icon: "newspaper-outline", title: "Daftar Pesanan", color: "#10B981", action: "/orders" },
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
  const {image,takePhoto,pickImageFromGallery} = useProfileImage();
  const [gambar,setGambar] = useState<string|null>();

  useEffect(()=>{
    if (image===null) setGambar(user?.imageUrl)
    else setGambar(image)
    setShowPopup(false)
  },[image])

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER */}
        <View className="px-6 pb-5 border-b border-surface flex-row items-center">
          <Text className="text-primary text-xl font-bold">Profil Pengguna</Text>
        </View>
        <View className="px-6 pb-8">
          <View className="rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={gambar}
                  style={{ width: 90, height: 90, borderRadius: 50 }}
                  transition={200}
                />
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
                  {user?.firstName} {user?.lastName}
                </Text>
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

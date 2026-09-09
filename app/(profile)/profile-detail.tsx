import SafeScreen from '@/components/SafeScreen'
import { useProfile } from '@/hooks/useProfile'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
  Text, TextInput, TouchableOpacity, View
} from 'react-native'
import useToast, { ToastContainer } from 'rn-toastify'


const UserProfileScreen = () => {

  const {usertbl,changeProfile,isSaveProfile} = useProfile();
  
  const [userForm,setUserForm] = useState(
    {name:"", facebook:"",kontak:"",kotakab:"",email:""});

  const toast = useToast();  

  // Simpan perubahan
  const onSaveProfile = () => {
    if (!userForm.name) {
      toast.error('Nama pengguna harus diisi', {
        title: 'Validasi',
        duration: 3500,
      });
      return; 
    }
    changeProfile(userForm,{
      onSuccess: ()=>{router.back()}
    });
  }

  useEffect(()=>{
    if (usertbl) {
      setUserForm({
        name:usertbl.name, 
        facebook:usertbl.facebook,
        kontak:usertbl.kontak,
        kotakab:usertbl.kotakab,
        email:usertbl.email
      })
    }
  },[usertbl])
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeScreen> 

        <View className="px-6 pb-5 border-b border-surface flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="#ff7f23" />
          </TouchableOpacity>
          <Text className="text-primary text-xl font-bold">Ubah Profil</Text>
        </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
          >
            <View className='p-4'>
              {/* NAMA USER */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Nama Pengguna
                </Text>
                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
                  placeholder="Nama anda sebagai pengguna"
                  placeholderTextColor="#666"
                  value={userForm.name}
                  onChangeText={(text) => setUserForm({ ...userForm, name: text })}
                />
              </View>
              {/* KOTA DOMISILI */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Kota Kabupaten Domisili
                </Text>
                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
                  placeholder="Kota tempat tinggal"
                  placeholderTextColor="#666"
                  value={userForm.kotakab}
                  onChangeText={(text) => setUserForm({ ...userForm, kotakab: text })}
                />
              </View>
              {/* KONTAK */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Nomor Kontak (telp, whatsapp)
                </Text>
                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
                  placeholder="Nomor kontak anda"
                  placeholderTextColor="#666"
                  value={userForm.kontak}
                  onChangeText={(text) => setUserForm({ ...userForm, kontak: text })}
                />
              </View>
              {/* FACEBOOK*/}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Profil Facebook
                </Text>
                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
                  placeholder="Nama profil di facebook"
                  placeholderTextColor="#666"
                  value={userForm.facebook}
                  onChangeText={(text) => setUserForm({ ...userForm, facebook: text })}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className="bg-primary rounded-2xl py-5 items-center"
                activeOpacity={0.8}
                onPress={onSaveProfile}
                disabled={false}
              >
                {isSaveProfile ? (
                    <ActivityIndicator size="small" color="#121212" />
                  ) : (
                    <Text className="text-background font-bold text-lg">
                      Simpan Profil
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

export default UserProfileScreen
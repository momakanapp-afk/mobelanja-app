import useSocialAuth from '@/hooks/useSocialAuth';
import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import "../global.css";

const AuthScreen = () => {
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();
  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <Image 
      source={require("../../assets/images/auth-image.png")} 
      className='size-32' 
      resizeMode="contain"
      />
      
      <View className='gap-2 mt-10'>
        {/* GOOGLE SIGN IN */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-2"
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={loadingStrategy !== null}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2, // this is for android
          }}
        >
          {loadingStrategy === "oauth_google" ? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("../../assets/images/google.png")}
                className="size-10 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">Masuk dengan Google</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* FACEBOOK SIGN IN */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-3"
          onPress={() => handleSocialAuth("oauth_facebook")}
          disabled={loadingStrategy !== null}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2, // this is for android
          }}
        >
          {loadingStrategy === "oauth_apple" ? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("../../assets/images/facebook.png")}
                className="size-8 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">Masuk Dengan Facebook</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
        Dengan Mendaftar berarti anda setuju dengan  <Text className="text-blue-500">Ketentuan</Text>
        {" dan "}
        <Text className="text-blue-500">Kebijakan Privasi Kami</Text>
        {", termasuk "}
        <Text className="text-blue-500">Penggunaan Cookie</Text>
      </Text>
    </View>

  )
}

export default AuthScreen
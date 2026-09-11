import SafeScreen from '@/components/SafeScreen';
import ShopProfileBox from '@/components/ShopProfileBox';
import { useMerchant } from '@/hooks/useMerchant';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const ShopScreen = () => {
  const {merchantData} = useMerchant();
  
  return (
    <SafeScreen>
        <View className="px-6 py-4 border-b border-surface flex-row items-center">
          <Text className="text-primary text-xl font-bold">Kelola Toko</Text>
        </View>
        
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
        {/* +++++++ PROFILE BOX ++++++++++ */}
          <ShopProfileBox 
            datatoko={merchantData}
          />

        </ScrollView>
      </SafeScreen>
  )
}

export default ShopScreen
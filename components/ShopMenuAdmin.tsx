import { FormToko } from '@/types'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'


interface PropsShopMA {
  datatoko: FormToko | null,
  isLoading: boolean,
}

const ShopMenuAdmin = ({datatoko,isLoading}:PropsShopMA) => {
  if (isLoading) {
    return (<View></View>)
  }

  if (datatoko===null) {
    return (<View></View>)
  }
  
  return (
    <View>
      <View className='flex-row gap-4 px-6 mb-4 items-center'>
        <View className='flex-1 rounded-2xl bg-surface border-2 border-primary/40'>
          <View className='flex-row p-4'>
              <View className='items-center'>
                <Text className='text-[#fbcdad] text-3xl'>12</Text>
                <Text className='text-[#fbcdad]'>Pesanan Baru</Text>
              </View>
              <TouchableOpacity>
                <Entypo name='back-in-time' size={34} color='#ff7f23' />
              </TouchableOpacity>
            </View>
        </View>
        <View className='flex-1 rounded-2xl bg-surface'>
          <View className='flex-row p-4'>
              <View className='items-center'>
                <Text className='text-text-primary text-3xl'>102</Text>
                <Text className='text-text-primary'>Total Pesanan</Text>
              </View>
              <TouchableOpacity>
                <Entypo name='forward' size={34} color='#E3D3CC' />
              </TouchableOpacity>
            </View>
        </View>

      </View>

    {/* PESANAN BARU */}
    <TouchableOpacity
      className="bg-primary/30 rounded-2xl p-4 mb-3 mx-6 border-2 border-primary/40"
      activeOpacity={0.5}
    >
      <View className="flex-row items-center">
        <View className="rounded-full w-16 h-16 items-center justify-center mr-4">
          <Entypo name="bell" size={38} color="#ff7f23" />
        </View>
        <View className="flex-1">
          <Text className="text-[#ffd8bc] font-bold text-base mb-1">
            Pesanan Baru
          </Text>
          <Text className="text-[#ffd8bc] text-sm">
            Cek dan update pesanan baru
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ff7f23" />
      </View>
    </TouchableOpacity>

    {/* DAFTAR BARANG */}
    <TouchableOpacity
      className="bg-green-800/40 rounded-2xl p-4 mb-3 mx-6 border-2 border-green-800"
      activeOpacity={0.5}
      onPress={()=>router.push('/daftarbarang')}
    >
      <View className="flex-row items-center">
        <View className="rounded-full w-16 h-16 items-center justify-center mr-4">
          <Entypo name="shopping-bag" size={38} color="#86efac" />
        </View>
        <View className="flex-1">
          <Text className="text-green-300 font-bold text-base mb-1">
            Kelola Barang Dijual
          </Text>
          <Text className="text-green-300/75 text-sm">
            Kelola daftar barang yang dijual
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#86efac" />
      </View>
    </TouchableOpacity>

      {/*UPDATE INFO TOKO */}
      <TouchableOpacity
        className="bg-surface rounded-2xl p-4 mb-3 mx-6"
        activeOpacity={0.5}
        onPress={()=>router.push('/bukatoko')}
      >
        <View className="flex-row items-center">
          <View className="rounded-full w-16 h-16 items-center justify-center mr-4">
            <Entypo name="shop" size={38} color="#B3B3B3" />
          </View>
          <View className="flex-1">
            <Text className="text-text-primary font-bold text-base mb-1">
              Update data toko
            </Text>
            <Text className="text-text-secondary text-sm">
              Ubah data informasi toko
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#B3B3B3" />
        </View>
      </TouchableOpacity>


    </View>
  )
}

export default ShopMenuAdmin
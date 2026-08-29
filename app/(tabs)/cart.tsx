import SafeScreen from '@/components/SafeScreen'
import React from 'react'
import { Text } from 'react-native'

const CartScreen = () => {
  return (
    <SafeScreen>
      <Text className='text-white'>Keranjang Belanja</Text>
    </SafeScreen>
  )
}

export default CartScreen
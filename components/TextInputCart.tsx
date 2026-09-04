import useCart from '@/hooks/useCart';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import useToast from 'rn-toastify';

const[textVal,setTextVal] = useState('')
const {updateQuantity} = useCart()

interface tipeTIC {
  defVal:string;
  prodId:string;
} 

  const toast = useToast();


const TextInputCart = ({defVal,prodId}:tipeTIC) => {
  
  const ubahQty = (teks:string)=>
  {
    // Tampilkan text dulu
    setTextVal(teks);

    if (teks==='') return
    
    // validasi angka 
    const jml = Number(teks);
    if (jml > 500) {
      toast.error('Maksimal jumlah pembelian adalah 500', {
        title: 'Error',
        duration: 3500,
      });
      setTimeout(()=>{setTextVal('500')},500)
      return
    }
    
    // Update database
    updateQuantity({
      productId:prodId,
      quantity: Number(teks)
    })
  }

  
  return (
  <View className="mx-4 min-w-[36px] items-center">

    <TouchableOpacity
      className="bg-background-lighter rounded-full w-9 h-9 items-center justify-center"
      activeOpacity={0.7}
      onPress={()=>{}}
      disabled={false}
    >
      <Ionicons name="remove" size={18} color="#FFFFFF" />
    </TouchableOpacity>

    <TextInput 
      defaultValue={defVal}
      value={textVal}
      onChangeText={(teks)=>{ubahQty(teks)}}
    />

    <TouchableOpacity
      className="bg-primary rounded-full w-9 h-9 items-center justify-center"
      activeOpacity={0.7}
      onPress={()=>{}}
      disabled={false}
    >
      <Ionicons name="add" size={18} color="#121212" />
    </TouchableOpacity>
    
  </View>
  )
}

export default TextInputCart
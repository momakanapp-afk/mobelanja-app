import useCart from '@/hooks/useCart';
import useDebounce from '@/hooks/useDebounce';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';
import useToast from 'rn-toastify';


interface tipeTIC {
  defVal: string;
  prodId: string;
  namaBrg: string;
  dynTotal: (subTotal:number)=>void
} 

const TextInputCart = ({defVal,prodId,namaBrg,dynTotal}:tipeTIC) => {

  // Wajib, gunakan useState dalam body yg akan di export
  const[textVal,setTextVal] = useState('')
  const {updateQuantity,removeFromCart,isRemoving,subTotal,isUpdating} = useCart()

  const handleQuantityChange = (inc:'+'|'-') => {
  const newQuantity = (inc==='+') ? Number(textVal) + 1 : (Number(textVal) - 1);
    if (newQuantity < 1) return;
    setTextVal(String(newQuantity))
  };
  const toast = useToast();

  // Lifting state up: untuk interaktif subtotal di cart screen 
  const handleDynTotal = ()=> {
    if (subTotal) dynTotal(subTotal)
  }

  const ubahQty = (teks:string)=>
  {
    // Tampilkan text dulu
    setTextVal(teks);

    // Edit jumlah dengan mengosongkan teks dulu
    if (teks==='') return

    // // validasi angka 
    const jml = Number(teks);
    if (jml > 500) {
      toast.error('Maksimal jumlah pembelian adalah 500', {
        title: 'Validasi',
        duration: 3500,
      });
      setTimeout(()=>{setTextVal('500')},500)
      return
    } 
    if (jml < 1) {
      toast.error('Minimal pembelian adalah 1', {
        title: 'Validasi',
        duration: 3500,
      });
      setTimeout(()=>{setTextVal('1')},500)
      return
    } 
  }

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert("Yakin ?", `Hapus ${productName} dari keranjang ?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => removeFromCart(productId),
      },
    ]);
  };

  // Debounce update interatif jumlah ke server
  const debJml = useDebounce(textVal, 250);
  useEffect(()=>{
    updateQuantity({productId:prodId,quantity:Number(debJml)})
  },[debJml])

  useEffect(()=>{
    handleDynTotal()
  },[isUpdating,isRemoving])

  // Init jumlah default
  useEffect(()=>{
    setTextVal(defVal)
  },[])

  return (
  <View className="flex-row mx-4 min-w-[36px] items-center">

    <TouchableOpacity
      className="bg-primary rounded-full w-9 h-9 mr-2 items-center justify-center"
      activeOpacity={0.7}
      onPress={()=>{handleQuantityChange('-')}}
    >
      <Ionicons name="remove" size={18} color="#121212" />
    </TouchableOpacity>

    <TextInput 
      className="border py-0 w-[60px] h-[42px] border-gray-300 rounded-lg p-3 text-lg text-white"
      keyboardType="number-pad" 
      value={textVal}
      onChangeText={(teks)=>{ubahQty(teks)}}
    />

    <TouchableOpacity
      className="bg-primary ml-2 rounded-full w-9 h-9 items-center justify-center"
      activeOpacity={0.7}
      onPress={()=>{handleQuantityChange('+')}}
    >
      <Ionicons name="add" size={18} color="#121212" />
    </TouchableOpacity>

    <TouchableOpacity
      className="ml-3 bg-red-500/20 rounded-full w-9 h-9 items-center justify-center"
      activeOpacity={0.5}
      onPress={() => handleRemoveItem(prodId, namaBrg)}
      disabled={isRemoving}
    >
      <Ionicons name="trash-outline" size={24} color="#EF4444" />
    </TouchableOpacity>
    
  </View>
  )
}

export default TextInputCart
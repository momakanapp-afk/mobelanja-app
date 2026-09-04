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
} 

const TextInputCart = ({defVal,prodId,namaBrg}:tipeTIC) => {

  const[textVal,setTextVal] = useState('')
  const {updateQuantity,isUpdating,removeFromCart,isRemoving} = useCart()

  const handleQuantityChange = (inc:'+'|'-') => {
  const newQuantity = (inc==='+') ? Number(textVal) + 1 : (Number(textVal) - 1);
    if (newQuantity < 1) return;
    setTextVal(String(newQuantity))
  };
  const toast = useToast();

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

  // Pop Up Toast saat menghitung ulang
  // const idToast = useRef<string|null>(null)
  // useEffect(()=>{
  //   if (isUpdating) {
  //     idToast.current = toast.warning('Menghitung total...', {
  //       duration: Infinity, 
  //     });
  //   } else if (idToast.current) {
  //     toast.dismiss(idToast.current)
  //   }
  //   // Cleanup jika komponen di-unmount saat masih loading
  //   return () => {
  //     if (idToast.current) {
  //       toast.dismiss(idToast.current);
  //     }
  //   };
  // },[isUpdating])

  // Debounce update interatif jumlah ke server
  const debJml = useDebounce(textVal, 250);
  useEffect(()=>{
    updateQuantity({productId:prodId,quantity:Number(debJml)})
  },[debJml])

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
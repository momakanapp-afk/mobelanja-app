import OrderSummary from "@/components/OrderSummary";
import SafeScreen from "@/components/SafeScreen";
import TextInputCart from "@/components/TextInputCart";
import useCart from "@/hooks/useCart";
import { useApi } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ToastContainer } from "rn-toastify";

const CartScreen = () => {
  const api = useApi();
  const {
    cart,
    isError,
    isLoading,
  } = useCart();

  // const { addresses } = useAddresses();

  // const [addressModalVisible, setAddressModalVisible] = useState(false);

  const [total,setTotal] = useState(0);

  const cartItems = cart?.items || [];
  const shipping = 0
  const tax = 0

  const handleDynTotal = (subT:number)=>{
    setTotal(subT)
  }

  function formatRupiah(angka: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka).replace('Rp', 'Rp.');
  }

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;
  if (cartItems.length === 0) return <EmptyUI />;


  return (
    <SafeScreen>
      <Text className="px-6 pb-5 text-text-primary text-2xl font-bold tracking-tight">
        Keranjang belanja
      </Text>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View className="px-6 gap-2">

          { cartItems.map((item) => {
            return (
              <View key={item._id} className="bg-surface rounded-3xl overflow-hidden ">

                {/* BLOK IMAGE */}
                <View className="p-4 flex-row">
                  {/* product image */}
                  <View className="relative">
                    <Image
                      source={item.product.image}
                      className="bg-background-lighter"
                      contentFit="cover"
                      style={{ width: 112, height: 112, borderRadius: 16 }}
                    />
                    <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
                      <Text className="text-background text-xs font-bold">×{item.quantity}</Text>
                    </View>
                  </View>

                  {/* BLOK SAMPING IMAGE */}
                  <View className="flex-1 ml-4">
                    {/* NAMA ITEM */}
                    <View>
                      <Text
                        className="text-text-primary font-bold text-lg leading-tight"
                        numberOfLines={2}
                      >
                        {item.product.name}
                      </Text>
                      {/* HARGA */}
                      <View className="mt-2">
                        <Text className="text-primary font-bold text-lg text-left">
                          {formatRupiah(item.product.price * item.quantity)}
                        </Text>
                      </View>
                    </View>
                    {/* EDITOR QTY BARANG */}
                    <TextInputCart 
                      defVal={String(item.quantity)}
                      prodId={item.product._id}
                      namaBrg={item.product.name}
                      dynTotal={handleDynTotal}
                    />
                    
                    <View>
                      <Text className="text-text-secondary text-sm">
                        {formatRupiah(item.product.price)} /pcs 
                      </Text>
                    </View>

                    
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        <OrderSummary 
          subtotal={total} 
          shipping={shipping} 
          tax={tax} 
          total={total} 
        />
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t
       border-surface pt-4 pb-32 px-6"
      >
        {/* Quick Stats */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#1DB954" />
            <Text className="text-text-secondary ml-2">
              1 Item
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-text-primary font-bold text-xl">
              {formatRupiah(total)}
            </Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          className="bg-primary rounded-2xl overflow-hidden"
          activeOpacity={0.9}
          // onPress={handleCheckout}
        >
          <View className="py-5 flex-row items-center justify-center">
            <Text className="text-background font-bold text-lg mr-2">Checkout</Text>
            <Ionicons name="arrow-forward" size={20} color="#121212" />
          </View>
        </TouchableOpacity>
      </View>

      {/* <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceedWithPayment}
        isProcessing={false}
      /> */}

      <ToastContainer maxVisible={3} />
    </SafeScreen>
  );
};

function LoadingUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#00D9FF" />
      <Text className="text-text-secondary mt-4">Memuat keranjang belanja</Text>
    </View>
  );
}

function ErrorUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
      <Text className="text-text-primary font-semibold text-xl mt-4">Gagal memuat data</Text>
      <Text className="text-text-secondary text-center mt-2">
        Cek kembali koneksi anda
      </Text>
    </View>
  );
}

function EmptyUI() {
  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-5">
        <Text className="text-text-primary text-3xl font-bold tracking-tight">Cart</Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="cart-outline" size={80} color="#666" />
        <Text className="text-text-primary font-semibold text-xl mt-4">Keranjangmu masih kosong</Text>
        <Text className="text-text-secondary text-center mt-2">
          Tambahkan produk untuk mulai berbelanja
        </Text>
      </View>
    </View>
  );
}

export default CartScreen;


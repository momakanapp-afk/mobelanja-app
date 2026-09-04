import OrderSummary from "@/components/OrderSummary";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { useApi } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ToastContainer } from "rn-toastify";

const CartScreen = () => {
  const api = useApi();
  const {
    cart,
    isError,
    isLoading,
    isRemoving,
    isUpdating,
    removeFromCart,
    updateQuantity,} = useCart();

  // const { addresses } = useAddresses();

  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = 0;
  const shipping = 0; // shipping fee
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    updateQuantity({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert("Hapus", `Hapus ${productName} dari keranjang ?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => removeFromCart(productId),
      },
    ]);
  };


  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;
  if (cartItems.length === 0) return <EmptyUI />;


  return (
    <SafeScreen>
      <Text className="px-6 pb-5 text-text-primary text-3xl font-bold tracking-tight">Cart</Text>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View className="px-6 gap-2">

          { cartItems.map((item) => {
            const loadProsesRemove = isRemoving===item.product._id
            return (
              <View key={item._id} className="bg-surface rounded-3xl overflow-hidden ">
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

                  <View className="flex-1 ml-4">
                    <View>
                      <Text
                        className="text-text-primary font-bold text-lg leading-tight"
                        numberOfLines={2}
                      >
                        {item.product.name}
                      </Text>
                      <View className="mt-2">
                        <Text className="text-primary font-bold text-xl text-left">
                          ${(item.product.price * item.quantity)}
                        </Text>
                        <Text className="text-text-secondary text-sm ml-2">
                          ${item.product.price} /item
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center mt-3">
                      {/* KOMPONEN INPUT JML */}

                      <TouchableOpacity
                        className="ml-auto bg-red-500/10 rounded-full w-9 h-9 items-center justify-center"
                        activeOpacity={0.7}
                        onPress={() => handleRemoveItem(item.product._id, item.product.name)}
                        disabled={loadProsesRemove}
                      >
                        {loadProsesRemove ? (
                          <ActivityIndicator size="small" color="#EF4444" />
                        ) : (
                          <Ionicons name="trash-outline" size={28} color="#EF4444" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
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
            <Text className="text-text-primary font-bold text-xl">${total}</Text>
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

export default CartScreen;

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

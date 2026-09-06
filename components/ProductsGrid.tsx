import useCart from "@/hooks/useCart";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import useToast from 'rn-toastify';

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: 250, 
  },
});

const toast = useToast();
const masuKeranjang = (barang:string) => {
  toast.success('Telah ditambahkan ke keranjang belanja', {
    title: barang,
    duration: 3500,
  });
};


interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
  header: () => React.ReactElement;
}


const ProductsGrid = ({ products, isLoading, isError, header }: ProductsGridProps) => 
{
  const { isAddingToCart, addToCart } = useCart();

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId },
      {
        onSuccess: () =>  masuKeranjang(productName),
        onError: (error: any) => {
          toast.error("Terjadi error saat menambahkan barang", {
            title: "Error",
            duration: 3500,
          });
        },
      }
    );
  };

  const renderProduct = ({ item: product }: { item: Product }) => {
    const isLoadingCart = isAddingToCart === product._id;
    return  (
      <TouchableOpacity
        className="bg-surface rounded-3xl overflow-hidden mb-3"
        style={{ width: "48%" }}
        activeOpacity={0.5}
        // onPress={() => router.push(`/product/${product._id}`)}
      >
        <View className="relative">
          <Image
            source={{ uri: product.images[0] }}
            className="w-full h-44 bg-background-lighter"
            resizeMode="cover"
          />
        </View>

        <View className="p-3">
          <Text className="text-text-secondary text-xs mb-1">{product.category}</Text>
          <Text className="text-text-primary font-bold text-sm mb-2" numberOfLines={2}>
            {product.name}
          </Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text className="text-text-primary text-xs font-semibold ml-1">
              {product.averageRating}
            </Text>
            <Text className="text-text-secondary text-xs ml-2">({product.totalReviews})</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-text-primary font-bold text-lg">{product.price}</Text>

            <TouchableOpacity
              className="bg-primary ml-2 rounded-full w-[60px] h-[38px] items-center justify-center"
              activeOpacity={0.7}
              onPress= {() => handleAddToCart(product._id, product.name)}
              disabled={isLoadingCart}
            >
            {isLoadingCart ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="cart" size={30} color="#ffe4d0" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color="#fbd502" />
        <Text className="text-text-secondary text-xl mt-4">Memuat Daftar Barang</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-20 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
        <Text className="text-text-primary text-xl font-semibold mt-4">Gagal memuat daftar</Text>
        <Text className="text-text-secondary text-base mt-2">Silahkan coba kembali</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={NoProductsFound}
      ListHeaderComponent = {header}
      contentContainerStyle = {styles.flatListContent}
    />
  );
};

function NoProductsFound() {
  return (
    <View className="py-20 items-center justify-center">
      <Ionicons name="search-outline" size={60} color={"#666"} />
      <Text className="text-text-primary text-xl font-semibold mt-4">Hasil Tidak ditemukan</Text>
      <Text className="text-text-secondary text-base mt-2">Coba dengan pencarian lain</Text>
    </View>
  );
}

export default ProductsGrid;

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

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
  header: () => React.ReactElement;
}

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: 250, 
  },
});

const ProductsGrid = ({ products, isLoading, isError, header }: ProductsGridProps) => 
{
  // const { isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } =
  //   useWishlist();

  // const { isAddingToCart, addToCart } = useCart();

  // const handleAddToCart = (productId: string, productName: string) => {
  //   addToCart(
  //     { productId, quantity: 1 },
  //     {
  //       onSuccess: () => {
  //         Alert.alert("Success", `${productName} added to cart!`);
  //       },
  //       onError: (error: any) => {
  //         Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
  //       },
  //     }
  //   );
  // };

  const renderProduct = ({ item: product }: { item: Product }) => 
  (
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

        <TouchableOpacity
          className="absolute top-3 right-3 bg-black/30 backdrop-blur-xl p-2 rounded-full"
          activeOpacity={0.7}
          // onPress={() => toggleWishlist(product._id)}
          // disabled={isAddingToWishlist || isRemovingFromWishlist}
        >
            <Ionicons
              name="heart-outline" size={18} color="#FFFFFF" />
          
            {/* {isAddingToWishlist || isRemovingFromWishlist ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name={isInWishlist(product._id) ? "heart" : "heart-outline"}
                size={18}
                color={isInWishlist(product._id) ? "#FF6B6B" : "#FFFFFF"}
              />
            )} */}
        </TouchableOpacity>
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
          <Text className="text-text-secondary text-xs ml-1">({product.totalReviews})</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-primary font-bold text-lg">{product.price}</Text>

          <TouchableOpacity
            className="bg-primary rounded-3xl w-10 h-10 items-center justify-center"
            activeOpacity={0.7}
            // onPress= {() => handleAddToCart(product._id, product.name)}
            // disabled={isAddingToCart}
          >
            <Ionicons name="cart" size={26} color="#121212" />
            {/* {isAddingToCart ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <Ionicons name="cart" size={26} color="#121212" />
            )} */}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
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

export default ProductsGrid;

function NoProductsFound() {
  return (
    <View className="py-20 items-center justify-center">
      <Ionicons name="search-outline" size={60} color={"#666"} />
      <Text className="text-text-primary text-xl font-semibold mt-4">Hasil Tidak ditemukan</Text>
      <Text className="text-text-secondary text-base mt-2">Coba dengan pencarian lain</Text>
    </View>
  );
}

import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
  isAddingToCart: string;
  handleAddToCart: (prodId:string,prodName:string)=>void;
  header: () => React.ReactElement;
}

const ProductsGrid = ({ products, isLoading, isError, header, 
  isAddingToCart,handleAddToCart,
}: ProductsGridProps) => 
{
  const renderProduct = ({ item: product }: { item: Product }) => {
    const isLoadingCart = isAddingToCart === product._id;
    return  (
      <TouchableOpacity
        className="bg-surface rounded-3xl overflow-hidden mb-3"
        style={{ width: "48%" }}
        activeOpacity={0.5}
        // onPress={() => router.push(`/product/${product._id}`)}
      >
        {/* GAMBAR PRODUK */}
        <View className="relative">
          <Image
            source={product.images[0]}
            className="bg-background-lighter"
            transition={200}
            style={{height:140,width:"auto"}}
          />
        </View>

        <View className="p-3">
          <Text className="text-text-secondary text-xs mb-1">{product.category}</Text>
          {/* NAMA PRODUK */}
          <Text className="text-text-primary text-base mb-2" numberOfLines={2}>
            {product.name}
          </Text>

          {/* REVIEW STARS */}
          <View className="flex-row items-center mb-2">
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text className="text-text-primary text-xs font-semibold ml-1">
              {product.averageRating}
            </Text>
            <Text className="text-text-secondary text-xs ml-2">({product.totalReviews})</Text>
          </View>

          {/* HARGA PRODUK */}
          <View className="flex-row items-center justify-between">
            <Text className="text-text-primary text-lg">{product.price}</Text>

            {/* TOMBOL ADD TO CART */}
            <TouchableOpacity
              className="bg-primary ml-2 rounded-full w-[50px] h-[38px] items-center justify-center"
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
      contentContainerStyle = {{paddingBottom:250}}
      contentContainerClassName="px-2"
    />
  );
};

function NoProductsFound() {
  return (
    <View className="py-20 items-center justify-center">
      <Ionicons name="search-outline" size={60} color={"#666"} />
      <Text className="text-text-primary text-lg font-semibold mt-4">Tidak ada barang untuk ditampilkan</Text>
      <Text className="text-text-secondary text-base mt-2">Coba manfaatkan pencarian</Text>
    </View>
  );
}

export default ProductsGrid;

import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  const api = useApi(); // ambil api melalui cek useEffect interceptor token

  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<Product[]>("/products.php");
      return data;
    },
  });
  return result;
}

export default useProducts;
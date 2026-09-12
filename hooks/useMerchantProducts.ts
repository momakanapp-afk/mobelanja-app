import { useApi } from "@/lib/api";
import { M_Produk } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "rn-toastify";


export const useMerchantProducts = () => 
{
  const queryClient = useQueryClient();
  const api = useApi();
  const toast = useToast();

    // GET DATA USE QUERY
    const {data:medata,isLoading,isError} = useQuery({
      queryKey: ["merchantProducts"],
      queryFn: async () => {
        const { data } = await api.get<{ mdata:M_Produk[] }>(
          "/users/merchant_products.php");
        return data.mdata;
      },
    });
  
  return {
    MProducts: medata,
    waitData: isLoading
  }
}
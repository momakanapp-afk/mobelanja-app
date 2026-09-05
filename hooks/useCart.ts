import { useApi } from "@/lib/api";
import { Cart, CartItem } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";


const useCart = () => 
{
  const api = useApi();
  const queryClient = useQueryClient();

  const { data: cart, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<{cart:Cart}>("/cart.php");
      return data.cart;
    },
    // staleTime: 1000 * 60 * 1, // Data dianggap fresh selama 1 menit
  });

  const prosesAddCart = useRef("");
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId }: { productId: string }) => {
      prosesAddCart.current = productId;
      const { data } = await api.post<{ cart: Cart }>("/cart.php", {
        'id':  productId,
        'act': 'addCart'
      });
      return data.cart;
    },
    onSuccess: () => {
      prosesAddCart.current = '';
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });

  const syncCartToBackend = useMutation({
    mutationFn: async (payload:CartItem[]) => {
      const {data} = await api.post<{cart:Cart}>("/cart.php",{
        cartlist:payload,
        act: 'syncCart',
      });
      return data.cart
    }
  })

  return {
    cart,
    isLoading,
    isError,
    addToCart: addToCartMutation.mutate,
    isAddingToCart: prosesAddCart.current,
    syncCart: syncCartToBackend.mutate,
    inSyncProcess: syncCartToBackend.isPending,
    inSyncSuccess: syncCartToBackend.isSuccess,
  };
};
export default useCart;

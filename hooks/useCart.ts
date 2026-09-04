import { useApi } from "@/lib/api";
import { Cart } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";


const useCart = () => 
{
  const api = useApi();
  const queryClient = useQueryClient();
  // Wajib ! 
  // Masukkan useState dalam komponen body (useCart()=>{})
  const [subTotal,setSubTotal] = useState(0);
  const ubahTotal = (total:number)=>{
    setSubTotal(total)
  }
  const getTotal = ()=> {
    return subTotal
  }
  

  const { data: cart, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<{cart:Cart,subtotal:number}>("/cart.php");
      ubahTotal(data.subtotal)
      return data.cart;
    },
  });

  const [prosesAddCart,setProsesAddCart] = useState("");
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId }: { productId: string }) => {
      setProsesAddCart(productId);
      const { data } = await api.post<{ cart: Cart }>("/cart.php", {
        'id':  productId
      });
      return data.cart;
    },
    onSuccess: () => {
      setProsesAddCart("");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const { data } = await api.put<{ cart: Cart, subtotal:number }>(`/cart.php`, 
        { 
          id: productId,
          qty: quantity
        });
      ubahTotal(data.subtotal)
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      // parameter data delete() berbeda dengan  post()
      const { data } = await api.delete<{ cart: Cart, subtotal:number }>(`/cart.php`,{
        data: {
          'id':  productId
        }
      });
      ubahTotal(data.subtotal)
      return data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ cart: Cart }>("/cart");
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });


  return {
    cart,
    isLoading,
    isError,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: prosesAddCart,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
    subTotal: getTotal()
  };
};
export default useCart;

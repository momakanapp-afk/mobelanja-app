import { useApi } from "@/lib/api";
import { M_Produk } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
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

  const prosesHapusProd = useRef("");
  const hapusProdMutation = useMutation({
    mutationFn: async ({prodId}:{prodId:string}) => {
      prosesHapusProd.current = prodId;
      const { data } = await api.post<{ isSuccess: boolean }>(
        "/users/merchant_products.php", {
        'id':  prodId,
        'act': 'delete'
      });
      return data;
    },
    onSuccess: () => {
      prosesHapusProd.current = '';
      (async()=>{
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["merchantProducts"] }),
          queryClient.invalidateQueries({ queryKey: ["products"] }),
        ])
      })()
    }
  }); // end hapusProdMutation

  // SIMPAN dan UPDATE data product
  const addUpdateProduct = useMutation({
    mutationFn: async (
      {idToko,dataprod,imgUploaded}:
      {idToko:string,dataprod:M_Produk,imgUploaded:string[]}) => {
      const { data } = await api.post<{ isSuccess: boolean }>(
        "/users/merchant_products.php", {
        id: dataprod._id,
        id_toko: idToko,
        act: 'saveData',
        data: dataprod,
        imgUpl: imgUploaded,
      });
      return data;
    },
    onSuccess: () => {
      (async()=>{
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["merchantProducts"] }),
          queryClient.invalidateQueries({ queryKey: ["products"] }),
        ])
      })()
    }
  }); // end hapusProdMutation
  
  
  return {
    MProducts: medata,
    waitData: isLoading,
    hapusProduk : hapusProdMutation.mutate,
    tungguHapus : prosesHapusProd.current,
    addUpdateProduk: addUpdateProduct.mutate,
    tungguAddUpdate: addUpdateProduct.isPending,
  }
}
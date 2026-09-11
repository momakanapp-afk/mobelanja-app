import { useApi } from "@/lib/api";
import { FormToko } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "rn-toastify";


export const useMerchant = () => 
{
  const queryClient = useQueryClient();
  const api = useApi();
  const toast = useToast();

  // GET DATA USE QUERY
  const {data: merchantData,isLoading,isError} = useQuery({
    queryKey: ["merchantData"],
    queryFn: async () => {
      const { data } = await api.get<{ mdata:FormToko }>(
        "/users/merchant.php");
      return data.mdata;
    },
  });

  // SAVE IMAGE URL
  const saveImageUrl = useMutation({
    mutationFn: async (imgUrl:string) => {
      const { data } = await api.post<{ isSuccess:boolean,imgUrl:string }>(
        "/users/merchant.php", 
        { // Payload
          act: 'saveImageUrl',
          urlimg: imgUrl
        });
      return data;
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success('Gambar profil telah disimpan', {
          title: 'Gambar disimpan',
          duration: 3500,
        });
        queryClient.invalidateQueries({ queryKey: ["merchantData"] });
      }
    }
  })
  // NEW/UPDATE FORM PROFILE
  const saveMerchant = useMutation({
    mutationFn: async ({mdata,imgurl,act}:
      {mdata:FormToko,imgurl:string,act:"editForm"|"newForm"}) => {
      const { data } = await api.post<{ isSuccess:boolean }>(
        "/users/merchant.php", 
        { // Payload
          act: act,
          data: mdata,
          urlimg: imgurl
        });
      return data;
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["merchantData"] });
      }
    }
  })

  return {
    merchantData: merchantData ?? null,
    tungguData: isLoading,
    saveImage: saveImageUrl.mutate,
    saveMerchant: saveMerchant.mutate,
    isSaveMerchant: saveMerchant.isPending
  }
}
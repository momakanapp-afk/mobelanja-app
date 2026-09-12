import { useApi } from "@/lib/api";
import { FormToko } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useMerchant = () => 
{
  const queryClient = useQueryClient();
  const api = useApi();

  // GET DATA USE QUERY
  const {data: merchantData,isLoading,isError} = useQuery({
    queryKey: ["merchantData"],
    queryFn: async () => {
      const { data } = await api.get<{ mdata:FormToko }>(
        "/users/merchant.php");
      return data.mdata;
    },
  });

  // NEW/UPDATE FORM PROFILE
  const saveMerchant = useMutation({
    mutationFn: async ({mdata,imgurl,act}:
      {mdata:Omit<FormToko,"imageUrl"|"waktu"|"_id">,imgurl:string,act:"editForm"|"newForm"}) => {
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
    saveMerchant: saveMerchant.mutate,
    isSaveMerchant: saveMerchant.isPending
  }
}
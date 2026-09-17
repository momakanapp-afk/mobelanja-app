import { useApi } from "@/lib/api";
import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "rn-toastify";


export const useProfile = () => 
{
  const queryClient = useQueryClient();
  const api = useApi();
  const toast = useToast();

  // GET USER DATA 
  const {data: usertbl,isLoading,isError} = useQuery({
    queryKey: ["usertbl"],
    queryFn: async () => {
      const { data } = await api.get<{ userdata:User }>(
        "/users/profile.php");
      return data.userdata;
    },
  });

  // SAVE PROFILE IMAGE 
  const saveImageUrl = useMutation({
    mutationFn: async (imgUrl:string) => {
      const { data } = await api.post<{ isSuccess:boolean,imgUrl:string }>(
        "/users/profile.php", 
        { // Payload
          act: 'saveImageUrl',
          urlimg: imgUrl
        });
      return data;
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success('Gambar profil telah disimpan', {
          title: 'Profil disimpan',
          duration: 3500,
        });
        queryClient.invalidateQueries({ queryKey: ["usertbl"] });
      }
    }
  })
  // UPDATE FORM PROFILE
  const changeProfileData = useMutation({
    mutationFn: async (UserForm:Omit<User,"imageUrl">) => {
      const { data } = await api.post<{ isSuccess:boolean }>(
        "/users/profile.php", 
        { // Payload
          act: 'saveForm',
          data: UserForm
        });
      return data;
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["usertbl"] });
      }
    }
  })

  return {
    usertbl,
    tungguData: isLoading,
    saveImage: saveImageUrl.mutate,
    changeProfile: changeProfileData.mutate,
    isSaveProfile: changeProfileData.isPending
  }
}
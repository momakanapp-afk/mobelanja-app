import { useApi } from "@/lib/api";
import { Address } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "rn-toastify";

export const useAddresses = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const toast = useToast();

  // GET FULL DATA ALAMAT => UseQuery
  const {
    data: addresses,
    isLoading,isError,} = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data } = await api.get<{ addresses: Address[] }>(
        "/users/addresses.php");
      return data.addresses;
    },
  });

  // SYNC OTOMATIS => ADD/UPDATE
  const syncAddressMutation = useMutation({
    mutationFn: async ({id,addressData}: {id:string; addressData:Omit<Address,"_id">}) => {
      const { data } = await api.post<{ isInserted:boolean }>(
        "/users/addresses.php", {
          addrID:id,
          addData: addressData
        });
      return data;
    },
    onSuccess: (data) => {
      if (!data.isInserted) {
        toast.error('Gagal menyimpan alamat, coba lagi', {
          title: 'Alamat tidak berubah',
          duration: 3500,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  // DELETE ALAMAT
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const { data } = await api.delete<{ isDeleted: Address[] }>(
        `/users/addresses.php`,
        {
          // Masukkan payload dalam object data:
          data: {
            addrID:addressId
          }
        }
      );
      return data;
    },
    onSuccess: (data) => {
      if (!data.isDeleted) {
        toast.error('Gagal menghapus alamat, coba lagi', {
          title: 'Gagal menghapus',
          duration: 3500,
        });
      }
      else {
        toast.success('Alamat telah dihapus', {
          title: 'Alamat dihapus',
          duration: 3500,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  return {
    addresses: addresses ?? [],
    isLoading,
    isError,
    syncAddress: syncAddressMutation.mutate,
    deleteAddress: deleteAddressMutation.mutate,
    isSyncAddress: syncAddressMutation.isPending,
    isDeletingAddress: deleteAddressMutation.isPending,
  };
};

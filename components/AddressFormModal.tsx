import { useGetMyGeolocation } from "@/hooks/useGetMyGeolocation";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { ToastContainer } from "rn-toastify";
import { MyToast } from "./MyToast";
import SafeScreen from "./SafeScreen";

interface AddressFormData {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  geolokasi: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  addressForm: AddressFormData;
  isAddingAddress: boolean;
  isUpdatingAddress: boolean;
  isEditing: boolean;
  onClose: () => void;
  onFormChange: (form: AddressFormData) => void;
  onSave: () => void;
  visible: boolean;
}

const AddressFormModal = ({
  addressForm,
  isAddingAddress,
  isEditing,
  isUpdatingAddress, 
  onClose,
  onFormChange,
  onSave,
  visible,
}: AddressFormModalProps) => {

  // Segala fungsi dan definisi masukkan dalam body yg akan diexport !
  // atau compile akan error 
  const [mytoastVisible,setMytoastvisible] = useState(false);
  const [mytoastMsg,setMytoastmsg] = useState('');
  
  // Loading lokasi
  const {loadLoc,getMyGeolocation,akurasi,hasilGeoLokasi} = useGetMyGeolocation();
  
  useEffect(()=>{
    if (loadLoc) {
      setMytoastvisible(true);
      setMytoastmsg('Mengambil geolokasi anda');
    }
    else {
      setMytoastmsg(`Akurasi ${akurasi} m ulangi jika kurang akurat`);
      setTimeout(()=>setMytoastvisible(false),3000);
      onFormChange({ ...addressForm, geolokasi: hasilGeoLokasi });
    }
  },[loadLoc])
  
  
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex:1}}
      >
        <SafeScreen>
          <MyToast  
            message={mytoastMsg}
            isVisible={mytoastVisible}
            onHide={()=>{setMytoastvisible(false)}}
          />
          {/* HEADER */}
          <View className="px-6 py-5 border-b border-surface flex-row items-center justify-between">
            <Text className="text-primary text-xl font-bold">
              {isEditing ? "Ubah Alamat" : "Buat Alamat Baru"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#ff7f23" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="p-6">
              {/* LABEL INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Label Alamat</Text>
                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-lg"
                  placeholder="Rumah, Kantor, Kampus ..."
                  placeholderTextColor="#666"
                  value={addressForm.label}
                  onChangeText={(text) => onFormChange({ ...addressForm, label: text })}
                />
              </View>

              {/* NAME INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Nama Lengkap</Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-lg"
                  placeholder="Nama lengkap penerima .."
                  placeholderTextColor="#666"
                  value={addressForm.fullName}
                  onChangeText={(text) => onFormChange({ ...addressForm, fullName: text })}
                />
              </View>

              {/* Address Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Detail Alamat</Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="Nama jalan, Perum, RT/RW ..."
                  placeholderTextColor="#666"
                  value={addressForm.streetAddress}
                  onChangeText={(text) => onFormChange({ ...addressForm, streetAddress: text })}
                  multiline
                />
              </View>

              {/* City Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Kota Kabupaten</Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-lg"
                  placeholder="Kota / Kabupatan"
                  placeholderTextColor="#666"
                  value={addressForm.city}
                  onChangeText={(text) => onFormChange({ ...addressForm, city: text })}
                />
              </View>

              {/* ZIP Code Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Kode Pos</Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-xl"
                  placeholder="Kode Pos"
                  placeholderTextColor="#666"
                  value={addressForm.zipCode}
                  onChangeText={(text) => onFormChange({ ...addressForm, zipCode: text })}
                  keyboardType="numeric"
                />
              </View>

              {/* Phone Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Nomor Kontak</Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-xl"
                  placeholder="Kontak telpon / whatsapp"
                  placeholderTextColor="#666"
                  value={addressForm.phoneNumber}
                  onChangeText={(text) => onFormChange({ ...addressForm, phoneNumber: text })}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Geolokasi */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Geolokasi Alamat (copy paste)</Text>
                <TextInput
                  className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="contoh: -7.6015835537, 110.9682985)"
                  placeholderTextColor="#666"
                  value={addressForm.geolokasi}
                  onChangeText={(text) => onFormChange({ ...addressForm, geolokasi: text })}
                />
              </View>
              <Pressable
                onPress={getMyGeolocation}
                className="border-2 border-sky-700 bg-sky-900 active:bg-sky-700 
                  px-5 py-1 rounded-xl items-center justify-center flex-row"
              >
                <Ionicons name="locate-sharp" size={23} color="#FFFFFF" />
                <Text className="text-white font-semibold text-base ml-3">
                  Gunakan lokasi saya saat ini
                </Text>
              </Pressable>

              {/* Default Address Toggle */}
              <View className="bg-surface rounded-2xl pl-6 px-4 flex-row items-center justify-between my-5">
                <Text className="text-text-primary font-semibold">Setel sebagai alamat default</Text>
                <Switch
                  value={addressForm.isDefault}
                  onValueChange={(value) => onFormChange({ ...addressForm, isDefault: value })}
                  thumbColor={addressForm.isDefault ? "#ff7f23" : "white"}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className="bg-primary rounded-2xl py-5 items-center"
                activeOpacity={0.8}
                onPress={onSave}
                disabled={isAddingAddress || isUpdatingAddress}
              >
                {isAddingAddress || isUpdatingAddress ? (
                  <ActivityIndicator size="small" color="#121212" />
                ) : (
                  <Text className="text-background font-bold text-lg">
                    {isEditing ? "Simpan Perubahan" : "Tambah Alamat"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
          <ToastContainer maxVisible={3} />
        </SafeScreen>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddressFormModal;

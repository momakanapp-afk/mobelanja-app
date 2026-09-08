import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Alert } from "react-native";

function useProfileImage() {

  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState<string|null>(null);

  const takePhoto = async () => {
      setShowPopup(false); // Sembunyikan popup
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan izin kamera.');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

  // 2. Ambil Gambar dari Galeri
  const pickImageFromGallery = async () => {
    setShowPopup(false); // Sembunyikan popup
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan izin akses galeri.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return {
    image,
    pickImageFromGallery,
    takePhoto
  }
}

export default useProfileImage;
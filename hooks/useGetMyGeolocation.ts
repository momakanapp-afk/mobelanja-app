import * as Location from 'expo-location';
import { useRef, useState } from "react";
import { Alert } from "react-native";


export const useGetMyGeolocation = () => {

  const akurasiJarak = useRef('');
  const [loadLoc, setLoadLoc] = useState(false);
  const geoLokasiSaya = useRef('');
  // FUNGSI AMBIL GEOLOKASI
  const getMyGeolocation = async () => {
    setLoadLoc(true);
    try {
      // 1. Minta izin akses lokasi
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Izin untuk mengakses lokasi ditolak.');
        setLoadLoc(false);
        return;
      }
      // 2. Ambil koordinat posisi saat ini
      // Accuracy.Highest / Accuracy.Balanced bisa disesuaikan kebutuhan
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      geoLokasiSaya.current = location.coords.latitude.toFixed(8)+
        ', '+location.coords.longitude.toFixed(8);

      akurasiJarak.current = String(location.coords.accuracy?.toFixed(1));
    } catch (error:any) {
      Alert.alert('Error', 'Gagal mengambil lokasi:');
    } finally {
      setLoadLoc(false);
    }
  };

  return {
    getMyGeolocation,
    loadLoc,
    akurasi: akurasiJarak.current,
    hasilGeoLokasi: geoLokasiSaya.current
  }
}
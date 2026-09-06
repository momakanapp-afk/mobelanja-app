import { ClerkProvider, useAuth } from '@clerk/expo';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

// Wajib dipanggil untuk mengizinkan WebBrowser menangani callback auth secara otomatis
WebBrowser.maybeCompleteAuthSession();

// 1. Konfigurasi Token Cache menggunakan expo-secure-store
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const queryClient = new QueryClient();

// 2. Custom Hook Proteksi Rute dan Navigasi Otomatis
function useProtectedRoute() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Tahan navigasi selama Clerk belum selesai loading status autentikasi
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isSSOCallback = segments[0] === 'sso-callback';

    // SANGAT PENTING: Jangan lakukan pengalihan otomatis saat sedang berada di rute sso-callback
    // agar sso-callback.tsx selesai mengolah token OAuth terlebih dahulu.
    if (isSSOCallback) return;

    if (isSignedIn && inAuthGroup) {
      // Jika pengguna sudah login tetapi masih di area (auth), pindahkan ke (tabs)
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      // Jika belum login dan mencoba mengakses area proteksi, lempar kembali ke (auth)
      router.replace('/(auth)');
    }
  }, [isSignedIn, isLoaded, segments, router]);
}

// 3. Inner Layout Component
function InitialLayout() {
  const { isLoaded } = useAuth();

  // Panggil fungsi pengarah/proteksi rute
  useProtectedRoute();

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ 
        headerShown: false ,
        contentStyle: {backgroundColor: '#1B1818'}
      }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        {/* Mendaftarkan rute sso-callback secara eksplisit */}
        <Stack.Screen name="sso-callback" />
      </Stack>
    </ThemeProvider>
  );
}

// 4. Root Export (Membungkus dengan Provider)
export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <InitialLayout />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
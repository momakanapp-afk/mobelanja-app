import { useAuth } from "@clerk/expo";
import axios from "axios";
import { useEffect } from "react";

// Simulator hanya membaca IP PC dan tanpa https
const API_URL = "http://192.168.8.111:8114";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// useApi ini yang dipanggil untuk memunculkan kembalian Api
export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    // on every single req, we would like have an auth token so that our backend knows that we're authenticated
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        // we're including the auth token under the auth headers
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // cleanup: remove interceptor when component unmounts
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]); 
  // Selama token belum berubah, interceptor tidak akan dipanggil lagi

  return api;
};
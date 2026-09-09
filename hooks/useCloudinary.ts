import axios, { AxiosError } from 'axios';
import { useRef, useState } from 'react';

// Interface untuk Response Sukses dari Cloudinary API
export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}

export const useCloudinaryUpload = () => 
{
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const urlUploaded = useRef('');

  const uploadToCloudinary = async (fileUri: string): Promise<CloudinaryUploadResponse | null> => 
  {
    // Server Credential
    const cloudName = 'vts55zhr'
    const uploadPreset = 'preset-cB2z5t69bIDvWQX4tCbi'

    const resetUploadState = () => {
      setProgress(0);
      setStatusText('');
      setError(null);
      urlUploaded.current = ''
      setIsUploading(false)
    };

    // Reset state sebelum mengunggah
    resetUploadState();

    setIsUploading(true);

    // Ambil nama file & ekstensi mime type dari URI
    const filename = fileUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    
    // Type assertion untuk penyesuaian React Native FormData
    formData.append('file', {
      uri: fileUri,
      name: filename || 'upload.jpg',
      type: type,
    } as unknown as Blob);

    formData.append('upload_preset', uploadPreset);

    try {
      const response = await axios.post<CloudinaryUploadResponse>(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        { // Options
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              
              setProgress(percentCompleted);

              if (percentCompleted < 100) {
                setStatusText(`${percentCompleted}%`);
              } else {
                setStatusText('Menyimpan...');
              }
            }
          },
        }
      );
      urlUploaded.current = response.data.secure_url;
      return response.data;  // +++++++++++ RETURN RESULT DISINI
    } 
    catch (err) {
      let errorMessage = 'Terjadi kesalahan saat mengunggah.';
      if (err instanceof AxiosError && err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setStatusText('Gagal mengunggah gambar.');
      return null;
    } 
    finally {
      resetUploadState()
    }
  };


  return {
    uploadToCloudinary,
    progress,
    statusText,
    isUploading,
    urlUpl: urlUploaded.current,
    error,
  };
};
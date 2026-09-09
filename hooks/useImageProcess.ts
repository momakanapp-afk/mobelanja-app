import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useCallback, useState } from 'react';
import { Image } from 'react-native';

interface ImageSize {
  width: number;
  height: number;
}

interface ProcessImageOptions {
  maxDimension?: number;
  compress?: number; // 0.0 - 1.0
  format?: SaveFormat;
}

interface ProcessImageReturn {
  uri: string;
  width?: number;
  height?: number;
  isResized: boolean;
}

export const useImageProcess = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const processImage = useCallback(
    async (
      uri: string,
      options: ProcessImageOptions = {}
    ): Promise<ProcessImageReturn> => {
      const {
        maxDimension = 2000,
        compress = 0.8,
        format = SaveFormat.JPEG,
      } = options;

      setIsProcessing(true);
      setError(null);

      try {
        // 1. Ambil dimensi asli gambar
        const { width, height } = await new Promise<ImageSize>((resolve, reject) => {
          Image.getSize(
            uri,
            (w, h) => resolve({ width: w, height: h }),
            (err) => reject(err)
          );
        });

        // 2. Jika dimensi melebihi batas, lakukan resize via API Manipulator Context
        if (width > maxDimension || height > maxDimension) {
          let newWidth: number;
          let newHeight: number;

          if (width > height) {
            newWidth = maxDimension;
            newHeight = Math.round((height * maxDimension) / width);
          } else {
            newHeight = maxDimension;
            newWidth = Math.round((width * maxDimension) / height);
          }

          // Inisialisasi manipulator konteks
          const context = ImageManipulator.manipulate(uri);
          
          // Lakukan aksi resize
          context.resize({ width: newWidth, height: newHeight });

          // Render/simpan hasil manipulasi
          const result = await context.renderAsync();
          const savedResult = await result.saveAsync({ compress, format });

          return {
            uri: savedResult.uri,
            width: savedResult.width,
            height: savedResult.height,
            isResized: true,
          };
        }

        // 3. Jika tidak melebihi batas, kembalikan gambar asli
        return {
          uri,
          width,
          height,
          isResized: false,
        };
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        throw errorObj;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return { processImage, isProcessing, error };
};
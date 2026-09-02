import { useEffect, useState } from 'react';

function useDebounce(value:string, delay = 500) 
{
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timer untuk memperbarui nilai setelah 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer jika nilai 'value' berubah sebelum delay selesai (user masih mengetik)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
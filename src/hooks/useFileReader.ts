import { useState, useCallback } from 'react';

// 10MB file size limit
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function useFileReader(): [(file: File) => Promise<string>, boolean] {
  const [loading, setLoading] = useState(false);

  const readFile = useCallback(async (file: File): Promise<string> => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    setLoading(true);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setLoading(false);
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = (e) => {
        setLoading(false);
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  }, []);

  return [readFile, loading];
}

export default useFileReader;
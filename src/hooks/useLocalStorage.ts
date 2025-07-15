import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Error reading localStorage key", key, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn("Error writing to localStorage", key, error);
    }
  }, [key, storedValue]);

  const reset=()=>{
    setStoredValue(initialValue);
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Error removing from localStorage", key, error);
    }   
  }

  return [storedValue, setStoredValue, reset] as const;
}

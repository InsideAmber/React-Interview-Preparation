import { useEffect, useState } from "react";

/**
 * Debounces a value by delaying updates until the delay has passed
 * without the value changing.
 *
 * @param value - The value to debounce (e.g., input)
 * @param delay - Time in ms to wait before updating
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // clean up old timer
  }, [value, delay]);

  return debouncedValue;
}

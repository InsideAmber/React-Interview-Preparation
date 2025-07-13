import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to throttle a value — updates only once every `delay` ms,
 * even if the original value changes more frequently.
 * example - if we want to update something on scroll for every 1000ms
 * but the scroll event fires every 10ms, this will ensure we only update once every 1000ms.
 */
export function useThrottle<T>(value: T, delay: number): T {
  // Store the throttled value that will be returned to the component
  const [throttledValue, setThrottledValue] = useState(value);

  // Track the last time the throttled value was updated (timestamp)
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now(); // Get current timestamp

    // ✅ If enough time has passed since the last update, update immediately
    if (now - lastExecuted.current >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
    }

    // ⏳ If not enough time has passed, set a timeout to update later
    const handler = setTimeout(() => {
      if (Date.now() - lastExecuted.current >= delay) {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }
    }, delay - (now - lastExecuted.current)); // Remaining time until next allowed update

    // 🧹 Cleanup the timeout if value changes before timeout executes
    return () => clearTimeout(handler);
  }, [value, delay]); // Run whenever the value or delay changes

  // 🚀 Return the throttled value
  return throttledValue;
}

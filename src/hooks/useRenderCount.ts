import { useRef, useEffect } from "react";

/**
 * Tracks how many times a component has rendered.
 * Logs count to the console with the given label.
 */
export const useRenderCount = (name: string) => {
  const renderCount = useRef(1);

  useEffect(() => {
    console.log(`🔁 ${name} rendered ${renderCount.current++} times`);
  });
};

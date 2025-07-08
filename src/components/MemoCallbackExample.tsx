import { useState, useMemo, useCallback } from "react";

function MemoCallbackExample() {
  const [count, setCount] = useState(0);
  const [numbers] = useState([10, 20, 30, 40, 50]);

  // 🔹 useMemo: Expensive calculation - sum of even numbers
  const evenSum = useMemo(() => {
    console.log("Calculating even number sum...");
    // Filters even numbers → [10, 20, 30, 40, 50] (all are even)
    return numbers.filter(n => n % 2 === 0)
    // Adds them: (((((10 + 20) + 30) + 40) + 50)) = 150
    .reduce((a, b) => a + b, 0);
  }, [numbers]);

  // 🔹 useCallback: Function that increments count
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: "1rem" }}>
      <h2>useMemo and useCallback Example</h2>

      <p>Numbers: {numbers.join(", ")}</p>
      <p><strong>Sum of Even Numbers:</strong> {evenSum}</p>

      <p><strong>Count:</strong> {count}</p>
      <button onClick={increment}>Increment Count</button>
    </div>
  );
}

export default MemoCallbackExample;


// Click the "Increment Count" button.

// The count will increase, but Calculating even number sum... will not log again, 
// because numbers didn't change.

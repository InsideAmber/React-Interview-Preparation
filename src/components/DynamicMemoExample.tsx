import { useState, useMemo } from "react";

function DynamicMemoExample() {
  const [numbers, setNumbers] = useState([10, 20, 30, 40, 50]);
  const [count, setCount] = useState(0);

  // Memoize sum of even numbers
  const evenSum = useMemo(() => {
    console.log("🔁 Calculating even number sum...");
    return numbers.filter(n => n % 2 === 0).reduce((a, b) => a + b, 0);
  }, [numbers]); // Memoized based on `numbers`

  // Add a new number to the array
  const addNumber = () => {
    const random = Math.floor(Math.random() * 100);
    setNumbers(prev => [...prev, random]);
  };

  // Just to trigger re-render without changing `numbers`
  const increment = () => setCount(prev => prev + 1);

  return (
    <div style={{ fontFamily: "Arial", padding: "1rem" }}>
      <h2>Dynamic useMemo Example</h2>

      <p><strong>Numbers:</strong> {numbers.join(", ")}</p>
      <p><strong>Sum of Even Numbers:</strong> {evenSum}</p>
      <p><strong>Re-render Count:</strong> {count}</p>

      <button onClick={addNumber}>➕ Add Random Number</button>
      <button onClick={increment}>🔁 Just Re-render</button>
    </div>
  );
}

export default DynamicMemoExample;

/**
 * useMemo memoizes the return value of a computation. In this example, 
 * it prevents recalculating the sum of even numbers unless numbers changes. 
 * If we trigger re-renders via other state (like count), React skips the memoized block, 
 * improving performance — especially if the calculation is expensive.
 */
import { useState, useMemo } from "react";

function DynamicMemoExample() {
  const [numbers, setNumbers] = useState([10, 20, 30, 40, 50]);
  const [count, setCount] = useState(0);

  // Memoize sum of even numbers
  const evenSum = useMemo(() => {
    console.log("🔁 Calculating even number sum...");
    return numbers.filter((n) => n % 2 === 0).reduce((a, b) => a + b, 0);
  }, [numbers]);

  const addNumber = () => {
    const random = Math.floor(Math.random() * 100);
    setNumbers((prev) => [...prev, random]);
  };

  const increment = () => setCount((prev) => prev + 1);

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-indigo-600">Dynamic useMemo Example</h2>

      <p><span className="font-semibold text-gray-700">Numbers:</span> {numbers.join(", ")}</p>
      <p><span className="font-semibold text-gray-700">Sum of Even Numbers:</span> {evenSum}</p>
      <p><span className="font-semibold text-gray-700">Re-render Count:</span> {count}</p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={addNumber}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          ➕ Add Random Number
        </button>
        <button
          onClick={increment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          🔁 Just Re-render
        </button>
      </div>
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
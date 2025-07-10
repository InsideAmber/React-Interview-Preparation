import { useState, useMemo, useCallback } from "react";

function MemoCallbackExample() {
  const [count, setCount] = useState(0);
  const [numbers] = useState([10, 20, 30, 40, 50]);

  // 🔹 useMemo: Expensive calculation - sum of even numbers
  const evenSum = useMemo(() => {
    console.log("Calculating even number sum inside...");
    return numbers
      .filter((n) => n % 2 === 0)
      .reduce((a, b) => a + b, 0);
  }, [numbers]);

  // 🔹 useCallback: Function that increments count
  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  console.log("Calculating even number sum outside...");

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-purple-600">
        useMemo and useCallback Example
      </h2>

      <p>
        <span className="font-medium text-gray-700">Numbers:</span>{" "}
        {numbers.join(", ")}
      </p>

      <p>
        <span className="font-medium text-gray-700">Sum of Even Numbers:</span>{" "}
        {evenSum}
      </p>

      <p>
        <span className="font-medium text-gray-700">Count:</span> {count}
      </p>

      <button
        onClick={increment}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
      >
        🔼 Increment Count
      </button>
    </div>
  );
}

export default MemoCallbackExample;


/**
It prevent only inside useMemo function to be called again when the component re-renders.
The evenSum calculation is memoized, so it only recalculates when `numbers` changes.
when we remove the useMemo then it will recalculate every time the component re-renders.
 */



import { useCallback, useState } from "react";
import ChildCounter from "./ChildCounter";

const ParentCounter = () => {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(false);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  console.log("🔁 Re-rendering ParentCounter");

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-indigo-600">React.memo Example</h2>

      <ChildCounter count={count} onClick={increment} />

      <button
        onClick={() => setOtherState(!otherState)}
        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
      >
        🔁 Re-render Parent Only
      </button>
    </div>
  );
};

export default ParentCounter;

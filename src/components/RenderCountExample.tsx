import { useState } from "react";
import { useRenderCount } from "../hooks/useRenderCount";

const RenderCountExample = () => {
  const [count, setCount] = useState(0);

  // 👇 Track render count of this component
  useRenderCount("RenderCountExample");

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold text-emerald-600">useRenderCount Hook Demo</h2>
      <p className="text-gray-700">Count: {count}</p>
      <button
        onClick={() => setCount((prev) => prev + 1)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
      >
        🔁 Increment & Re-render
      </button>
    </div>
  );
};

export default RenderCountExample;

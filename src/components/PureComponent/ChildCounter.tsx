import React from "react";

interface Props {
  count: number;
  onClick: () => void;
}

const ChildCounter: React.FC<Props> = ({ count, onClick }) => {
  console.log("🔁 Re-rendering ChildCounter");

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h3 className="text-lg font-semibold text-blue-600">Child Counter</h3>
      <p className="mb-2">Count: {count}</p>
      <button
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        Increment
      </button>
    </div>
  );
};

// ✅ Memoize the child to avoid re-renders unless props change
export default React.memo(ChildCounter);

/**
PureComponent is the class-based equivalent of React.memo.
It performs a shallow comparison of props and state. If nothing changed, it skips rendering.

When to Use?

 Use either when:
 - The component re-renders often with same props
 - Rendering is expensive
 - You want to boost performance in large lists or UIs
 */
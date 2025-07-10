import { useRef } from "react";

const FocusInputWithUseref = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-teal-600">useRef: Focus Input Example</h2>

      <input
        ref={inputRef}
        type="text"
        placeholder="Enter something..."
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
      />

      <button
        onClick={focusInput}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition"
      >
        🎯 Focus Input
      </button>
    </div>
  );
};

export default FocusInputWithUseref;

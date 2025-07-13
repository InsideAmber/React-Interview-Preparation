import React, { useState, useEffect } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { useThrottle } from "../../../hooks/useThrottle";

const DebounceExample: React.FC = () => {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 1000);
  const throttled = useThrottle(search, 1000);

  // 🔁 Log live input changes immediately
  useEffect(() => {
    console.log("🔤 Live input:", search);
  }, [search]);

  // 🕐 Log debounced output (after delay)
  useEffect(() => {
    console.log("🕑 Debounced:", Date.now(), debouncedSearch);
  }, [debouncedSearch]);

  // ⏱️ Log throttled output (once every interval)
  useEffect(() => {
    console.log("⏳ Throttled:", Date.now(), throttled);
  }, [throttled]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-2">🔍 Debounce vs Throttle Example</h1>
      <p className="text-sm text-gray-500 mb-4">
        ℹ️ Open the browser console to see how <code>debounce</code> and <code>throttle</code> differ in timing.
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Type to debounce..."
        className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-4 space-y-2">
        <p className="text-gray-700">
          <strong>Live Input:</strong> {search}
        </p>
        <p className="text-blue-600">
          <strong>Debounced Value (1s):</strong> {debouncedSearch}
        </p>
        <p className="text-purple-600">
          <strong>Throttled Value (1s):</strong> {throttled}
        </p>
      </div>
    </div>
  );
};

export default DebounceExample;


/**
 * This component demonstrates the difference between debouncing and throttling
 
| Concept  | Debounce                             | Throttle                                |
| -------- | ------------------------------------ | --------------------------------------- |
| Purpose  | Waits until **user stops typing**    | Executes at most **once every X ms**    |
| When     | Typing search input, form validation | Scroll handler, resize, mouse movement  |
| Behavior | Fires **only once** after delay      | Fires **periodically** during the event |
| Example  | Google Search auto-suggest           | Infinite scroll on scroll event         |

Throttle logs quickly and periodically
Debounce logs only once you stop typing

Use Case of throttle: Detect scroll direction to hide/show navbar.

 */

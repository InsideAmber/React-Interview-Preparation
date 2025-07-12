import React from "react";

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<Props> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-red-100 border border-red-400 rounded">
      <h2 className="text-xl font-bold text-red-700">🚨 Something went wrong</h2>
      <p className="text-red-600 mt-2">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        🔄 Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;

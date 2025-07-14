import { useEffect } from "react";
import { useUserStore } from "../../../zustand/userStore";
import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard";
import { Copy } from "lucide-react";


const UsersPageZustand = () => {
  const { users, loading, error, fetchUsers } = useUserStore();
  const { copy, copiedText } = useCopyToClipboard();


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading)
    return (
      <div className="text-center py-6 text-gray-600 font-medium">
        Loading users...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-6 text-red-600 font-medium">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-green-600 mb-4">
        User List (Zustand)
      </h2>
      <ul className="space-y-2">
        {users.map((user) => (
        <li
        key={user.id}
        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition flex justify-between items-center group"
        >
        <span>{user.name}</span>

        {copiedText != user.name && <button
        onClick={() => copy(user.name)}
        className="opacity-0 group-hover:opacity-100 transition text-gray-500 hover:text-green-600"
        title="Copy name"
        >
        <Copy size={16} />
        </button>}

        {copiedText === user.name && (
        <span className="ml-2 text-sm text-green-500">Copied!</span>
        )}
        </li>

        ))}
      </ul>
    </div>
  );
};

export default UsersPageZustand;


/**
 🔍 Comparison Table

Feature    |	Redux Toolkit             | 	 Zustand
Boilerplate 	Moderate	                     Minimal
Async support	Built-in via createAsyncThunk	 Manual via async/await
Devtools	    Excellent support	             Available with middleware
TypeScript	  Excellent with createSlice	   Simple and clean with create
Scaling	      Great for large apps	         Best for medium/small apps
 */
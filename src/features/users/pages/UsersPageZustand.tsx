import { useEffect } from "react";
import { useUserStore } from "../../../zustand/userStore";

const UsersPageZustand = () => {
  const { users, loading, error, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default UsersPageZustand;

/**
 🔍 Comparison Table

Feature    |	Redux Toolkit             | 	 Zustand
Boilerplate 	Moderate	                     Minimal
Async support	Built-in via createAsyncThunk	 Manual via async/await
Devtools	    Excellent support	             Available with middleware
TypeScript	    Excellent with createSlice	     Simple and clean with create
Scaling	        Great for large apps	         Best for medium/small apps
 */
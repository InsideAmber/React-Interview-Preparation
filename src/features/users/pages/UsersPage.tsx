import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { fetchUsers } from "../usersSlice";

const UsersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

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
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">User List (Redux)</h2>
      <ul className="space-y-2">
        {data.map((user) => (
          <li
            key={user.id}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;

/**
[UI] → dispatch(fetchUsers())
     ↓
[Thunk Middleware] → async call (API)
     ↓
[Reducers (in Slice)] → handle pending/fulfilled/rejected
     ↓
[Store State Updated]
     ↓
[UI Component Re-renders via useSelector]

In Redux Toolkit, the flow starts from the UI dispatching an action — usually through an async thunk. 
The store passes the action to the corresponding reducer logic defined in a slice. 
Based on the action type (pending/fulfilled/rejected), state updates are handled immutably. 
Finally, subscribed React components automatically re-render with the updated state via useSelector.

| Concept      | Role                                                           |
| ------------ | -------------------------------------------------------------- |
| **Store**    | Holds the entire app state                                     |
| **Slice**    | A piece of the state + reducers created via `createSlice()`    |
| **Reducer**  | Pure functions that describe how state changes                 |
| **Action**   | Payloads of information sent via `dispatch()`                  |
| **Dispatch** | Sends an action to update the store                            |
| **Selector** | Function to get data from state                                |
| **Thunk**    | Async function (via `createAsyncThunk`) to handle side effects |

 */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { fetchUsers } from '../usersSlice';

const UsersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
     <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

export default UsersPage


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
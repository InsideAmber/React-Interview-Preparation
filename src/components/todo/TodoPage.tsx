import { useReducer, useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Action =
  | { type: "ADD_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: number }
  | { type: "DELETE_SELECTED" }
  | { type: "SELECT_ALL"; payload: boolean };

const todoReducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        { id: Date.now(), text: action.payload, completed: false },
      ];
    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case "DELETE_SELECTED":
      return state.filter((todo) => !todo.completed);
    case "SELECT_ALL":
      return state.map((todo) => ({ ...todo, completed: action.payload }));
    default:
      return state;
  }
};

const TodoPage = () => {
  const [storedTodos, setStoredTodos] = useLocalStorage<Todo[]>("todos", []);
  const [todos, dispatch] = useReducer(todoReducer, storedTodos);

  useEffect(() => {
    setStoredTodos(todos);
  }, [todos]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.todo as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      dispatch({ type: "ADD_TODO", payload: value });
      input.value = "";
    }
  };

  const areAllSelected = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Todo List (useReducer + localStorage)</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          name="todo"
          placeholder="Add a new todo..."
          className="flex-grow px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {todos.length > 0 && (
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={areAllSelected}
              onChange={(e) => dispatch({ type: "SELECT_ALL", payload: e.target.checked })}
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">Select All</span>
          </label>

          <button
            onClick={() => dispatch({ type: "DELETE_SELECTED" })}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete Selected
          </button>
        </div>
      )}

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            <span
              onClick={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })}
              className={`cursor-pointer flex-grow select-none text-left ${
                todo.completed ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {todo.text}
            </span>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })}
              className="ml-4 cursor-pointer"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;

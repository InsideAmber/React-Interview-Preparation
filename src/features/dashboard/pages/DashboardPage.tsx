import { useNavigate } from "react-router-dom";
import TodoPage from "../../../components/todo/TodoPage";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [_, __, reset] = useLocalStorage<string>("token", "");

  const handleLogout = () => {
    reset(); // remove mock token
    navigate("/login"); // redirect to login
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* 🔹 Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-700">📊 Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🔓 Logout
        </button>
      </div>

      <p className="text-gray-600">This is a protected route. You can manage todos below.</p>

      {/* 🔸 Embedded TodoPage */}
      <TodoPage />
    </div>
  );
};

export default DashboardPage;

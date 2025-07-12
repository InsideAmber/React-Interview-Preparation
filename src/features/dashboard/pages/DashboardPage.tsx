import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove mock token
    navigate("/login"); // redirect to login
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">📊 Dashboard</h1>
      <p className="text-gray-600">This is a protected route.</p>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        🔓 Logout
      </button>
    </div>
  );
};

export default DashboardPage;

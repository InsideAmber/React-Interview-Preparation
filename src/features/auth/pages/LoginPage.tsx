import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleLogin = () => {
    // Simulate login: set token in localStorage
    localStorage.setItem("token", "mock-token");
    navigate(from, { replace: true });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 bg-white rounded shadow-md text-center space-y-4">
        <h2 className="text-2xl font-bold text-blue-600">Login</h2>
        <p className="text-gray-600">You must log in to access the dashboard.</p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔐 Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

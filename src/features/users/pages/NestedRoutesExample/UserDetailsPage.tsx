import { useParams, Link, Outlet } from "react-router-dom";

const UserDetailsPage = () => {
  const { userId } = useParams();

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">👤 User Detail for ID: {userId}</h2>

      <Link
        to="settings"
        className="text-indigo-600 hover:underline block"
      >
        ⚙️ Go to Settings
      </Link>

      {/* 👇 Nested route will render here */}
      <Outlet />
    </div>
  );
};

export default UserDetailsPage;

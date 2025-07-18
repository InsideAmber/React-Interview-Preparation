import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center text-red-600">
      <div className="text-2xl font-bold mb-4">🚫 404 - Page Not Found</div>
      <Link
        to={ROUTES.HOME}
        className="text-blue-500 underline hover:text-blue-700 transition"
      >
        ← Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;

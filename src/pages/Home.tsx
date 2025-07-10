import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const Home: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <Link to={ROUTES.USER_PROFILE} className="text-blue-600 underline">
        Go to User Profile (Lazy Loaded)
      </Link>
    </div>
  );
};

export default Home;

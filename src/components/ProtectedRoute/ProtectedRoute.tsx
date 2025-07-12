import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Simulate auth check (you can connect Zustand/Redux later)
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

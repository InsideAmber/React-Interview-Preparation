import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Loader from "../pages/Loader";
import { ROUTES } from "../constants/routes";
import Navbar from "../components/Navbar/Navbar";
// Lazy load the user profile page
const UserProfile = lazy(() =>import("../features/users/pages/UserProfile"));

// Lazy load other components
const UserDetailsPage = lazy(() => import("../features/users/pages/NestedRoutesExample/UserDetailsPage"));
const UsersListPage = lazy(() => import("../features/users/pages/NestedRoutesExample/UsersListPage"));
const UserSettingsPage = lazy(() => import("../features/users/pages/NestedRoutesExample/UserSettingsPage"));
const DashboardPage = lazy(() =>
  import("../features/dashboard/pages/DashboardPage")
);

import DynamicMemoExample from '../components/DynamicMemoExample'
import FocusInputWithUseref from '../components/FocusInputWithUseref'
import MemoCallbackExample from '../components/MemoCallbackExample'
import UsersPage from '../features/users/pages/UsersPage'
import UsersPageZustand from '../features/users/pages/UsersPageZustand'
import ParentCounter from "../components/PureComponent/ParentCounter";
import RenderCountExample from "../components/RenderCountExample";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import NotFound from "../pages/NotFound";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Navbar/>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.USER_PROFILE} element={<UserProfile />} />

          <Route path={ROUTES.MEMO_CALLBACK} element={<MemoCallbackExample />} />
          <Route path={ROUTES.DYNAMIC_MEMO} element={<DynamicMemoExample />} />
          <Route path={ROUTES.USE_REF_FOCUS} element={<FocusInputWithUseref />} />
          <Route path={ROUTES.USERS_REDUX} element={<UsersPage />} />
          <Route path={ROUTES.USERS_ZUSTAND} element={<UsersPageZustand />} />
          <Route path={ROUTES.PURE_COMPONENT} element={<ParentCounter />} />
          <Route path={ROUTES.RENDER_COUNT} element={<RenderCountExample />} />

          {/* Users Route with Nested Dynamic Routing */}
          <Route path={ROUTES.USERS_LIST} element={<UsersListPage />} />
          <Route path="/users/:userId" element={<UserDetailsPage />}>
            {/* 🔁 Nested Route */}
            <Route path="settings" element={<UserSettingsPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />

          {/* Protected route */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound/>} />
          
          {/* Fallback route */}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;

import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Loader from "../pages/Loader";
import { ROUTES } from "../constants/routes";
import Navbar from "../components/Navbar/Navbar";
// Lazy load the user profile page
const UserProfile = lazy(() =>import("../features/users/pages/UserProfile"));

import DynamicMemoExample from '../components/DynamicMemoExample'
import FocusInputWithUseref from '../components/FocusInputWithUseref'
import MemoCallbackExample from '../components/MemoCallbackExample'
import UsersPage from '../features/users/pages/UsersPage'
import UsersPageZustand from '../features/users/pages/UsersPageZustand'
import ParentCounter from "../components/PureComponent/ParentCounter";

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

        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;

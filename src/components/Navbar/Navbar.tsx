import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const NavBar: React.FC = () => {
  const links = [
    { path: ROUTES.HOME, label: "Home" },
    { path: ROUTES.USER_PROFILE, label: "User Profile" },
    { path: ROUTES.MEMO_CALLBACK, label: "Memo Callback" },
    { path: ROUTES.DYNAMIC_MEMO, label: "Dynamic Memo" },
    { path: ROUTES.USE_REF_FOCUS, label: "useRef Focus" },
    { path: ROUTES.USERS_REDUX, label: "Users Redux" },
    { path: ROUTES.USERS_ZUSTAND, label: "Users Zustand" },
    { path: ROUTES.PURE_COMPONENT, label: "Pure Component" },

  ];

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md">
      <ul className="flex flex-wrap gap-4 text-sm font-medium">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `hover:text-yellow-400 transition ${
                  isActive ? "text-yellow-300 underline" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;

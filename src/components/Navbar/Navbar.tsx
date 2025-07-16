import { NavLink, Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import NavigationsDropdown from "../ExtraNavigations/NavigationsDropdown";
import { Atom } from "lucide-react";

const NavBar: React.FC = () => {
  const links = [
    { path: ROUTES.HOME, label: "Home" },
    { path: ROUTES.USER_PROFILE, label: "User Profile" },
    { path: ROUTES.MEMO_CALLBACK, label: "Memo Callback" },
    { path: ROUTES.DYNAMIC_MEMO, label: "Dynamic Memo" },
    { path: ROUTES.USE_REF_FOCUS, label: "useRef Focus" },
    { path: ROUTES.USERS_REDUX, label: "Users Redux" },
    { path: ROUTES.USERS_ZUSTAND, label: "Users Zustand" },
  ];

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left side branding */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2 mr-6 hover:opacity-90">
          <Atom size={24} className="text-cyan-400" />
          <span className="text-xl font-bold text-white tracking-wide">
            ReactifyPro
          </span>
        </Link>

        {/* Center nav links */}
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

        {/* Right side dropdown */}
        <div className="ml-auto">
          <NavigationsDropdown />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

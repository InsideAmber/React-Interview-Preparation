import { useRef, useState} from "react";
import {
  ChevronsRight,
  Droplet,
  BarChart2,
  Users,
  LayoutDashboard,
  Timer
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const extraLinks = [
  { path: ROUTES.PURE_COMPONENT, label: "Pure Component", icon: <Droplet size={18} /> },
  { path: ROUTES.RENDER_COUNT, label: "Render Count Hooks", icon: <BarChart2 size={18} /> },
  { path: ROUTES.USERS_LIST, label: "Users List", icon: <Users size={18} /> },
  { path: ROUTES.DASHBOARD, label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { path: ROUTES.DEBOUNCE_EXAMPLE, label: "Debounce Example", icon: <Timer size={18} /> },
];

const NavigationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicked outside
 useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div className="relative" ref={ref}>
     <button
     className="flex items-center gap-2 px-2 py-2 rounded-full hover:bg-gray-700 transition cursor-pointer"
     onClick={() => setIsOpen(!isOpen)}
    >
    <ChevronsRight size={18} className="text-white" />
    </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {extraLinks.map((eLinks, index) => (
            <Link
              key={index}
              to={eLinks.path}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-800 dark:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              {eLinks.icon}
              {eLinks.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavigationsDropdown;

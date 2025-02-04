import { Home, Search, Compass, MessageSquare, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Update the import path

const Sidebar = ({ isExpanded }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define your navigation items with their paths
  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
  ];

  const checkActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={`fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-white text-gray-900 shadow-md transition-all duration-300 ${
        isExpanded ? "w-[240px]" : "w-[70px]"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar content */}
        <div className="flex flex-col space-y-6 mt-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = checkActive(item.path);
            
            return (
              <div
                key={index}
                className={`flex items-center px-4 ${
                  isExpanded ? "justify-start" : "justify-center"
                } cursor-pointer rounded mx-2 p-2 transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => navigate(item.path)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && navigate(item.path)}
              >
                <Icon size={24} className={isActive ? "text-current" : "text-gray-900"} />
                {isExpanded && <span className="ml-4">{item.label}</span>}
              </div>
            );
          })}
        </div>

        {/* Logout button fixed at the bottom */}
        <div className="mt-auto mb-4">
          <div
            className={`flex items-center px-4 ${
              isExpanded ? "justify-start" : "justify-center"
            } cursor-pointer hover:bg-gray-100 rounded mx-2 p-2 transition-colors`}
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleLogout()}
          >
            <LogOut size={24} className="text-gray-900" />
            {isExpanded && <span className="ml-4">Logout</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
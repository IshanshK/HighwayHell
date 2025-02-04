import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import NotificationDropdown from "../../components/NotificationDropdown/NotificationDropdown";

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const isLandingPage = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // Profile navigation handler
  const handleProfileNavigation = () => {
    if (currentUser?._id) {
      navigate(`/profile/${currentUser._id}`);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Navbar */}
      {!isLandingPage && !isAuthPage && (
        <nav className="fixed top-0 left-0 w-full h-[60px] flex items-center justify-between px-4 bg-white shadow-md z-50">
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle */}
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <img
              src="/images/logo.png"
              alt="HighwayHell Logo"
              className="w-12 h-12 rounded-full"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              HighwayHell
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Dropdown */}
            <NotificationDropdown />

            {/* Profile Avatar */}
            {currentUser && (
              <img
                src={currentUser.profileImage || "/images/default-profile.jpeg"}
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover cursor-pointer transition hover:scale-105"
                onClick={handleProfileNavigation}
              />
            )}
          </div>
        </nav>
      )}

      {/* Sidebar */}
      {!isLandingPage && !isAuthPage && <Sidebar isExpanded={isSidebarExpanded} />}

      {/* Page Content */}
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          !isLandingPage && !isAuthPage ? "mt-[60px]" : "mt-0"
        } ${isSidebarExpanded ? "ml-[240px]" : isLandingPage ? "ml-0" : "ml-[70px]"}`}
      >
        <div>{children}</div>
      </main>
    </div>
  );
};

export default PageLayout;
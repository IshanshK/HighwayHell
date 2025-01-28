import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import Sidebar from "../../components/Sidebar"; // Import the Sidebar component

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Check if the current route is exactly the landing page ("/")
  const isLandingPage = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Navbar */}
      {!isLandingPage && !isAuthPage && (
        <div className="fixed top-0 left-0 w-full h-[60px] flex items-center justify-between px-4 bg-white z-50 ">
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle */}
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            {/* Logo */}
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-12 h-12 rounded-full"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              HighwayHell
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell size={28} />
            </button>

            {/* Profile Avatar */}
            <img
              src="/images/shlokimg.png"
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Sidebar */}
      {!isLandingPage && !isAuthPage && (
        <Sidebar isExpanded={isSidebarExpanded} />
      )}

      {/* Page Content */}
      <div
        className={`flex-1 overflow-auto ${
          !isLandingPage && !isAuthPage ? "mt-[60px]" : "mt-0"
        } ${isSidebarExpanded ? "ml-[240px]" : isLandingPage ? "ml-0" : "ml-[70px]"} `}
      >
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
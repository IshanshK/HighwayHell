import { Home, Search, Compass, MessageSquare, LogOut } from "lucide-react";
const Sidebar = ({ isExpanded }) => {
  return (
    <div
      className={`fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-white text-gray-900 shadow-md transition-all duration-300 ${
        isExpanded ? "w-[240px]" : "w-[70px]"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar content */}
        <div className="flex flex-col space-y-6 mt-4">
          <div
            className={`flex items-center px-4 ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
          >
            <Home size={24} className="text-gray-900" />
            {isExpanded && <span className="ml-4">Home</span>}
          </div>

          <div
            className={`flex items-center px-4 ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
          >
            <Search size={24} className="text-gray-900" />
            {isExpanded && <span className="ml-4">Search</span>}
          </div>

          <div
            className={`flex items-center px-4 ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
          >
            <Compass size={24} className="text-gray-900" />
            {isExpanded && <span className="ml-4">Explore</span>}
          </div>

          <div
            className={`flex items-center px-4 ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
          >
            <MessageSquare size={24} className="text-gray-900" />
            {isExpanded && <span className="ml-4">Messages</span>}
          </div>
        </div>

        {/* Logout button fixed at the bottom */}
        <div className="mt-auto mb-4">
          <div
            className={`flex items-center px-4 ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
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
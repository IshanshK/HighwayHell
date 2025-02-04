import React, { useState } from "react";
import { Bell } from "lucide-react";
import useNotifications from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
const NotificationDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { notifications, loading, acceptTrip, denyTrip } = useNotifications();
  const [activeTab, setActiveTab] = useState("Trip Invites");
  const navigate = useNavigate(); 
  const handleToggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleAccept = async (notificationId, tripId) => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      console.log("User's Location:", latitude, longitude);

      // You can send the location to the backend if needed
      await fetch(`http://localhost:3001/trip/saveUserLocation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tripId,
          latitude,
          longitude,
        }),
      });

      // Accept the trip and then redirect
      await acceptTrip(notificationId);
      navigate(`/trip/${tripId}`);
    },
    (error) => {
      console.error("Error getting location:", error);
    }
  );
};
  const renderNotifications = () =>
    notifications
      .filter((notif) =>
        activeTab === "Trip Invites"
          ? notif.title.toLowerCase().includes("new trip request")
          : !notif.title.toLowerCase().includes("new trip request")
      )
      .map((notification) => {
        const [tripName, adminName, tripDate] = notification.message.split("|");
        const tripId = notification.actionLink.split("/").pop(); // Extract trip ID
        return (
          <div
            key={notification._id}
            className="bg-white p-4 rounded-md shadow-md mb-3"
          >
            <div>
              <p className="font-semibold text-gray-800">Trip: {tripName}</p>
              <p className="text-gray-600">Admin: {adminName}</p>
              <small className="text-gray-500">
                Created on: {new Date(tripDate).toLocaleString()}
              </small>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                className="bg-green-500 text-white text-sm px-4 py-1 rounded-full hover:opacity-90"
               onClick={() => handleAccept(notification._id, tripId)}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white text-sm px-4 py-1 rounded-full hover:opacity-90"
                onClick={() => denyTrip(notification._id, notification.actionLink)}
              >
                Deny
              </button>
            </div>
          </div>
        );
      });

  return (
    <div className="relative">
      <button
        onClick={handleToggleDropdown}
        className="p-2 rounded-md hover:bg-gray-100"
      >
        <Bell size={28} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl rounded-xl z-50">
          <div className="flex items-center px-4 py-3 space-x-6">
            <button
              className={`text-sm font-medium ${
                activeTab === "Trip Invites"
                  ? "border-b-2 border-white"
                  : "text-gray-300"
              }`}
              onClick={() => setActiveTab("Trip Invites")}
            >
              Trip Invites
            </button>
            <button
              className={`text-sm font-medium ${
                activeTab === "Friend Requests"
                  ? "border-b-2 border-white"
                  : "text-gray-300"
              }`}
              onClick={() => setActiveTab("Friend Requests")}
            >
              Friend Requests
            </button>
          </div>

          <div className="bg-white p-4 rounded-b-xl text-gray-800">
            {loading ? <p>Loading...</p> : renderNotifications()}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

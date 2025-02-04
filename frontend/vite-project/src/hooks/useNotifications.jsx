import { useState, useEffect } from "react";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:3001/trip/getNotifications`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const acceptTrip = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/trip/acceptTrip/${notificationId}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      if (!response.ok) throw new Error("Failed to accept trip");

      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
      
    } catch (error) {
      console.error("Error accepting trip:", error);
    }
  };

  const denyTrip = async (notificationId, actionLink) => {
    try {
      const response = await fetch(
        `http://localhost:3001/trip/denyTrip/${notificationId}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to deny trip");

      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error denying trip:", error);
    }
  };

  return { notifications, loading, acceptTrip, denyTrip };
};

export default useNotifications;

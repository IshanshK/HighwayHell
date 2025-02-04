import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importing Auth Context

const CreateTripPage = () => {
  const { currentUser } = useAuth(); // Get current user from Context API
  const navigate = useNavigate();

  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [adminLocation, setAdminLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch admin's current location
  const getAdminLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setAdminLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Location access is required to create a trip.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    getAdminLocation(); // Get location on component mount
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3001/trip/search-users?username=${searchTerm}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const delayDebounceFn = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInvite = (user) => {
    if (!invitedMembers.some((member) => member._id === user._id)) {
      setInvitedMembers([...invitedMembers, user]);
    }
  };

  const handleRemove = (id) => {
    setInvitedMembers(invitedMembers.filter((member) => member._id !== id));
  };

  const handleCreateTrip = async () => {
    if (!tripName || !description || !adminLocation) {
      alert("Please provide all required details.");
      return;
    }

    setLoading(true);
    try {
      const participants = [
        {
          userId: currentUser?._id, // Admin's user ID from context
          isAdmin: true,
          startLocation: adminLocation, // Use fetched location
        },
        ...invitedMembers.map((member) => ({
          userId: member._id,
        })),
      ];

      const response = await fetch("http://localhost:3001/trip/createTrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tripName,
          description,
          startLocation: adminLocation,
          participants,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Trip created successfully!");
        navigate(`/trip/${data.tripId}`);
      } else {
        console.error("Error creating trip:", await response.text());
        alert("Failed to create trip.");
      }
    } catch (error) {
      console.error("Error saving trip:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Create a Trip</h2>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Trip Name</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-300"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Description</label>
        <textarea
          className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-300"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold">Invite Members</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg mt-2 focus:ring focus:ring-blue-300"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="bg-gray-100 p-4 rounded-lg mb-6">
        {searchResults.map((user) => (
          <li key={user._id} className="flex justify-between items-center p-3 border-b last:border-none">
            <span className="text-gray-700 font-medium">{user.username}</span>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => handleInvite(user)}
            >
              Invite
            </button>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-4 text-blue-600">Invited Members</h3>
      <ul className="mb-6">
        {invitedMembers.map((member) => (
          <li key={member._id} className="flex justify-between items-center p-3 border-b last:border-none">
            <span className="text-gray-700 font-medium">{member.username}</span>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={() => handleRemove(member._id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button
        className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600"
        onClick={handleCreateTrip}
        disabled={loading}
      >
        {loading ? "Creating Trip..." : "Create Trip"}
      </button>
    </div>
  );
};

export default CreateTripPage;

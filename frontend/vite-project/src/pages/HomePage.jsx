import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const createTrip = () => {
    navigate("/createTrip");
  };
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/mapdecor.jpg" // Update this path based on your image location
          alt="Decorative map with travel icons"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative flex flex-col items-center justify-center h-full z-10">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          An easier trip, <br /> each time
        </h1>
        <p className="text-lg text-gray-700 text-center mb-6 max-w-lg">
          Imagine checking one place for your travel details and getting a heads
          up as things happen throughout your trip. See why life without Highway
          Hell is a distant memory for millions of travelers.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition"
        onClick={createTrip}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;

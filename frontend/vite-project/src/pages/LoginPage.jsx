import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.id]: e.target.value }));
  };

  // LoginPage.js - Updated handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const response = await axios.post("http://localhost:3001/auth/login", formData);
    const { token, user } = response.data;

    // Directly use the user object from login response
    login(token, user);
    
    // Redirect to current user's profile
    navigate(`/profile/${user.id}`);
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Please try again.");
  }
};

  return (
    <div className="flex h-screen">
      <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <img src="/images/logo.png" alt="HighWayHell logo" className="mx-auto mb-4 h-12" />
          <h2 className="text-2xl font-semibold mb-4">Sign in to your account</h2>
          <p className="mb-6">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">Sign up.</a>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      <div className="hidden md:block md:w-2/3 bg-gradient-to-r from-blue-500 to-purple-600"></div>
    </div>
  );
};

export default LoginPage;

import  { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        // const errorData = await response.json();
        throw new Error("Login failed.");
      }

      const responseData = await response.json();

      // Save token to local storage
      localStorage.setItem("token", responseData.token);

      setSuccess("Login successful!");
      setError(null);
      console.log("Token saved to local storage:", responseData.token);
      console.log("User data:", responseData.user);
      navigate("/home");
      // Optionally, redirect the user to another page
      // window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <img
            src="/images/logo.png"
            alt="HighWayHell logo"
            className="mx-auto mb-4 h-12"
          />
          <h2 className="text-2xl font-semibold mb-4">Sign in to your account</h2>
          <p className="mb-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up.
            </a>
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
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
      <div className="hidden md:block md:w-2/3 bg-gradient-to-r from-blue-500 to-purple-600"></div>
    </div>
  );
};

export default LoginPage;
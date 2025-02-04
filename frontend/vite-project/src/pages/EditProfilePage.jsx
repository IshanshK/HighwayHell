import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const EditProfilePage = () => {
  const { currentUser, login } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    location: currentUser?.location || "",
    occupation: currentUser?.occupation || "",
    about: currentUser?.about || "",
    connect: {
      leetcode: currentUser?.connect?.leetcode || "",
      instagram: currentUser?.connect?.instagram || "",
      linkedin: currentUser?.connect?.linkedin || "",
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("profileImage", file);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/users/upload/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // Update local state and context
      const newUserData = { ...currentUser, profileImage: response.data.imageUrl };
      login(token, newUserData);
      setImagePreview(URL.createObjectURL(file));
      setSuccess("Profile picture updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile picture");
    } finally {
      setImageLoading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("connect.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        connect: {
          ...(prev.connect || {}),
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value || "" // Ensure empty string if value is undefined
      }));
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
  
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        connect: {
          leetcode: formData.connect.leetcode || "",
          instagram: formData.connect.instagram || "",
          linkedin: formData.connect.linkedin || "",
        },
      };
  
      const response = await axios.put(
        `http://localhost:3001/users/update-user/${currentUser._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Fix: Store correct data and update localStorage
      const updatedUser = response.data.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      login(token, updatedUser); 
  
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setSuccess("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-300">
        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">
            Update your personal information and settings
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="flex items-center space-x-6 mb-8">
  <img
    src={imagePreview || currentUser?.profileImage || "/images/default-profile.png"}
    alt="Profile"
    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
  />
  <div className="flex flex-col items-start space-y-2">
    <input
      type="file"
      id="profileImage"
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />
    <label
      htmlFor="profileImage"
      className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
    >
      {imageLoading ? "Uploading..." : "Change Profile Picture"}
    </label>
    <p className="text-sm text-gray-500">
      JPG, GIF, or PNG. 1MB max.
    </p>
  </div>
</div>


        {/* Personal Information Form - Remainder of the form stays the same */}
        {/* ... [rest of the form elements remain unchanged] ... */}
         {/* Personal Information Form */}
         <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Social Connections */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Social Connections</h3>
              <div className="space-y-4">
                {Object.entries(formData.connect).map(([platform, value]) => (
                  <div key={platform} className="flex items-center space-x-3">
                    <span className="text-gray-600">
                      <img 
                        src={`/images/${platform}.png`}
                        alt={platform}
                        className="w-5 h-5 inline-block mr-2"
                      />
                    </span>
                    <input
                      type="text"
                      name={`connect.${platform}`}
                      value={value}
                      onChange={handleChange}
                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} username`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <hr className="my-8 border-gray-200" />

        {/* Password Change Section */}
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
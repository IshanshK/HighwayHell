const User = require("../models/User.js");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const fs = require("fs");

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -createdAt -updatedAt")
      .populate({
        path: "friends",
        select: "username name profileImage", // Customize friend fields
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert Mongoose document to plain object and remove version key
    const userObject = user.toObject();
    delete userObject.__v;

    res.status(200).json(userObject);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's friends
const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate("friends", "name profileImage");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const friendsData = user.friends.map(friend => ({
      id: friend._id,
      name: friend.name,
      imageUrl: friend.profileImage || "https://randomuser.me/api/portraits/men/32.jpg",
    }));
    
    res.json(friendsData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add/Remove friend
const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const [user, friend] = await Promise.all([
      User.findById(id),
      User.findById(friendId)
    ]);

    if (user.friends.includes(friendId)) {
      // Remove friendship both ways
      user.friends.pull(friendId);
      friend.friends.pull(id);
    } else {
      // Add friendship both ways
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await Promise.all([user.save(), friend.save()]);

    // Get updated friends list with populated data
    const updatedUser = await User.findById(id).populate({
      path: 'friends',
      select: '_id username name profileImage '
    });

    const formattedFriends = updatedUser.friends.map((friend) => ({
      _id: friend._id,
      username: friend.username,
      name: friend.name,
      profileImage: friend.profileImage
    }));

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

   
   

    // Convert to plain object
    const updateDP = async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
    
        // Debug: Check req.user content
    
        // Ensure req.user exists and has a valid _id
        if (!req.user || !req.user.id) {
          return res.status(401).json({ message: "Unauthorized" });
        }
    
        const userId = req.user.id; // Use _id instead of id if necessary
    
        // Upload to Cloudinary and update user as before
        const localFilePath = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
    
        if (!cloudinaryResponse) {
          return res.status(500).json({ message: "Failed to upload image" });
        }
    
        const { secure_url } = cloudinaryResponse;
    
        const user = await User.findByIdAndUpdate(
          userId, // Should now be a valid ObjectId
          { profileImage: secure_url },
          { new: true }
        );
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        return res.status(200).json({
          message: "Profile image updated successfully",
          profileImage: secure_url,
        });
      } catch (error) {
        console.error("Error updating profile image:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    };



 

    const updateUserProfile = async (req, res) => {
      try {
        const userId = req.params.id; // Extract the user ID from the URL
        const updateData = req.body; // Get the update payload from the request body
    
        // Validate if the user exists
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // Update user data
        Object.assign(user, updateData); 
        const updatedUser = await user.save(); // Save to DB
    
        // Return updated user data
        res.status(200).json({
          message: "Profile updated successfully",
          data: {
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            location: updatedUser.location,
            occupation: updatedUser.occupation,
            about: updatedUser.about,
            connect: updatedUser.connect,
            profileImage: updatedUser.profileImage,
          },
        });
      } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    };
    



module.exports = {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateDP,
  updateUserProfile
};
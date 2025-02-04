const express =require("express");
const {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateDP,
  updateUserProfile,
} =require("../controllers/user.js");
const { verifyToken } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");

const router = express.Router();

//router.get("/:id/friends",  getUserFriends);
router.get("/:id", verifyToken, getUser);

/* UPDATE */
router.post("/upload/profile", verifyToken, upload.single("profileImage"), updateDP);
router.patch("/:id/:friendId", verifyToken,addRemoveFriend);
router.put("/update-user/:id",verifyToken,updateUserProfile);


module.exports = router;
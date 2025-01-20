const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chat");

const router = express.Router();

router.post("/",verifyToken, accessChat);
router.route("/").get(verifyToken, fetchChats);
router.route("/group").post(verifyToken, createGroupChat);
router.route("/rename").put(verifyToken, renameGroup);
router.route("/groupremove").put(verifyToken, removeFromGroup);
router.route("/groupadd").put(verifyToken, addToGroup);
module.exports = router;

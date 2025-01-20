const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
 allMessages,
 sendMessage,
} = require("../controllers/message");
const router = express.Router();
router.route("/:chatId").get(verifyToken, allMessages);
router.route("/").post(verifyToken, sendMessage);
module.exports = router;
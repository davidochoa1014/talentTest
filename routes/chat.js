const router = require("express").Router();
const chatController = require("../controllers/chatController");

router.post("/", chatController.talkToAgent);

module.exports = router;
const chatService = require("../services/chatService");

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await chatService.askAI(message);

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
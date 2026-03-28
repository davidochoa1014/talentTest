const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    await authService.register(email, password);

    res.json({ message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    res.json({ token });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(401).json({ msg: "User not found" });
    }

    if (err.message === "INVALID_PASSWORD") {
      return res.status(401).json({ msg: "Wrong password" });
    }

    res.status(500).json({ msg: "Login error" });
  }
};
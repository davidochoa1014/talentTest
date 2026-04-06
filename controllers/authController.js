const authService = require("../services/authService");
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const { FRONTEND_URL, JWT_SECRET } = require('../config/constants');

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

exports.socialLoginCallback = (req, res) => {
    try {
        // the user was already processed by passport.js 
        const user = req.user;

        // we need  to create a token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

       
        res.redirect(`${FRONTEND_URL}/?token=${token}`);
        
    } catch (error) {
        console.error("Error en callback social:", error);
        res.redirect(`${FRONTEND_URL}/login?error=sso_failed`);
    }
};
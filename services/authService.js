const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const {  JWT_SECRET } = require('../config/constants');

exports.register = async (email, password) => {
  const hash = await bcrypt.hash(password, 10);
  return await userModel.createUser(email, hash);
};

exports.login = async (email, password) => {
  const user = await userModel.findByEmail(email);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
 
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error("INVALID_PASSWORD");
  }

  const token = jwt.sign(
    { id: user.id,  role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
};
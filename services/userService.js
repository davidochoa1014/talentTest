const db = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * create new user
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [result] = await db.promise().execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, 'user']
  );
  return { id: result.insertId, name, email };
};

/**
 * find and user grabbing from Google o Azure
 */
const findOrCreateSocialUser = async (profile) => {
  const { email, name, provider, providerId } = profile;

  const [users] = await db.promise().execute('SELECT * FROM users WHERE email = ?', [email]);
  
  if (users.length > 0) {
    return users[0];
  }

  const [result] = await db.promise().execute(
    'INSERT INTO users (name, email, provider, provider_id, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, provider, providerId, 'user']
  );

  return { id: result.insertId, name, email };
};

module.exports = { registerUser, findOrCreateSocialUser };
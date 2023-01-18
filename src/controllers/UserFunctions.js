const bcrypt = require("bcrypt");
const saltRounds = 10;

const { User } = require("../models/User");

// Hash and return a string
async function hashString(string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(string, salt);
  return hash;
}

// Create and register a new user
async function createUser(userData) {
  // Hash password
  const hashedPassword = await hashString(userData.password);
  // Create new user
  const newUser = {
    email: userData.email,
    password: hashedPassword,
    username: userData.username,
    firstName: userData.firstName || null,
    lastName: userData.lastName || null,
    role: userData.role,
  };

  return await User.create(newUser);
}

module.exports = { hashString, createUser };

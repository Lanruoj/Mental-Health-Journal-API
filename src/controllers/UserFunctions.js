const { User } = require("../models/User");

const bcrypt = require("bcrypt");
const { response } = require("express");
const saltRounds = 10;

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

  const createdUser = await User.create(newUser);

  return createdUser;
}

// Find and return all users
async function getAllUsers() {
  const allUsers = await User.find({}).populate("role").exec();

  return allUsers;
}

module.exports = { hashString, createUser, getAllUsers };

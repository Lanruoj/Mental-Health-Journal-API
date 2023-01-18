const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const {
  encryptString,
  decryptString,
  decryptObject,
  hashString,
  validateHashedData,
  generateJWT,
  generateUserJWT,
  getAllUsers,
  createUser,
} = require("./UserFunctions");

// [POST] /register
// Register a new user and return from database
router.post("/register", async (request, response) => {
  const createdUser = await createUser(request.body);

  return response.json(createdUser);
});

// [GET] /
// Get all users
router.get("/", async (request, response) => {
  const users = await getAllUsers();

  return response.json(users);
});

module.exports = router;

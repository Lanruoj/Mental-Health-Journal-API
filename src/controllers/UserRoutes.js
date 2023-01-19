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
  getUserById,
  updateUser,
  verifyUserJWT,
  parseJWT,
} = require("./UserFunctions");

// Get all users
router.get("/", async (request, response) => {
  const users = await getAllUsers();

  return response.json(users);
});

// Get user by ID param
router.get("/:userID", async (request, response) => {
  const foundUser = await getUserById(request.params.userID).catch((error) =>
    next(new Error("User not found with that ID"))
  );
  return response.json(foundUser);
});

// Update user details
router.put("/", async (request, response) => {
  // Parse JWT from authorization header
  const jwt = parseJWT(request.get("authorization"));
  // Find user from JWT
  const foundUser = await verifyUserJWT(jwt);
  // Update user using request.body data
  const updatedUser = await updateUser(foundUser, request.body);

  return response.json(updatedUser);
});

// Error handler
async function errorHandler(error, request, response, next) {
  if (error) {
    return response.status(500).json(error.message);
  } else {
    next();
  }
}

module.exports = router;

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

// Error handler
async function errorHandler(error, request, response, next) {
  if (error) {
    return response.status(500).json(error.message);
  } else {
    next();
  }
}

module.exports = router;

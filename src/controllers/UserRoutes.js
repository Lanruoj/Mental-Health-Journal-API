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

// const { validateEmail } = require("../controllers/middleware/auth");

// [POST] /register
// Register a new user and return from database
router.post("/register", errorHandler, async (request, response, next) => {
  const createdUser = await createUser(request.body).catch((error) => {
    return next(new Error(error.message));
  });

  return response.json(createdUser);
});

// [GET] /
// Get all users
router.get("/", async (request, response) => {
  const users = await getAllUsers();

  return response.json(users);
});

// Error handler
async function errorHandler(error, request, response, next) {
  if (error) {
    return response.status(500).json({
      error: error.message,
    });
  } else {
    next();
  }
}

module.exports = router;

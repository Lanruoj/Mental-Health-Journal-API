const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const { createUser, getAllUsers } = require("./UserFunctions");

// [POST] /register
// Register a new user and return from database
router.post("/register", async (request, response) => {
  const createdUser = await createUser(request.body);
  const userDoc = await User.findById(createdUser.id).populate("role").exec();

  return response.json(userDoc);
});

// [GET] /
// Get all users
router.get("/", async (request, response) => {
  const users = await getAllUsers();

  return response.json(users);
});

module.exports = router;

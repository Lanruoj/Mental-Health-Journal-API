const express = require("express");
const router = express.Router();

// const { User } = require("../models/User");
const { createUser, getAllUsers } = require("./UserFunctions");

// [POST] /register
// Register a new user
router.post("/register", async (request, response) => {
  const createdUser = await createUser(request.body);
  return response.json(createdUser);

  // const user = await User.findById(createdUser.id).populate("role").exec();
  // return response.json(user);
});

// [GET] /
// Get all users
router.get("/", async (request, response) => {
  const users = await getAllUsers();

  return response.json(users);
});

module.exports = router;

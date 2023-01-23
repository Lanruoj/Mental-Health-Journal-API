const express = require("express");
const router = express.Router();
const { isEmail } = require("validator");

const { User } = require("../models/User");
const {
  validateHashedData,
  generateUserJWT,
  createUser,
} = require("./UserFunctions");

// Register a new user and return JWT
router.post("/register", async (request, response, next) => {
  const emailExists = await User.findOne({ email: request.body.email }).exec();
  if (emailExists) return next(new Error("Email is already in use"));
  if (request.body.password.length <= 8)
    return next(new Error("Password must be greater than 8 characters"));
  if (request.body.username.length <= 3)
    return next(new Error("Username must be greater than 3 characters"));
  if (!isEmail(request.body.email))
    return next(new Error("Invalid email format"));

  const createdUser = await createUser(request.body);
  const token = await generateUserJWT(createdUser);

  return response.json({ token });
});

// Login an existing user and return JWT
router.post("/login", async (request, response, next) => {
  const existingUser = await User.findOne({ email: request.body.email });
  if (
    !existingUser ||
    !(await validateHashedData(request.body.password, existingUser.password))
  ) {
    next(new Error("Invalid login details, please try again"));
  } else {
    const token = await generateUserJWT(existingUser);

    return response.json({ token });
  }
});

module.exports = router;

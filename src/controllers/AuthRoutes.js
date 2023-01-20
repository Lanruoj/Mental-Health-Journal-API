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

// Register a new user and return JWT
router.post("/register", errorHandler, async (request, response, next) => {
  const createdUser = await createUser(request.body).catch((error) => {
    return next(new Error(error));
  });
  const token = await generateUserJWT(createdUser);

  return response.json({ token });
});

// Login an existing user and return JWT
router.post("/login", errorHandler, async (request, response, next) => {
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

// Error handler
async function errorHandler(error, request, response, next) {
  if (error) {
    return response.status(500).json({ error: error.message });
  } else {
    next();
  }
}

router.use("/", errorHandler);

module.exports = router;

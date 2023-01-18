const express = require("express");
const router = express.Router();

const { createUser } = require("./UserFunctions");

// [POST] /register
// Register a new user
router.post("/register", async (request, response) => {
  const createdUser = await createUser(request.body);

  return response.json(createdUser);
});

module.exports = router;

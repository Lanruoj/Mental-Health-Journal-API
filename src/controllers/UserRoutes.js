const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("./UserFunctions");

const { verifyAndRefreshUserJWT, errorHandler } = require("./middleware/auth");

// Get all users
router.get(
  "/",
  /*verifyAndRefreshUserJWT,*/ async (request, response) => {
    const users = await getAllUsers();

    return response.json(users);
  }
);

// Get user by ID param
router.get("/:userID", verifyAndRefreshUserJWT, async (request, response) => {
  const foundUser = await getUserById(request.params.userID).catch((error) =>
    next(new Error("User not found with that ID"))
  );
  return response.json(foundUser);
});

// Update user details
router.put("/", verifyAndRefreshUserJWT, async (request, response, next) => {
  const foundUser = await User.findById(request.userID).exec();
  // Update user using request.body data
  const updatedUser = await updateUser(foundUser, request.body);
  if (!updatedUser) return next(new Error("No updates performed"));

  return response.json({
    id: updatedUser.user._id,
    updates: updatedUser.updates,
  });
});

// Delete user
router.delete("/", verifyAndRefreshUserJWT, async (request, response, next) => {
  await deleteUser(request.userID).catch((error) => console.log("BANANAS"));

  return response.json({ message: "User deleted" });
});

// Use errorHandler middleware
router.use("/", errorHandler);

module.exports = router;

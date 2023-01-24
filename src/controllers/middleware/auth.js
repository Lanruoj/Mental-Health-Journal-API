const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const { User } = require("../../models/User");
const { Role } = require("../../models/Role");
const {
  parseJWT,
  decryptString,
  generateUserJWT,
} = require("../UserFunctions");

async function verifyAndRefreshUserJWT(request, response, next) {
  const parsedJWT = parseJWT(request.headers.authorization);
  // Verify JWT is valid
  let verifiedJWT;
  try {
    verifiedJWT = jwt.verify(parsedJWT, process.env.JWT_SECRET_KEY, {
      complete: true,
    });
  } catch (error) {
    return next(new Error("Invalid access token"));
  }
  // Decrypt JWT payload
  const decryptedJWT = decryptString(verifiedJWT.payload.data);
  // Parse decrypted data into an object
  const userData = JSON.parse(decryptedJWT);
  // Find User from data
  const targetUser = await User.findById(userData._id).exec();
  const role = await Role.findById(targetUser.role).exec();
  if (!targetUser) return next(new Error("Invalid access token"));
  // Check that JWT data matches stored data
  if (
    targetUser.password == userData.password &&
    targetUser.email == userData.email
  ) {
    const newJWT = await generateUserJWT(targetUser);
    request.userID = targetUser._id;
    request.userRole = role.name;
    request.headers.jwt = newJWT;
    next();
  } else {
    return next(new Error("User authentication failed"));
  }
}

async function allowAdminOnly(request, response, next) {
  if (request.userRole !== "admin")
    return next(
      new Error("User must be an administrator to perform this task")
    );

  next();
}

module.exports = { verifyAndRefreshUserJWT, allowAdminOnly };

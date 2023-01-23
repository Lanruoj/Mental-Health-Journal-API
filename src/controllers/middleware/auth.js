const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { User } = require("../../models/User");
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
  if (!targetUser) return next(new Error("Invalid access token"));
  // Check that JWT data matches stored data
  if (
    targetUser.password == userData.password &&
    targetUser.email == userData.email
  ) {
    request.userID = targetUser._id;
    const newJWT = await generateUserJWT(targetUser);
    request.headers.jwt = newJWT;
    next();
  } else {
    return next(new Error("User authentication failed"));
  }
}

module.exports = { verifyAndRefreshUserJWT };

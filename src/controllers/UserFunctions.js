const dotenv = require("dotenv");
dotenv.config();

const { User } = require("../models/User");

// ---- Encryption/decryption functionality ----
const crypto = require("crypto");
const encAlgorithm = "aes-256-cbc";
const encPrivateKey = crypto.scryptSync(process.env.ENC_KEY, "SpecialSalt", 32);
const encIV = crypto.scryptSync(process.env.ENC_IV, "SpecialSalt", 16);
let cipher = crypto.createCipheriv(encAlgorithm, encPrivateKey, encIV);
let decipher = crypto.createDecipheriv(encAlgorithm, encPrivateKey, encIV);

// Encrypt a string
function encryptString(data) {
  cipher = crypto.createCipheriv(encAlgorithm, encPrivateKey, encIV);
  return cipher.update(data, "utf8", "hex") + cipher.final("hex");
}

// Decrypt a string
function decryptString(data) {
  decipher = crypto.createDecipheriv(encAlgorithm, encPrivateKey, encIV);
  return decipher.update(data, "hex", "utf8") + decipher.final("utf8");
}

// Decrypts a stringified JSON object and converts to regular object
function decryptObject(data) {
  return JSON.parse(decryptString(data));
}

// ---- Hashing functionality ----
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Hash and return a string
async function hashString(string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(string, salt);
  return hash;
}

// Validate hashed data
async function validateHashedData(providedUnhashedData, storedHashedData) {
  return await bcrypt.compare(providedUnhashedData, storedHashedData);
}

// ---- JWT functionality ----
const jwt = require("jsonwebtoken");

// Generate a JWT from payload
function generateJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
}

// Generate JWT from encrypted User data with provided User details
async function generateUserJWT(userDetails) {
  // Encrypt the User payload
  let encryptedUserData = encryptString(JSON.stringify(userDetails));
  // Must pass an object to create JWT otherwise expiresIn won't work
  return generateJWT({ data: encryptedUserData });
}

// Verify a User's JWT and refresh
async function verifyUserJWT(userJWT) {
  // Verify JWT is valid
  const verifiedJWT = jwt.verify(userJWT, process.env.JWT_SECRET_KEY, {
    complete: true,
  });
  // Decrypt JWT payload
  const decryptedJWT = decryptString(verifiedJWT.payload.data);
  // Parse decrypted data into an object
  const userData = JSON.parse(decryptedJWT);
  // Find User from data
  const targetUser = await User.findById(userData._id).exec();
  // Check that JWT data matches stored data
  if (
    targetUser.password == userData.password &&
    targetUser.email == userData.email
  ) {
    return targetUser;
  } else {
    throw new Error({ message: "Invalid user token" });
  }
}

// Verify and refresh token
async function verifyAndRefreshUserJWT(userJWT) {
  const targetUser = verifyUserJWT(userJWT);
  return await generateUserJWT({ data: targetUser });
}

// Parse token from authorization header
function parseJWT(header) {
  const jwt = header?.split(" ")[1].trim();
  return jwt;
}

// ---- Route functions ----

// Find and return all users
async function getAllUsers() {
  // Populate role field with *only* name
  const allUsers = await User.find({}).populate("role", "name -_id").exec();

  return allUsers;
}

// Get user by ID
async function getUserById(userId) {
  const foundUser = await User.findById(userId);
  return foundUser;
}

// Create and register a new user
async function createUser(userData) {
  // Hash password
  const hashedPassword = await hashString(userData.password);
  // Create new user
  const newUser = {
    email: userData.email,
    password: hashedPassword,
    username: userData.username,
    firstName: userData.firstName || null,
    lastName: userData.lastName || null,
    role: userData.role,
  };
  console.log(newUser);

  const createdUser = await User.create(newUser);

  // console.log(createdUser);

  return createdUser;
}

// Update a user details
async function updateUser(userID, updateData) {
  const updatedUser = await User.findByIdAndUpdate(userID, updateData, {
    returnDocument: "after",
  });

  return updatedUser;
}

module.exports = {
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
  updateUser,
  verifyUserJWT,
  verifyAndRefreshUserJWT,
  parseJWT,
};

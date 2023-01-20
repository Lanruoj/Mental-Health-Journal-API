const mongoose = require("mongoose");
const { isEmail } = require("validator");
const mongooseAutoPopulate = require("mongoose-autopopulate");
const { Role } = require("../models/Role");

// // Validate email format
// function validateEmail(email) {
//   if (!isEmail(email)) {
//     return false;
//   }
// }

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // validate: [validateEmail, "Must be a valid email address"],
  },
  password: {
    type: String,
    // minLength: [8, "Password must be at least 8 characters"],
  },
  username: {
    type: String,
    // minLength: [3, "Username must be at least 3 characters"],
  },
  firstName: String,
  lastName: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };

const mongoose = require("mongoose");
const mongooseAutoPopulate = require("mongoose-autopopulate");
const { Role } = require("../models/Role");
// const { Post } = require("../models/Post");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, minLength: 8 },
  username: { type: String, minLength: 3 },
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

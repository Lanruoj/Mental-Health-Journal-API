const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, minLength: 8 },
  username: { type: String, minLength: 3 },
  fullName: String,
  role: { type: mongoose.Types.ObjectId, ref: "Role" },
  posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };

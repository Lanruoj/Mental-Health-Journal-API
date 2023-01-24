const mongoose = require("mongoose");
const { Role } = require("../models/Role");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

// Add regular role ObjectId to each new user by default
UserSchema.pre("save", async function (next) {
  const regularRole = await Role.findOne({ name: "regular" }).exec();
  if (this.role == null || this.role == "") this.role = regularRole._id;

  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };

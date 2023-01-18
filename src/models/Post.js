const mongoose = require("mongoose");
// const { User } = require("../models/User");

const PostSchema = new mongoose.Schema({
  date: Date,
  moodRating: { type: Number, min: 0, max: 10, required: true },
  description: { type: String, maxLength: 500 },
  actionPlan: { type: String, maxLength: 500 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = { Post };

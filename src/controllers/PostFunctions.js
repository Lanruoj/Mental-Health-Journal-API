const { Post } = require("../models/Post");

async function getAllPosts() {
  const allPosts = await Post.find({}).exec();

  return allPosts;
}

module.exports = { getAllPosts };

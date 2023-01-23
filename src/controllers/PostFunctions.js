const { Post } = require("../models/Post");

async function getAllPosts() {
  const allPosts = await Post.find({}).exec();

  return allPosts;
}

async function getPostById(postID) {
  const foundPost = await Post.findById(postID).exec();

  return foundPost;
}

// Error handler middleware
function errorHandler(error, request, response, next) {
  console.log(error);
  if (error) {
    return response.status(500).json({ error: error.message });
  }
}

module.exports = { getAllPosts, getPostById, errorHandler };

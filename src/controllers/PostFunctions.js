const { Post } = require("../models/Post");

async function getAllPosts() {
  const allPosts = await Post.find({}).exec();

  return allPosts;
}

async function getPostById(postID) {
  const foundPost = await Post.findById(postID).exec();

  return foundPost;
}

module.exports = { getAllPosts, getPostById };

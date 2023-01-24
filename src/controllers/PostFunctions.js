const { omit } = require("underscore");
const { Post } = require("../models/Post");

async function getAllPosts() {
  const allPosts = await Post.find({}).populate("author", "username").exec();

  return allPosts;
}

async function getPostById(postID) {
  const foundPost = await Post.findById(postID).exec();

  return foundPost;
}

async function createPost(postData) {
  const createdPost = await Post.create(postData);

  return createdPost;
}

// Update a post's details & return updated fields
async function updatePost(postID, updateData) {
  // Update and return unmodified post
  const originalPost = await Post.findByIdAndUpdate(postID, updateData)
    .lean()
    .exec();
  // Get modified post for comparison
  const updatedPost = await Post.findById(postID).lean().exec();
  // Only return fields that were updated
  const updatedFields = omit(updatedPost, (value, field) => {
    return originalPost[field]?.toString() === value?.toString();
  });
  // If no update data, throw error
  if (!Object.keys(updatedFields).length) throw new Error("No update data");

  return { post: updatedPost._id, updates: updatedFields };
}

// Delete a post
async function deletePost(postID) {
  const deletedPost = await Post.findByIdAndDelete(postId).exec();
  if (!deletedPost) throw new Error("Post not found");

  return deletedPost;
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

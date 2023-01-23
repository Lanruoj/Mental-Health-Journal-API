const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
} = require("../controllers/PostFunctions");
const { verifyAndRefreshUserJWT } = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");

// Get all posts
router.get("/", async (request, response, next) => {
  const allPosts = await getAllPosts();

  return response.json(allPosts);
});

// Get post by ID
router.get("/:postID", async (request, response, next) => {
  let post;
  try {
    post = await getPostById(request.params.postID);
  } catch (error) {
    return next(new Error("Post not found"));
  }

  return response.json(post);
});

// Create new post
router.post("/", verifyAndRefreshUserJWT, async (request, response, next) => {
  // Parse post data
  const postData = {
    moodRating: request.body.moodRating || null,
    description: request.body.description || null,
    actionPlan: request.body.actionPlan || null,
    author: request.userID,
  };
  // Create new post
  let newPost = await createPost(postData).catch(() => {
    return next(new Error("Could not create post"));
  });
  // Populate author field
  newPost = await newPost.populate("author", "username");

  return response.json(newPost);
});

router.use("*", errorHandler);

module.exports = router;

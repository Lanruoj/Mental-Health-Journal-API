const express = require("express");
const router = express.Router();
const { getAllPosts, getPostById } = require("../controllers/PostFunctions");
const { errorHandler } = require("./middleware/errorHandler");

router.get("/", async (request, response, next) => {
  const allPosts = await getAllPosts();

  return response.json(allPosts);
});

router.get("/:postID", async (request, response, next) => {
  let post;
  try {
    post = await getPostById(request.params.postID);
  } catch (error) {
    return next(new Error("Post not found"));
  }

  return response.json(post);
});

router.use("*", errorHandler);

module.exports = router;

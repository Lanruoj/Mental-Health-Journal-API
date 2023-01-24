const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  verifyIfAuthor,
  updatePost,
} = require("../controllers/PostFunctions");
const {
  verifyAndRefreshUserJWT,
  allowAdminOnly,
} = require("./middleware/auth");
const { deleteUser } = require("./UserFunctions");

// Get all posts
router.get(
  "/",
  verifyAndRefreshUserJWT,
  allowAdminOnly,
  async (request, response, next) => {
    const allPosts = await getAllPosts();

    return response.json(allPosts);
  }
);

// Get post by ID
router.get(
  "/:postID",
  verifyAndRefreshUserJWT,
  allowAdminOnly,
  async (request, response, next) => {
    let post;
    try {
      post = await getPostById(request.params.postID);
    } catch (error) {
      return next(new Error("Post not found"));
    }

    return response.json(post);
  }
);

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

// Update a post
router.put(
  "/:postID",
  verifyAndRefreshUserJWT,
  async (request, response, next) => {
    // Verify if user is author of post from JWT
    await verifyIfAuthor(request.params.postID, request.userID).catch(
      (error) => {
        return next(new Error(error.message));
      }
    );
    // Update post
    const updatedPost = await updatePost(
      request.params.postID,
      request.body
    ).catch((error) => {
      return next(new Error(error.message));
    });

    return response.json(updatedPost);
  }
);

router.delete(
  "/:postID",
  verifyAndRefreshUserJWT,
  async (request, response, next) => {
    await verifyIfAuthor(request.params.postID, request.userID).catch(
      (error) => {
        return next(new Error(error.message));
      }
    );
    const deletedUser = deleteUser(request.params.postID);

    return response.status(204).json(deletedUser);
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getAllPosts } = require("../controllers/PostFunctions");

router.get("/", async (request, response, next) => {
  const allPosts = await getAllPosts();

  return response.json(allPosts);
});

module.exports = router;

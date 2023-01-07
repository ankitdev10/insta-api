const {
  createPost,
  getAllPosts,
  deletePost,
  updatePost,
  addLike,
  getFollowingUserPosts,
  getAllPostsOfUser,
  removeLike
} = require("../controllers/postController");
const verifyToken = require("../utils/verifyToken");

const Router = require("express").Router();

//  CREATE POST
Router.post("/", verifyToken, createPost);
// GET ALL POSTS
Router.get("/", verifyToken, getAllPosts);
// GET ALL POST OF ACCOUNT THIS USER FOLLOWS
Router.get("/following", verifyToken, getFollowingUserPosts);
// GET ALL POSTS OF ONE USER
Router.get("/:userId", verifyToken, getAllPostsOfUser);

//delete post
Router.delete("/:postId", verifyToken, deletePost);
// update post
Router.put("/:postId", verifyToken, updatePost);
//like post
Router.put("/like/:postId", verifyToken, addLike);
// remove like
Router.put("/unlike/:postId", verifyToken, removeLike);

module.exports = Router;

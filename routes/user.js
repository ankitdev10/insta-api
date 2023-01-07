const Router = require("express").Router();
const verifyToken = require("../utils/verifyToken");
const {
  getOneUser,
  getAllUser,
  deleteUser,
  updateUser,
  followUser,
  unfollowUser,
  search,
} = require("../controllers/userController");

//GET ONE USER
Router.get("/:id", verifyToken, getOneUser);
// GET ALL USER
Router.get("/", verifyToken, getAllUser);
//delete user
Router.delete("/:id", verifyToken, deleteUser);
// update User
Router.put("/:id", verifyToken, updateUser);
//follow user
Router.put("/follow/:userId", verifyToken, followUser);
Router.put("/unfollow/:userId", verifyToken, unfollowUser);
//search user
Router.get("/s/find", verifyToken, search)

module.exports = Router;

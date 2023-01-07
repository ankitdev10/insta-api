const Post = require("../model/Post");
const User = require("../model/User");

const createPost = async (req, res, next) => {
  try {
    const newPost = new Post({ ...req.body, userId: req.user.id });
    newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    next(error);
  }
};
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const getAllPostsOfUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (error) {}
};
const getFollowingUserPosts = async (req, res, next) => {
  try {
    const loggedInUser = await User.findById(req.user.id);
    const followingPosts = await Promise.all(
      loggedInUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(followingPosts.flat());
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post.userId == req.user.id) {
      await post.delete();
      res.status(200).json("Succesfully deleted post");
    } else {
      res.status(403).json("You can only delete your post");
    }
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post.userId == req.user.id) {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatePost);
    } else {
      res.status(403).json("You can update only your posts");
    }
  } catch (error) {
    next(error);
  }
};

const addLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({
        $push: { likes: req.user.id },
      });
      res.status(200).json("Post has been liked");
    } else {
      res.status(403).json("Already liked this post");
    }
  } catch (error) {
    next(error);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (post.likes.includes(req.user.id)) {
      await post.updateOne({
        $pull: { likes: req.user.id },
      });
      res.status(200).json("Like has been removed");
    } else {
      res.status(403).json("You have not liked this post");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getFollowingUserPosts,
  getAllPostsOfUser,
  deletePost,
  updatePost,
  addLike,
  removeLike,
};

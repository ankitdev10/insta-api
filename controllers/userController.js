const User = require("../model/User");
const createError = require("../utils/createError");

const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) return next(createError(404, "User not found"));

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};
const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    if (loggedInUser.id === req.params.id) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted successfully");
    } else {
      next(createError(403, "You can delete your account only"));
    }
  } catch (error) {}
};
const updateUser = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    if (loggedInUser.id !== req.params.id)
      return next(createError(403, "You can only update your account"));
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
   
    res.status(200).json("Account updated successfully");
  } catch (error) {}
};

const followUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      const loggedInUser = await User.findById(req.user.id);
      const toFollowUser = await User.findOne({ _id: req.params.userId });
      if (!loggedInUser.following.includes(toFollowUser._id)) {
        await loggedInUser.updateOne({
          $push: { following: toFollowUser._id },
        });
        await toFollowUser.updateOne({
          $push: { followers: loggedInUser._id },
        });
        res.status(200).json("Successfully followed this user");
      } else {
        res.status(403).json("You already follow this user");
      }
    } else {
      res.status(403).json("You can not follow yourself");
    }
  } catch (error) {
    next(error);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      const loggedInUser = await User.findById(req.user.id);
      const toUnfollowUser = await User.findById(req.params.userId);

      if (!loggedInUser.following.includes(toUnfollowUser._id)) {
        res.status(403).json("You do not follow this account");
      } else {
        await loggedInUser.updateOne({
          $pull: { following: toUnfollowUser._id },
        });
        await toUnfollowUser.updateOne({
          $pull: { followers: loggedInUser._id },
        });
        res.status(200).json("Succesfully unfollowed this account");
      }
    } else {
      res.status(403).json("You can not unfollow yourself");
    }
  } catch (error) {
    next(error);
  }
};


 const search = async (req, res, next) => {
  const query = req.query.q
  try {
    const users = await User.find({username: {$regex: query, $options: "i"}})
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOneUser,
  getAllUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  search
};

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    desc: {
      type: String,
    },
    likes: {
      type: [String], // array of users who liked post
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

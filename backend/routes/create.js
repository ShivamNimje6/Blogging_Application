const express = require("express");
const router = express.Router();
const verifyToken = require("../verifyToken");
const Post = require("../models/Post");

const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return `${time} min read`;
};

// CREATE
router.post("/createPost", verifyToken, async (req, res) => {
  try {
    const { title, desc, photo, username, userId, categories } = req.body;
    const readingTime = calculateReadingTime(desc);
    const newPost = new Post({
      title,
      desc,
      photo,
      username,
      userId: userId,
      categories,
      readingTime,
    });
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

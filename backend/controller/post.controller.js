import { v2 as cloudinary } from "cloudinary";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import Notification from "../model/notification.model.js";
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ mesage: "User Not Found!" });
    }
    if (!text && !img) {
      return res
        .status(400)
        .json({ error: "Post must contain Text or Image!" });
    }
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created Successfully", newPost });
  } catch (error) {
    console.log("Error from Create Post :", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ mesage: "Post Not Found!" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post!" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ mesage: "Post Deleted Successfully" });
  } catch (error) {
    console.log("Error from Delete Post :", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    if (!text) {
      return res.status(400).json({ error: "Text field is required." });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "PostNot Found!." });
    }
    const comment = { user: userId, text };
    post.comments.push(comment);

    await post.save();

    res.status(200).json({ message: "Comment Added", post });
  } catch (error) {
    console.log("Error from Comment Post :", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post Not Found!" });
    }
    const userLikedPost = post.likes.includes(userId);

    //Like and Unlike
    if (userLikedPost) {
      await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: id } });

      res.status(200).json({ message: "Post unliked" });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: id } });

      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      res.status(200).json({ error: "Post liked Successfully" });
    }
  } catch (error) {
    console.log("Error from Like And Unlike Post :", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error from Get All Post :", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }
    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error from Get Liked Posts :", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User Not Found" });

    const following = user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error from Get Following Posts:", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getUsersPost = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User Not Found!" });
    }

    const posts = await Post.find({
      user: user._id,
    })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error from Get Following Posts:", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

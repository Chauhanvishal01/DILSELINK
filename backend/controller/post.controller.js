import { v2 as cloudinary } from "cloudinary";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";

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

import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";
export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User Not Found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error from getUserProfile", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }
    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User Not Found!" });

    const isFollowing = currentUser.following.includes(id);

    //Follow Unfollow User
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User Unfollowed Successfully!" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });
      await newNotification.save();
      res.status(200).json({ message: "User Followed Successfully" });
    }
  } catch (error) {
    console.log("Error from FOllow and Unfollow User", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getSuggestion = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUser = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUser.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error from getUser Suggestion", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const updateUserProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User Not Found!" });
    }
    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both the cuurent password and the new password",
      });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Current Password is incorrect!" });
      }
      if (newPassword.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must contain 8 character!" });
      }

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploadResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadResponse.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null; //password null in the response not in the db because we dont do the user.save() after this
    return res
      .status(200)
      .json({ message: "Profile Updated Successfully", user });
  } catch (error) {
    console.log("Error from Update Profile :", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
export const getFollowers = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.findById(userId).populate(
      "followers",
      "username fullName profileImg bio"
    );
    if (!users) {
      return res.status(404).json({ message: "Followers not found" });
    }
    const followers = users.followers.map((follower) => ({
      username: follower.username,
      email: follower.email,
      profileImg: follower.profileImg,
      fullName: follower.fullName,
      bio: follower.bio,
    }));

    res.status(200).json(followers);
  } catch (error) {
    console.log("Error from My followers ", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.findById(userId).populate(
      "following",
      "username fullName profileImg bio"
    );
    if (!users) {
      return res.status(404).json({ message: "Followers not found" });
    }
    const followings = users.following.map((following) => ({
      username: following.username,
      email: following.email,
      profileImg: following.profileImg,
      fullName: following.fullName,
      bio: following.bio,
    }));

    res.status(200).json(followings);
  } catch (error) {
    console.log("Error from My following ", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

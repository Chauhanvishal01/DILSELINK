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

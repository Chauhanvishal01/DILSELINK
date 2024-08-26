import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Access Denied!" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Access Denied!" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User Not FOund!" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error From Auth Middleware", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import dbConnection from "./database/db.connection.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";

dotenv.config();
const app = express();

///Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);

//Database Connection
dbConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on PORT ${process.env.PORT}`);
});

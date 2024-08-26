import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import dbConnection from "./database/db.connection.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//routes
app.use("/api/v1/auth", authRoutes);

dbConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on PORT ${process.env.PORT}`);
});

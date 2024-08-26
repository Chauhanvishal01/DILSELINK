import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import dbConnection from "./database/db.connection.js";



const app = express();

dotenv.config();
app.use("/api/v1/auth", authRoutes);

console.log(process.env.PORT);

dbConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on PORT ${process.env.PORT}`);
});

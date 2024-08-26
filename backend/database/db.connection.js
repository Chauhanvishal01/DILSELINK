import mongoose from "mongoose";
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MONGODB `);
  } catch (error) {
    console.log("Error occured while connecting to mongodb", error);
    process.exit(1);
  }
};

export default dbConnection;

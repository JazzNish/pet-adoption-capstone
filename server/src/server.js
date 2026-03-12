import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// NOTE: When using imports in Node, you must include the ".js" extension for local files!
import petRoutes from "./routes/petRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from './routes/userRoutes.js';
import messageRoute from './routes/messageRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173", // Allows you to test locally
        "https://pet-adoption-capstone.vercel.app" // Allows your live Vercel site
    ],
    credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.use("/api/pets", petRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoute);
app.use('/api/applications', applicationRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
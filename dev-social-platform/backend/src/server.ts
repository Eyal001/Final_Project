import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { db } from "./db/db";
import commentRoute from "./routes/commentRoute";
import likeCommentRoutes from "./routes/likeCommentRoute";
import likePostRoute from "./routes/likePostRoute";
import postRouter from "./routes/postRoute";
import userRouter from "./routes/userRoute";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT || 5000, () => {
  console.log(`run on ${PORT || 5001}`);
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/post-likes", likePostRoute);
app.use("/api/comments", commentRoute);
app.use("/api/comment-likes", likeCommentRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});
async function testConnection() {
  try {
    const response = await db("users").select("id");
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
}
testConnection();

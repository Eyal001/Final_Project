import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import commentRoute from "./routes/commentRoute";
import likeCommentRoutes from "./routes/likeCommentRoute";
import likePostRoute from "./routes/likePostRoute";
import postRouter from "./routes/postRoute";
import userRouter from "./routes/userRoute";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:3000"],
//     credentials: true,
//   })
// );
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL || "*" }));
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/post-likes", likePostRoute);
app.use("/api/comments", commentRoute);
app.use("/api/comment-likes", likeCommentRoutes);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

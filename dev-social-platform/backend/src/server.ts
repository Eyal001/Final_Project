import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { db } from "./db/db";
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
app.get("/", (req, res) => {
  res.send("API is running...");
});
async function testConnection() {
  try {
    const response = await db("users").select("*");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
testConnection();

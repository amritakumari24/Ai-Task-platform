const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const redis = require("./config/redis");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
require("dotenv").config();
const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests. Please try again later.",
});

app.use(limiter);


app.get("/", (req, res) => {
  res.json({
    message: "AI Task Processing Platform API is running!",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is healthy",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

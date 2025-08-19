import express from "express";
import "dotenv/config";
import userRoutes from "./routes/user/userRoutes.js";
import bookRoutes from "./routes/book/bookRoutes.js";

import connectDB from "./config/db.js";
connectDB();

const app = express();

// allows us to parse incoming requests:req.body
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running ${process.env.NODE_ENV} mode on port ${PORT}`)
);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connect");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    const db = await connectDB();
    app.set("db", db);

    app.use("/api/auth", authRoutes);
    app.use("/api/todos", todoRoutes);
    app.use("/api/user/profile", userRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log(`Falied to start server: ${error}`);
  }
};

startServer();

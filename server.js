require("dotenv").config();

const express = require("express");
const { errors } = require("celebrate");

const connectDB = require("./config/database");

const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);

// Celebrate Error Handler
app.use(errors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
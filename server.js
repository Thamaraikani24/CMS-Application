require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const articleRoutes = require("./routes/articleroutes");

const app = express();

connectDB();

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/articles", articleRoutes);


app.get("/", (req, res) => {
    res.send("CMS Backend Running...");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});
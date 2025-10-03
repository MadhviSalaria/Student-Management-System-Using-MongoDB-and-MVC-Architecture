const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(bodyParser.json());

// Connect Database
connectDB();

// Routes
app.use("/products", productRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

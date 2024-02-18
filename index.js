const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const routes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected to "roxiler" database'))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/roxiler", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

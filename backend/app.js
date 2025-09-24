const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Added for working with file paths
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const app = express();
require('dotenv').config();

//!Connect to mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

//! Cors config
const corsOptions = {
  origin: ["http://localhost:5173", "YOUR_DEPLOYED_FRONTEND_URL"], // Added placeholder for your deployed frontend
};
app.use(cors(corsOptions));

//!Middlewares
app.use(express.json()); //?Pass incoming json data

//!Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", transactionRouter);

//!---Serve frontend---
// This should be placed after your API routes
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});


//! Error
app.use(errorHandler);

//!Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running on this port... ${PORT} `)
);
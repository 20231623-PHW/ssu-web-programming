require("dotenv").config();
const express = require("express");
const MainRouter = require("./routes/router");
const path = require("path");

const { connectDB } = require("./modules/database");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

// 템플릿 폴더 설정
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", MainRouter);

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("MongoDB connection established.");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

const express = require("express");
const postRouter = require("./post.router");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

router.use("/posts", postRouter);

module.exports = router;

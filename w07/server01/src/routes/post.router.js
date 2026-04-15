const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../modules/database");
const router = express.Router();

// GET /posts
router.get("/", async (req, res) => {
  const posts = await getDB().collection("posts").find({}).toArray();
  console.log(posts);

  res.render("posts", { title: "Posts", posts });
});

router.get("/create", (req, res) => {
  res.render("create", { title: "Create Post" });
});

router.post("/create", async (req, res) => {
  const { title, content } = req.body;
  await getDB().collection("posts").insertOne({ title, content });
  res.redirect("/posts");
});

router.post("/:id/delete", async (req, res) => {
  const { id } = req.params;
  await getDB()
    .collection("posts")
    .deleteOne({ _id: new ObjectId(id) });
  res.redirect("/posts");
});

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const post = await getDB()
    .collection("posts")
    .findOne({ _id: new ObjectId(id) });

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("edit", { title: "Edit Post", post });
});

router.post("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  await getDB()
    .collection("posts")
    .updateOne({ _id: new ObjectId(id) }, { $set: { title, content } });

  res.redirect("/posts");
});

// Delete All
router.get("/delete-all", async (req, res) => {
  await getDB().collection("posts").deleteMany({});
  res.redirect("/posts");
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await getDB()
    .collection("posts")
    .findOne({ _id: new ObjectId(id) });

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("post", { title: post.title, post });
});

module.exports = router;

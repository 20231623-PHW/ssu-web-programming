const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  res.send("Hello World!");
});

app.patch("/", (req, res) => {
  res.send("Hello World!");
});

app.put("/", (req, res) => {
  res.send("Hello World!");
});

app.delete("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
});

app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});

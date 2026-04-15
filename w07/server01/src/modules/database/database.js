const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("admin");
  console.log("MongoDB connected");
}

function getDB() {
  if (!db) {
    throw new Error("DB is not connected yet");
  }
  return db;
}

module.exports = {
  connectDB,
  getDB,
};

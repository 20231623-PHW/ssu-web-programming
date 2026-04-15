require("dotenv").config();
const mongo = require("mongodb").MongoClient;
const express = require("express");

// MongoDB 연결 설정
const uri = process.env.MONGODB_URI;
const client = new mongo(uri);

const app = express();

const port = 3000;

(async () => {
  await client.connect();
  console.log("MongoDB에 연결되었습니다.");
})();

const db = client.db("admin");
const collection = db.collection("test");

// Express 라우트 설정
app.get("/", async (req, res) => {
  try {
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error("데이터 조회 실패:", error);
    res.status(500).send("서버 오류");
  }
});

app.get("/add", async (req, res) => {
  try {
    const result = await collection.insertOne({
      name: "Test",
      value: Math.random(),
    });
    res.json(result);
  } catch (error) {
    console.error("데이터 추가 실패:", error);
    res.status(500).send("서버 오류");
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

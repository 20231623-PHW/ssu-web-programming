const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;
const HOST = "127.0.0.1";

let nextId = 3;
let posts = [
  {
    id: 1,
    title: "첫 번째 글",
    writer: "홍길동",
    content: "기초 CRUD 게시판 예시입니다.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Swagger 문서",
    writer: "김학생",
    content: "상단의 API 문서 버튼을 눌러 Swagger 페이지를 확인할 수 있습니다.",
    createdAt: new Date().toISOString(),
  },
];

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "기초 CRUD 게시판 API",
      version: "1.0.0",
      description: "Express로 만든 아주 간단한 게시판 API 문서입니다.",
    },
    servers: [
      {
        url: `http://${HOST}:${PORT}`,
      },
    ],
  },
  apis: ["./server.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: 첫 번째 글
 *         writer:
 *           type: string
 *           example: 홍길동
 *         content:
 *           type: string
 *           example: 게시글 내용입니다.
 *         createdAt:
 *           type: string
 *           example: 2026-05-13T06:00:00.000Z
 *     PostInput:
 *       type: object
 *       required:
 *         - title
 *         - writer
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           example: 새 글 제목
 *         writer:
 *           type: string
 *           example: 작성자
 *         content:
 *           type: string
 *           example: 새 글 내용입니다.
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: 게시글 목록 조회
 *     responses:
 *       200:
 *         description: 게시글 목록을 반환합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: 게시글 하나 조회
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 게시글 번호
 *     responses:
 *       200:
 *         description: 게시글 하나를 반환합니다.
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
app.get("/api/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  res.json(post);
});

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: 게시글 작성
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: 새 게시글을 작성합니다.
 *       400:
 *         description: 입력값이 부족합니다.
 */
app.post("/api/posts", (req, res) => {
  const { title, writer, content } = req.body;

  if (!title || !writer || !content) {
    return res.status(400).json({ message: "title, writer, content를 모두 입력하세요." });
  }

  const newPost = {
    id: nextId,
    title,
    writer,
    content,
    createdAt: new Date().toISOString(),
  };

  nextId += 1;
  posts.push(newPost);

  res.status(201).json(newPost);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: 게시글 수정
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: 게시글을 수정합니다.
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
app.put("/api/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  const { title, writer, content } = req.body;

  if (!title || !writer || !content) {
    return res.status(400).json({ message: "title, writer, content를 모두 입력하세요." });
  }

  post.title = title;
  post.writer = writer;
  post.content = content;

  res.json(post);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: 게시글 삭제
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글을 삭제합니다.
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
app.delete("/api/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  posts = posts.filter((item) => item.id !== id);

  res.json({ message: "게시글이 삭제되었습니다." });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Swagger docs are available at http://${HOST}:${PORT}/api-docs`);
});

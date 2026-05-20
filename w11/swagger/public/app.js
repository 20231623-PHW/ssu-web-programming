const postForm = document.querySelector("#postForm");
const postIdInput = document.querySelector("#postId");
const titleInput = document.querySelector("#title");
const writerInput = document.querySelector("#writer");
const contentInput = document.querySelector("#content");
const postList = document.querySelector("#postList");
const formTitle = document.querySelector("#formTitle");
const cancelButton = document.querySelector("#cancelButton");

async function loadPosts() {
  const response = await fetch("/api/posts");
  const posts = await response.json();

  postList.innerHTML = "";

  if (posts.length === 0) {
    postList.innerHTML = '<div class="empty">아직 작성된 게시글이 없습니다.</div>';
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement("article");
    card.className = "post-card";

    card.innerHTML = `
      <h3>${post.title}</h3>
      <p class="meta">작성자: ${post.writer} | 작성일: ${new Date(post.createdAt).toLocaleString()}</p>
      <p class="content">${post.content}</p>
      <div class="button-row">
        <button class="edit-button" type="button">수정</button>
        <button class="delete-button" type="button">삭제</button>
      </div>
    `;

    card.querySelector(".edit-button").addEventListener("click", () => startEdit(post));
    card.querySelector(".delete-button").addEventListener("click", () => deletePost(post.id));

    postList.appendChild(card);
  });
}

function startEdit(post) {
  postIdInput.value = post.id;
  titleInput.value = post.title;
  writerInput.value = post.writer;
  contentInput.value = post.content;
  formTitle.textContent = "게시글 수정";
}

function resetForm() {
  postIdInput.value = "";
  titleInput.value = "";
  writerInput.value = "";
  contentInput.value = "";
  formTitle.textContent = "게시글 작성";
}

async function deletePost(id) {
  if (!confirm("정말 삭제하시겠습니까?")) {
    return;
  }

  await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });

  resetForm();
  loadPosts();
}

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const postId = postIdInput.value;
  const postData = {
    title: titleInput.value,
    writer: writerInput.value,
    content: contentInput.value,
  };

  if (!postData.title || !postData.writer || !postData.content) {
    alert("제목, 작성자, 내용을 모두 입력하세요.");
    return;
  }

  if (postId) {
    await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
  } else {
    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
  }

  resetForm();
  loadPosts();
});

cancelButton.addEventListener("click", resetForm);

loadPosts();

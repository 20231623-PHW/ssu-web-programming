const pages = document.querySelectorAll(".page");
const header = document.getElementById("header");

const menuMap = {
  "page-2": document.getElementById("page-2-btn"),
  "page-3": document.getElementById("page-3-btn"),
  "page-4": document.getElementById("page-4-btn"),
  "page-5": document.getElementById("page-5-btn"),
};

const bottomBar = document.getElementById("bottom-bar");
const bottomBarTextMap = {
  "page-2": "안녕하세요! 글로벌미디어학부 23학번 박현우입니다!",
  "page-3": "저는 다양한 기술들을 사용해봤어요",
  "page-4": "실력에 상관없이, 같이 적극적으로 공부하실 분들을 찾고 있어요!",
  "page-5": "함께 재미있는 경험과 시간이 되었으면 좋겠습니다!",
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const pageId = entry.target.id;

        // 1. header class 변경
        header.className = `header header-${pageId}`;

        // 2. 메뉴 active 변경
        Object.values(menuMap).forEach((el) =>
          el.classList.remove("header-menu-item-active"),
        );

        if (menuMap[pageId]) {
          menuMap[pageId].classList.add("header-menu-item-active");
        }

        // 3. 하단 바 텍스트 변경
        bottomBar.style.display = "none"; // 일단 숨긴 후, 텍스트가 있으면 보여주기
        if (bottomBarTextMap[pageId]) {
          bottomBar.style.display = "block";
          bottomBar.textContent = bottomBarTextMap[pageId];
        }
      }
    });
  },
  {
    threshold: 0.6, // 60% 이상 보일 때 활성화
  },
);

pages.forEach((page) => observer.observe(page));

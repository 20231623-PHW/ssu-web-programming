// #id circle 요소가 현재 마우스 위치를 따라가는 기능을 구현해보세요.

const circle = document.getElementById("circle");
const circle_width = circle.offsetWidth;
const circle_height = circle.offsetHeight;
let lastMouseX = window.innerWidth / 2;
let lastMouseY = window.innerHeight / 2;

function updateCirclePosition(clientX, clientY) {
  circle.style.left = `${clientX - circle_width / 2}px`;
  circle.style.top = `${clientY - circle_height / 2}px`;
}

window.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;
  lastMouseX = clientX;
  lastMouseY = clientY;

  if (!shouldApplyGravity()) {
    updateCirclePosition(clientX, clientY);
  }
});

// 마우스를 누르고 있으면 원의 색상이 빨간색으로 바뀌도록 구현해보세요.
let isMousePressed = false;

window.addEventListener("mousedown", () => {
  isMousePressed = true;
  updateCircleColor();
});

window.addEventListener("mouseup", () => {
  isMousePressed = false;
  updateCircleColor();
});

// 마우스 휠에 따라 원의 크기가 커지거나 작아지도록 구현해보세요.

let scale = 1;
window.addEventListener("wheel", (event) => {
  event.preventDefault();
  const delta = event.deltaY;
  scale = delta > 0 ? scale * 0.9 : scale * 1.1;
  circle.style.transform = `scale(${scale})`;
});

// 마우스가 화면 밖으로 나갈 경우 원이 중력 효과를 받으며 화면 아래로 떨어지는 기능을 구현해보세요.
let isMouseInside = true;
let isFollowingMouse = true;
let gravityAnimationId = null;
let fallVelocity = 0;
const gravityAcceleration = 0.5;
const bounceRestitution = 0.7;
const minBounceVelocity = 2;

function getFloorTop() {
  const baseHeight = circle.offsetHeight;
  const renderedHeight = circle.getBoundingClientRect().height;
  const visualBottomOffset = baseHeight + (renderedHeight - baseHeight) / 2;
  return Math.max(0, window.innerHeight - visualBottomOffset);
}

function shouldApplyGravity() {
  return !isFollowingMouse || !isMouseInside;
}

function updateCircleColor() {
  if (isMousePressed) {
    circle.style.backgroundColor = "red";
    return;
  }

  circle.style.backgroundColor = shouldApplyGravity() ? "blue" : "#000000";
}

function applyGravity() {
  if (!shouldApplyGravity()) {
    gravityAnimationId = null;
    return;
  }

  const currentTop = parseFloat(circle.style.top) || 0;
  const floorTop = getFloorTop();

  fallVelocity += gravityAcceleration;
  let nextTop = currentTop + fallVelocity;

  if (nextTop >= floorTop) {
    nextTop = floorTop;

    const bounceVelocity = Math.abs(fallVelocity) * bounceRestitution;
    if (bounceVelocity < minBounceVelocity) {
      fallVelocity = 0;
      circle.style.top = `${nextTop}px`;
      gravityAnimationId = null;
      return;
    }

    fallVelocity = -bounceVelocity;
  }

  circle.style.top = `${nextTop}px`;
  gravityAnimationId = requestAnimationFrame(applyGravity);
}

function startGravity({ keepMouseInside = false } = {}) {
  if (!keepMouseInside) {
    isMouseInside = false;
  }

  fallVelocity = 0;
  updateCircleColor();

  if (gravityAnimationId === null && shouldApplyGravity()) {
    applyGravity();
  }
}

function stopGravity() {
  isFollowingMouse = true;
  isMouseInside = true;
  fallVelocity = 0;
  updateCirclePosition(lastMouseX, lastMouseY);
  updateCircleColor();

  if (gravityAnimationId !== null) {
    cancelAnimationFrame(gravityAnimationId);
    gravityAnimationId = null;
  }
}

document.addEventListener("mouseout", (event) => {
  if (event.relatedTarget === null && isFollowingMouse) {
    startGravity();
  }
});

document.addEventListener("mouseover", (event) => {
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  if (!isMouseInside) {
    isMouseInside = true;

    if (isFollowingMouse) {
      stopGravity();
    } else {
      updateCircleColor();
    }
  }
});

document.addEventListener("click", (event) => {
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  if (isFollowingMouse) {
    isFollowingMouse = false;
    startGravity({ keepMouseInside: true });
  } else {
    stopGravity();
  }
});

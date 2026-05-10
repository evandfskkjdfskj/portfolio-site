/** 若任一切片 404，显示兜底说明 */
const stack = document.getElementById("shuaitu-body-stack");
const fallback = document.getElementById("project-shuaitu-fallback");
if (stack && fallback) {
  stack.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      fallback.hidden = false;
    });
  });
}

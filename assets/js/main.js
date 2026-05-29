const header = document.querySelector(".site-header");

const toggleHeaderShadow = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
};

window.addEventListener("scroll", toggleHeaderShadow, { passive: true });
toggleHeaderShadow();

document.querySelectorAll(".skills-bar-container .percent").forEach((percent, index) => {
  window.setTimeout(() => {
    percent.textContent = percent.dataset.percent;
  }, 700 + index * 150);
});

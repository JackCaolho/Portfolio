const header = document.querySelector(".site-header");

const toggleHeaderShadow = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
};

window.addEventListener("scroll", toggleHeaderShadow, { passive: true });
toggleHeaderShadow();

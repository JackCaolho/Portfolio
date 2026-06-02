const loader = document.getElementById("loader");
const loaderPercent = document.getElementById("loaderPercent");
const header = document.getElementById("header");
const navMenu = document.getElementById("navMenu");
const menuToggle = document.getElementById("menuToggle");

let loaderValue = 0;
const loaderTimer = window.setInterval(() => {
  loaderValue = Math.min(loaderValue + Math.ceil(Math.random() * 18), 100);
  if (loaderPercent) loaderPercent.textContent = `${loaderValue}%`;

  if (loaderValue >= 100) {
    window.clearInterval(loaderTimer);
    window.setTimeout(() => loader?.classList.add("hidden"), 280);
  }
}, 90);

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === entry.target.id);
    });
  });
}, { threshold: 0.34 });

sections.forEach((section) => sectionObserver.observe(section));

const revealTargets = document.querySelectorAll(".section-header, .card-panel, .skill-category, .timeline-item, .project-card, .contact-item, .contact-form");
revealTargets.forEach((target) => target.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -80px 0px" });

revealTargets.forEach((target) => revealObserver.observe(target));

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const item = entry.target;
    const percent = Number(item.dataset.percent || 0);
    const progress = item.querySelector(".skill-bar span");
    const label = item.querySelector(".skill-header strong");

    if (progress) progress.style.width = `${percent}%`;

    let value = 0;
    const counter = window.setInterval(() => {
      value += Math.max(1, Math.ceil(percent / 32));
      if (value >= percent) {
        value = percent;
        window.clearInterval(counter);
      }
      if (label) label.textContent = `${value}%`;
    }, 34);

    skillObserver.unobserve(item);
  });
}, { threshold: 0.45 });

document.querySelectorAll(".skill-item").forEach((item) => skillObserver.observe(item));

const particles = document.getElementById("particles");
const symbols = ["SQL", "BI", "ETL", "KPI", "API", "DAX", "CSV", "DW", "SLA", "HOP"];

if (particles) {
  for (let i = 0; i < 22; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.animationDuration = `${9 + Math.random() * 8}s`;
    particles.appendChild(particle);
  }
}

const projectImageExtensions = ["png", "jpg", "jpeg", "webp"];
const projectImageLimit = 10;

function findProjectImage(folder, index) {
  const padded = String(index).padStart(2, "0");

  return new Promise((resolve) => {
    let extensionIndex = 0;

    const tryNextExtension = () => {
      if (extensionIndex >= projectImageExtensions.length) {
        resolve(null);
        return;
      }

      const extension = projectImageExtensions[extensionIndex];
      const src = `assets/projects/${folder}/${padded}.${extension}`;
      const image = new Image();

      image.onload = () => resolve(src);
      image.onerror = () => {
        extensionIndex += 1;
        tryNextExtension();
      };
      image.src = src;
    };

    tryNextExtension();
  });
}

async function loadProjectImages(folder) {
  const attempts = [];

  for (let index = 1; index <= projectImageLimit; index += 1) {
    attempts.push(findProjectImage(folder, index));
  }

  const results = await Promise.all(attempts);
  return results.filter(Boolean);
}

function renderProjectCarousel(carousel, images) {
  const title = carousel.dataset.title || "Projeto";
  let currentIndex = 0;

  carousel.innerHTML = `
    <div class="carousel-stage"></div>
    <div class="carousel-controls">
      <button class="carousel-btn" type="button" aria-label="Imagem anterior">‹</button>
      <div class="carousel-dots" aria-label="Navegação das imagens"></div>
      <button class="carousel-btn" type="button" aria-label="Próxima imagem">›</button>
    </div>
  `;

  const stage = carousel.querySelector(".carousel-stage");
  const dots = carousel.querySelector(".carousel-dots");
  const buttons = carousel.querySelectorAll(".carousel-btn");

  if (!images.length) {
    stage.innerHTML = `
      <div class="carousel-placeholder">
        <span>
          <strong>${title}</strong>
          Adicione imagens em assets/projects/${carousel.dataset.project}/ usando 01.png, 02.png, 03.png...
        </span>
      </div>
    `;
    buttons.forEach((button) => button.setAttribute("disabled", "true"));
    return;
  }

  const updateCarousel = () => {
    stage.innerHTML = `<img src="${images[currentIndex]}" alt="${title} - imagem ${currentIndex + 1}">`;
    dots.querySelectorAll(".carousel-dot").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  };

  images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver imagem ${index + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
    });
    dots.appendChild(dot);
  });

  buttons[0].addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
  });

  buttons[1].addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  });

  updateCarousel();
}

document.querySelectorAll(".project-carousel").forEach(async (carousel) => {
  const folder = carousel.dataset.project;
  if (!folder) return;

  const images = await loadProjectImages(folder);
  renderProjectCarousel(carousel, images);
});

document.getElementById("contactForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = data.get("name") || "";
  const email = data.get("email") || "";
  const subject = data.get("subject") || "Contato pelo portfolio";
  const message = data.get("message") || "";

  const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:gustavoallify@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  form.reset();
});

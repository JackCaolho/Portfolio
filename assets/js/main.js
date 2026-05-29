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

const revealTargets = document.querySelectorAll(".section-header, .card-panel, .stat-item, .skill-category, .timeline-item, .project-card, .contact-item, .contact-form");
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

document.querySelectorAll(".stat-item strong[data-count]").forEach((stat) => {
  const target = Number(stat.dataset.count || 0);
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      let value = 0;
      const counter = window.setInterval(() => {
        value += Math.max(1, Math.ceil(target / 28));
        if (value >= target) {
          value = target;
          window.clearInterval(counter);
        }
        stat.textContent = target === 100 ? `${value}%` : String(value);
      }, 38);

      statObserver.unobserve(stat);
    });
  }, { threshold: 0.55 });

  statObserver.observe(stat);
});

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

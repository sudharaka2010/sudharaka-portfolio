const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const progressBar = document.querySelector(".scroll-progress span");
const heroMedia = document.querySelector(".hero-media video");

function updateScrollEffects() {
  const scrollY = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle("scrolled", scrollY > 24);
  progressBar.style.width = `${scrollable > 0 ? (scrollY / scrollable) * 100 : 0}%`;

  if (heroMedia && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && scrollY < window.innerHeight) {
    heroMedia.style.transform = `scale(1.025) translate3d(0, ${scrollY * 0.08}px, 0)`;
  }
}

function closeMenu() {
  menuButton.classList.remove("open");
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  document.body.style.overflow = "";
}

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  document.body.style.overflow = isOpen ? "hidden" : "";
});

navItems.forEach((item) => item.addEventListener("click", closeMenu));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-38% 0px -52% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 780) closeMenu();
  updateScrollEffects();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
updateScrollEffects();

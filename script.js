const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

function closeMenu() {
  menuButton.classList.remove('open');
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.classList.toggle('open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navItems.forEach((item) => item.addEventListener('click', closeMenu));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeMenu();
});

document.getElementById('year').textContent = new Date().getFullYear();
updateHeader();

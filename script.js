const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const inicioLink = document.querySelector('.main-nav a[href="#top"]');
const sectionLinks = new Map();
navLinks.forEach((link) => {
  const hash = link.getAttribute('href');
  if (!hash || hash === '#top' || !hash.startsWith('#')) return;
  const target = document.getElementById(hash.slice(1));
  if (target) sectionLinks.set(target, link);
});

if (sectionLinks.size && 'IntersectionObserver' in window) {
  const intersecting = new Set();

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          intersecting.add(entry.target);
        } else {
          intersecting.delete(entry.target);
        }
      });

      navLinks.forEach((link) => link.classList.remove('active'));
      const activeSection = [...sectionLinks.keys()].find((section) => intersecting.has(section));

      if (activeSection) {
        sectionLinks.get(activeSection).classList.add('active');
      } else if (inicioLink) {
        inicioLink.classList.add('active');
      }
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sectionLinks.forEach((_, section) => navObserver.observe(section));
}

const currentYear = document.getElementById('year');
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    if (!button) return;

    const defaultText = button.textContent;
    button.disabled = true;
    button.textContent = 'Enviando...';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        button.textContent = 'Mensaje enviado';
        contactForm.reset();
      } else {
        button.textContent = 'Error, intenta de nuevo';
      }
    } catch (error) {
      console.error('Error al enviar el formulario de contacto:', error);
      button.textContent = 'Error, intenta de nuevo';
    }

    window.setTimeout(() => {
      button.textContent = defaultText;
      button.disabled = false;
    }, 2500);
  });
}

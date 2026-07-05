/**
 * Pedro Ariel Caseres — Portfolio Website
 * Main JavaScript: hamburger menu, scroll effects, active-link highlighting, form validation
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================
     Element References
     ============================ */
  const navbar        = document.getElementById('navbar');
  const hamburgerBtn  = document.getElementById('hamburger-btn');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const mobileMenu    = document.getElementById('mobile-menu');
  const navPills      = document.querySelectorAll('.nav-pill');
  const mobileLinks   = document.querySelectorAll('.mobile-nav-link');
  const sections      = document.querySelectorAll('section[id]');
  const contactForm   = document.getElementById('contact-form');

  /* ============================
     Hamburger Menu
     ============================ */
  function openMenu() {
    mobileMenu.classList.remove('hidden');
    hamburgerIcon.classList.replace('fa-bars', 'fa-xmark');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.add('hidden');
    hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('hidden') ? openMenu() : closeMenu();
  });

  // Close on mobile link click
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      !mobileMenu.classList.contains('hidden') &&
      !mobileMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ============================
     Navbar Background on Scroll
     ============================ */
  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-100');
    } else {
      navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-100');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ============================
     Active Nav Link (IntersectionObserver)
     ============================ */
  function setActiveLink(sectionId) {
    const href = `#${sectionId}`;
    navPills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('href') === href);
    });
    mobileLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === href);
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: '-20% 0px -75% 0px', threshold: 0 }
  );

  sections.forEach(section => sectionObserver.observe(section));

  /* ============================
     Scroll-Triggered Animations
     ============================ */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animationObserver.unobserve(entry.target);   // animate only once
        }
      });
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
  );

  animatedElements.forEach(el => animationObserver.observe(el));

  /* ============================
     Contact Form Validation
     ============================ */
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    clearErrors();

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const details = document.getElementById('details');
    let valid = true;

    if (!name.value.trim()) {
      showError(name, 'El nombre es requerido');
      valid = false;
    }

    if (!email.value.trim()) {
      showError(email, 'El correo electrónico es requerido');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, 'Ingresá un correo electrónico válido');
      valid = false;
    }

    if (!details.value.trim()) {
      showError(details, 'Los detalles son requeridos');
      valid = false;
    }

    if (valid) {
      showSuccess();
    }
  }

  function showError(input, message) {
    input.classList.add('border-red-500');
    const p = document.createElement('p');
    p.className = 'form-error text-red-500 text-sm mt-1';
    p.textContent = message;
    input.parentElement.appendChild(p);
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    document.querySelectorAll('.form-input').forEach(el => {
      el.classList.remove('border-red-500');
    });
  }

  function showSuccess() {
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    btn.innerHTML  = '<i class="fa-solid fa-check mr-2"></i>¡Mensaje enviado!';
    btn.disabled   = true;
    btn.classList.replace('bg-primary-700', 'bg-emerald-600');
    btn.classList.remove('hover:bg-primary-800');

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled  = false;
      btn.classList.replace('bg-emerald-600', 'bg-primary-700');
      btn.classList.add('hover:bg-primary-800');
      contactForm.reset();
    }, 3000);
  }
});

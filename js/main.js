/* ==========================================================================
   PORTFOLIO – main.js
   ========================================================================== */

/** Fallback nav height in px – must match --nav-height in style.css */
const NAV_HEIGHT_FALLBACK = 72;

/* --------------------------------------------------------------------------
   Theme toggle (dark / light)
   -------------------------------------------------------------------------- */
(function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------
     Helpers
     ----------------------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* -------------------------------------------------------------------------
     Theme toggle button
     ----------------------------------------------------------------------- */
  const themeToggle = $('#theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* -------------------------------------------------------------------------
     Mobile navigation burger
     ----------------------------------------------------------------------- */
  const burger = $('#nav-burger');
  const navMenu = $('#nav-menu');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      navMenu.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    $$('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !navMenu.contains(e.target)) {
        burger.classList.remove('open');
        navMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* -------------------------------------------------------------------------
     Header scroll effect
     ----------------------------------------------------------------------- */
  const header = $('#header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------------------------
     Active nav link on scroll (IntersectionObserver)
     ----------------------------------------------------------------------- */
  const sections = $$('section[id]');
  const navLinks = $$('.nav__link');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active-link'));
            const active = navLinks.find(
              link => link.getAttribute('href') === `#${entry.target.id}`
            );
            if (active) active.classList.add('active-link');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  /* -------------------------------------------------------------------------
     Typed text effect (Hero section)
     ----------------------------------------------------------------------- */
  const typedEl = $('#typed-text');
  if (typedEl) {
    const words = [
      'web experiences.',
      'clean code.',
      'APIs & backends.',
      'mobile apps.',
      'great products.',
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 120;

    function type() {
      const current = words[wordIndex];

      if (isDeleting) {
        typedEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        delay = 60;
      } else {
        typedEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        delay = 120;
      }

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        delay = 1800; // pause before deleting
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }

      setTimeout(type, delay);
    }

    setTimeout(type, 600);
  }

  /* -------------------------------------------------------------------------
     Scroll-reveal animation (IntersectionObserver)
     ----------------------------------------------------------------------- */
  $$('.section__header, .about__image-col, .about__text-col, ' +
     '.skills__category, .project-card, .contact__info, .contact__form, ' +
     '.stat-card').forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* -------------------------------------------------------------------------
     Project filter buttons
     ----------------------------------------------------------------------- */
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* -------------------------------------------------------------------------
     Contact form validation & submission (simulated)
     ----------------------------------------------------------------------- */
  const form = $('#contact-form');
  if (form) {
    const submitBtn = $('#submit-btn');
    const successEl = $('#form-success');

    const validators = {
      name: v => v.trim().length >= 2 ? '' : 'Please enter your name (min 2 characters).',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
      subject: v => v.trim().length >= 3 ? '' : 'Please enter a subject (min 3 characters).',
      message: v => v.trim().length >= 10 ? '' : 'Please enter a message (min 10 characters).',
    };

    function validateField(input) {
      const name = input.name;
      const errorEl = input.parentElement.querySelector('.form__error');
      const error = validators[name] ? validators[name](input.value) : '';
      if (errorEl) errorEl.textContent = error;
      input.classList.toggle('error', !!error);
      return !error;
    }

    // Validate on blur
    $$('input, textarea', form).forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = $$('input, textarea', form);
      const valid = inputs.map(inp => validateField(inp)).every(Boolean);

      if (!valid) return;

      // Simulate sending
      const btnText = submitBtn.querySelector('.btn__text');
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending…';

      setTimeout(() => {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message';
        form.reset();
        if (successEl) {
          successEl.textContent = "✓ Message sent! I'll get back to you soon.";
          setTimeout(() => { successEl.textContent = ''; }, 5000);
        }
      }, 1500);
    });
  }

  /* -------------------------------------------------------------------------
     Back-to-top button
     ----------------------------------------------------------------------- */
  const backToTop = $('#back-to-top');
  if (backToTop) {
    const toggleVisibility = () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -------------------------------------------------------------------------
     Footer year
     ----------------------------------------------------------------------- */
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------------------------
     Smooth scroll for anchor links
     ----------------------------------------------------------------------- */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = $(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || NAV_HEIGHT_FALLBACK;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});

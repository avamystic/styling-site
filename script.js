/* ============================================
   NAVIGATION
   ============================================ */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

function updateNav() {
  nav.classList.toggle('is-scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', e => {
  if (!nav.contains(e.target)) {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
const fadeObserver = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      fadeObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach((el, i) => {
  // Stagger sibling items naturally
  const siblings = el.parentElement?.querySelectorAll('.fade-up');
  if (siblings && siblings.length > 1) {
    const idx = Array.from(siblings).indexOf(el);
    el.style.transitionDelay = `${idx * 0.06}s`;
  }
  fadeObserver.observe(el);
});

/* ============================================
   CONTACT FORM
   ============================================ */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

if (form) {
  // Per-field validation
  function validate(input) {
    const errorEl = document.getElementById(`${input.id}-error`);
    if (!errorEl) return true;

    let msg = '';
    const val = input.value.trim();

    if (input.required && !val) {
      msg = 'This field is required.';
    } else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      msg = 'Please enter a valid email address.';
    }

    errorEl.textContent = msg;
    input.classList.toggle('has-error', !!msg);
    if (msg) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    return !msg;
  }

  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validate(el));
    el.addEventListener('input', () => {
      if (el.classList.contains('has-error')) validate(el);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Honeypot check
    const honeypot = form.querySelector('[name="website"]');
    if (honeypot?.value) return;

    // Validate
    const ids = ['name', 'email', 'message'];
    const allValid = ids.every(id => validate(document.getElementById(id)));
    if (!allValid) {
      form.querySelector('.has-error')?.focus();
      return;
    }

    // Loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    const payload = {
      name:    document.getElementById('name').value.trim(),
      email:   document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim(),
    };

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        formStatus.textContent = 'Thank you — your message was sent. I’ll be in touch soon.';
        formStatus.classList.add('is-success');
        form.reset();
        ids.forEach(id => {
          const el = document.getElementById(id);
          if (el) { el.classList.remove('has-error'); el.removeAttribute('aria-invalid'); }
        });
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.errors?.[0]?.message || `Server error ${res.status}`);
      }
    } catch (err) {
      formStatus.textContent = `Something went wrong — please try again, or email me directly. (${err.message})`;
      formStatus.classList.add('is-error');
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });
}

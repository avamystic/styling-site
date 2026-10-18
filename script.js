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

document.querySelectorAll('.fade-up').forEach(el => {
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
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  const REQUIRED_IDS = ['name', 'email', 'brings', 'change'];

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

  REQUIRED_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validate(el));
    el.addEventListener('input', () => {
      if (el.classList.contains('has-error')) validate(el);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Honeypot
    if (form.querySelector('[name="website"]')?.value) return;

    // Validate required fields
    const allValid = REQUIRED_IDS.every(id => validate(document.getElementById(id)));
    if (!allValid) {
      form.querySelector('.has-error')?.focus();
      return;
    }

    // Loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    const getValue = id => document.getElementById(id)?.value.trim() ?? '';

    const payload = {
      name:       getValue('name'),
      email:      getValue('email'),
      brings:     getValue('brings'),
      change:     getValue('change'),
      service:    getValue('service'),
      investment: getValue('investment'),
      timeline:   getValue('timeline'),
    };

    try {
      const res = await fetch('https://formspree.io/f/mbgdqypn', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (res.ok) {
        // Replace form with success state
        form.style.display = 'none';

        const successEl = document.createElement('div');
        successEl.className = 'form-success fade-up';
        successEl.innerHTML = `
          <p class="form-success__message">Thank you. The next step is a 15-minute consultation.</p>
          <a
            href="https://calendly.com/avachannel/15min"
            class="btn btn--primary"
            target="_blank"
            rel="noopener noreferrer"
          >Book your consultation</a>
        `;
        form.after(successEl);

        // Trigger fade-in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => successEl.classList.add('is-visible'));
        });

        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.errors?.[0]?.message || `Error ${res.status}`);
      }
    } catch (err) {
      // Show error inline below the submit button
      let errEl = form.querySelector('.form-submit-error');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form-error form-submit-error';
        submitBtn.after(errEl);
      }
      errEl.textContent = `Something went wrong — please try again. (${err.message})`;

      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });
}

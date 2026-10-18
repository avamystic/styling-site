/* ============================================
   TESTIMONIALS
   ============================================

   HOW TO ADD A REAL QUOTE:
   1. Copy one of the objects below.
   2. Set placeholder: false.
   3. Replace quote with the person's actual words.
   4. Update name and detail as needed.

   VISIBILITY RULE:
   Entries with placeholder: true appear only on localhost / *.pages.dev.
   On any other hostname (e.g. your custom domain), only placeholder: false
   entries are shown. If none remain, the whole section is hidden.
*/
const TESTIMONIALS = [
  {
    quote: 'Placeholder: this space is reserved for Corey\'s words.',
    name:   'Corey H.',
    detail: 'CEO to Musician, Global',
    placeholder: true,
  },
  {
    quote: 'Placeholder: this space is reserved for Sue\'s words.',
    name:   'Sue Z.',
    detail: 'General Counsel, NYC',
    placeholder: true,
  },
  {
    quote: 'Placeholder: this space is reserved for Kareem\'s words.',
    name:   'Kareem A.',
    detail: 'CEO, NYC',
    placeholder: true,
  },
  {
    quote: 'Placeholder: this space is reserved for Katie\'s words.',
    name:   'Katie G.',
    detail: 'Professor, NYC',
    placeholder: true,
  },
];

(function initTestimonials() {
  const isDevHost = ['localhost', '127.0.0.1'].includes(location.hostname)
    || location.hostname.endsWith('.pages.dev');

  const entries = TESTIMONIALS.filter(t => !t.placeholder || isDevHost);

  const section = document.getElementById('testimonials');
  if (!section) return;

  if (entries.length === 0) {
    section.hidden = true;
    return;
  }

  const stage   = document.getElementById('testimonialStage');
  const dotsEl  = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevQuote');
  const nextBtn = document.getElementById('nextQuote');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let timer   = null;

  // Build quote elements (all absolutely positioned; JS sets stage min-height)
  const quoteEls = entries.map((entry, i) => {
    const el = document.createElement('div');
    el.className = 'testimonials__quote' + (i === 0 ? ' is-active' : '');
    el.setAttribute('role', 'tabpanel');
    el.id = `quote-${i}`;
    el.innerHTML = `
      ${entry.placeholder ? '<span class="testimonials__placeholder-label" aria-label="Placeholder">Placeholder</span>' : ''}
      <blockquote class="testimonials__text">${entry.quote}</blockquote>
      <footer class="testimonials__attribution">
        <strong class="testimonials__name">${entry.name}</strong>
        <span class="testimonials__detail">${entry.detail}</span>
      </footer>
    `;
    stage.appendChild(el);
    return el;
  });

  // Build dots
  const dots = entries.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'testimonials__dot' + (i === 0 ? ' is-active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `Quote ${i + 1} of ${entries.length}`);
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.setAttribute('aria-controls', `quote-${i}`);
    btn.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsEl.appendChild(btn);
    return btn;
  });

  // Size the stage to the tallest quote so layout doesn't shift
  function setStageHeight() {
    quoteEls.forEach(el => { el.style.position = 'static'; el.style.visibility = 'hidden'; });
    const maxH = Math.max(...quoteEls.map(el => el.offsetHeight));
    quoteEls.forEach(el => { el.style.position = ''; el.style.visibility = ''; });
    stage.style.minHeight = maxH + 'px';
  }

  setStageHeight();
  window.addEventListener('resize', setStageHeight);

  function goTo(idx) {
    quoteEls[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (idx + entries.length) % entries.length;

    quoteEls[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); resetTimer(); }
  function prev() { goTo(current - 1); resetTimer(); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Left/right arrow keys when section is focused
  section.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { prev(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
  });

  // Touch swipe
  let touchStartX = 0;
  stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  // Autoplay — disabled when user prefers reduced motion or only one entry
  function startTimer() {
    if (reduceMotion || entries.length <= 1) return;
    timer = setInterval(() => goTo(current + 1), 7000);
  }

  function resetTimer() { clearInterval(timer); startTimer(); }

  section.addEventListener('mouseenter', () => clearInterval(timer));
  section.addEventListener('mouseleave', resetTimer);
  section.addEventListener('focusin',    () => clearInterval(timer));
  section.addEventListener('focusout',   resetTimer);

  startTimer();
})();

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

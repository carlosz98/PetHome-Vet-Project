/* =========================================================
   PetHome Veterinary Clinic — pet effects
   1.  Paw prints that walk across the home hero
   2.  A cat peeking over the "Due for a checkup?" banner
       (eyes follow the pointer, blinks, ducks, swats at the cursor)
   3.  Paw, bone and fish confetti (booking + paying a bill)
   4.  Click to leave a paw print (home page only)
   5.  Scroll progress bar with a running dog
   6.  Pet pattern backgrounds (CSS only, see styles.css)
   7.  Button ears + wagging tail, logo "boop" (CSS only)
   8.  Sleeping cat / puzzled dog empty states (art below,
       used by main.js)
   9.  Idle dog: peeks up from the corner after 20s of no activity
   10. Shy cat on the sign-in page: covers its eyes for passwords
   11. Pet photos react: head tilt on hover, hearts on click
   12. Paw-print page transitions between pages
   Everything that moves on its own is skipped when the visitor
   has "reduce motion" turned on.
   ========================================================= */

const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Shared shapes ---------- */
function pawSvg(cls = '') {
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS.paw}</svg>`;
}

const BONE_SVG = '<svg viewBox="0 0 26 12" aria-hidden="true"><circle cx="3.5" cy="3" r="3"/><circle cx="3.5" cy="9" r="3"/><circle cx="22.5" cy="3" r="3"/><circle cx="22.5" cy="9" r="3"/><rect x="3.5" y="3" width="19" height="6"/></svg>';

const FISH_SVG = '<svg viewBox="0 0 28 14" aria-hidden="true"><ellipse cx="11" cy="7" rx="11" ry="6.5"/><path d="M19 7 28 1v12Z"/><circle cx="6" cy="5.5" r="1.4" style="fill:var(--surface)"/></svg>';

const HEART_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.2 0 3.6 1.2 5.2 3 1.6-1.8 3-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21Z"/></svg>';

/* ---------- Art for empty states (used in main.js) ---------- */
const PET_ART = {
  sleepingCat: `<svg class="pet-art pet-art--cat" viewBox="0 0 180 104" aria-hidden="true">
    <g class="zzz">
      <text x="62" y="28" font-size="15">z</text>
      <text x="74" y="17" font-size="12">z</text>
      <text x="84" y="8" font-size="9">z</text>
    </g>
    <path class="sleep-tail" d="M150 84c20-2 26-24 6-32" stroke="var(--cat-fur)" stroke-width="10" fill="none" stroke-linecap="round"/>
    <g class="sleep-body">
      <ellipse cx="102" cy="76" rx="58" ry="24" fill="var(--cat-fur)"/>
      <path d="M92 54c-2 8-2 14 0 20M110 53c-2 9-2 15 0 21M128 56c-2 8-2 13 0 18" stroke="var(--cat-stripe)" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
    <path d="M28 62 31 36 48 51Z" fill="var(--cat-fur)"/>
    <path d="M74 62 71 36 54 51Z" fill="var(--cat-fur)"/>
    <path d="M32 56 33 43 42 51Z" fill="var(--cat-ear)"/>
    <path d="M70 56 69 43 60 51Z" fill="var(--cat-ear)"/>
    <ellipse cx="51" cy="72" rx="28" ry="24" fill="var(--cat-fur)"/>
    <path d="M51 49v8M43 51l2 7M59 51l-2 7" stroke="var(--cat-stripe)" stroke-width="3" stroke-linecap="round"/>
    <path d="M37 70q5 4 10 0M55 70q5 4 10 0" stroke="var(--pet-ink)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M48 78h6l-3 3Z" fill="var(--cat-ear)"/>
    <ellipse cx="62" cy="95" rx="12" ry="6" fill="var(--cat-fur)"/>
    <ellipse cx="40" cy="96" rx="12" ry="6" fill="var(--cat-fur)"/>
  </svg>`,

  puzzledDog: `<svg class="pet-art pet-art--dog" viewBox="0 0 140 124" aria-hidden="true">
    <text class="huh" x="104" y="30" font-size="28">?</text>
    <g class="tilt">
      <ellipse cx="34" cy="64" rx="12" ry="25" fill="var(--dog-ear)" transform="rotate(18 34 64)"/>
      <ellipse cx="98" cy="64" rx="12" ry="25" fill="var(--dog-ear)" transform="rotate(-18 98 64)"/>
      <ellipse cx="66" cy="68" rx="34" ry="32" fill="var(--dog-fur)"/>
      <ellipse cx="66" cy="86" rx="18" ry="13" fill="var(--dog-muzzle)"/>
      <circle cx="53" cy="63" r="4.6" fill="var(--pet-ink)"/>
      <circle cx="79" cy="63" r="4.6" fill="var(--pet-ink)"/>
      <circle cx="54.6" cy="61.4" r="1.4" fill="#FFFFFF"/>
      <circle cx="80.6" cy="61.4" r="1.4" fill="#FFFFFF"/>
      <path d="M46 54q6-4 11-1M75 53q5-3 11 1" stroke="var(--dog-ear)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="66" cy="80" rx="6" ry="4.5" fill="var(--pet-ink)"/>
      <path d="M66 84v5M60 90q6 4 12 0" stroke="var(--pet-ink)" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`
};

/* Small speech bubble helper used by the cat, idle dog and shy cat */
function sayIn(bubble, text, ms = 1800) {
  bubble.textContent = text;
  bubble.classList.add('is-visible');
  clearTimeout(bubble._timer);
  bubble._timer = setTimeout(() => bubble.classList.remove('is-visible'), ms);
}

/* =========================================================
   1. Walking paw prints (home hero)
   ========================================================= */
function initPawWalk() {
  const hero = document.querySelector('.hero');
  if (!hero || PREFERS_REDUCED_MOTION) return;

  const layer = document.createElement('div');
  layer.className = 'paw-walk';
  layer.setAttribute('aria-hidden', 'true');
  hero.prepend(layer);

  function walk() {
    if (document.hidden) return;
    const w = layer.clientWidth;
    const h = layer.clientHeight;
    const fromLeft = Math.random() < 0.5;
    const x0 = fromLeft ? -30 : w + 30;
    const x1 = fromLeft ? w + 30 : -30;
    const y0 = h * (0.6 + Math.random() * 0.3);
    const y1 = h * (0.25 + Math.random() * 0.6);
    const lift = 40 + Math.random() * 60;
    const steps = Math.max(8, Math.round(Math.abs(x1 - x0) / 64));

    const point = t => ({
      x: x0 + (x1 - x0) * t,
      y: y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * lift
    });

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const p = point(t);
      const ahead = point(Math.min(1, t + 0.01));
      const rad = Math.atan2(ahead.y - p.y, ahead.x - p.x);
      const side = i % 2 === 0 ? 1 : -1;
      const x = p.x + Math.cos(rad + Math.PI / 2) * 9 * side;
      const y = p.y + Math.sin(rad + Math.PI / 2) * 9 * side;
      const deg = rad * 180 / Math.PI + 90;
      const delay = i * 170;

      const print = document.createElement('span');
      print.className = 'walk-print';
      print.innerHTML = pawSvg();
      print.style.left = `${x}px`;
      print.style.top = `${y}px`;
      print.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
      print.style.animationDelay = `${delay}ms`;
      layer.appendChild(print);
      setTimeout(() => print.remove(), delay + 2800);
    }
  }

  setTimeout(walk, 1400);
  setInterval(walk, 9000);
}

/* =========================================================
   2. Cat peeking over the CTA banner
   ========================================================= */
const PEEK_CAT_SVG = `<svg viewBox="0 0 120 96" aria-hidden="true">
  <path d="M16 50 25 6 54 34Z" fill="var(--cat-fur)"/>
  <path d="M104 50 95 6 66 34Z" fill="var(--cat-fur)"/>
  <path d="M24 41 28 17 45 33Z" fill="var(--cat-ear)"/>
  <path d="M96 41 92 17 75 33Z" fill="var(--cat-ear)"/>
  <ellipse cx="60" cy="60" rx="47" ry="37" fill="var(--cat-fur)"/>
  <path d="M60 25v11M49 27l3 9M71 27l-3 9" stroke="var(--cat-stripe)" stroke-width="3.4" stroke-linecap="round"/>
  <g class="cat-eye">
    <ellipse cx="42" cy="57" rx="9.5" ry="10.5" fill="var(--cat-iris)"/>
    <g class="cat-pupil"><ellipse cx="42" cy="57" rx="3.4" ry="7.4" fill="var(--pet-ink)"/><circle cx="44" cy="53" r="1.8" fill="#FFFFFF"/></g>
  </g>
  <g class="cat-eye">
    <ellipse cx="78" cy="57" rx="9.5" ry="10.5" fill="var(--cat-iris)"/>
    <g class="cat-pupil"><ellipse cx="78" cy="57" rx="3.4" ry="7.4" fill="var(--pet-ink)"/><circle cx="80" cy="53" r="1.8" fill="#FFFFFF"/></g>
  </g>
  <path d="M56 70h8l-4 4.5Z" fill="var(--cat-ear)"/>
  <path d="M60 74.5c-1.5 4-6 4.5-8 2M60 74.5c1.5 4 6 4.5 8 2" stroke="var(--pet-ink)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M30 70 8 65M30 75 8 77M90 70l22-5M90 75l22 2" stroke="var(--pet-ink)" stroke-width="1.4" opacity=".45" stroke-linecap="round"/>
</svg>`;

const PEEK_PAWS_SVG = `<svg viewBox="0 0 100 20" aria-hidden="true">
  <g class="paw-l">
    <ellipse cx="20" cy="11" rx="15" ry="9" fill="var(--cat-fur)"/>
    <path d="M14 7v6M20 6v7M26 7v6" stroke="var(--cat-stripe)" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g class="paw-r">
    <ellipse cx="80" cy="11" rx="15" ry="9" fill="var(--cat-fur)"/>
    <path d="M74 7v6M80 6v7M86 7v6" stroke="var(--cat-stripe)" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

const CAT_LINES = ['Mrrp!', 'Book a checkup?', 'Prrrr…', 'Treats after?', 'Meow.'];

function initPeekCat() {
  const wraps = document.querySelectorAll('.cta-wrap');
  if (!wraps.length) return;

  const cats = [];

  wraps.forEach(wrap => {
    const cat = document.createElement('button');
    cat.type = 'button';
    cat.className = 'peek-cat';
    cat.setAttribute('aria-label', 'Pet the cat');
    cat.innerHTML = PEEK_CAT_SVG;

    const paws = document.createElement('div');
    paws.className = 'peek-paws';
    paws.setAttribute('aria-hidden', 'true');
    paws.innerHTML = PEEK_PAWS_SVG;

    const bubble = document.createElement('span');
    bubble.className = 'cat-bubble';
    bubble.setAttribute('role', 'status');
    bubble.setAttribute('aria-live', 'polite');

    wrap.append(cat, paws, bubble);
    cats.push({ wrap, cat, paws, pupils: [...cat.querySelectorAll('.cat-pupil')], lastSwat: 0 });

    /* Duck behind the banner when the button is hovered or focused */
    const btn = wrap.querySelector('.cta-band .btn');
    if (btn) {
      const duck = on => wrap.classList.toggle('cat-ducked', on);
      btn.addEventListener('mouseenter', () => duck(true));
      btn.addEventListener('mouseleave', () => duck(false));
      btn.addEventListener('focus', () => duck(true));
      btn.addEventListener('blur', () => duck(false));
    }

    /* Click the cat: it says something */
    let line = 0;
    cat.addEventListener('click', () => {
      sayIn(bubble, CAT_LINES[line % CAT_LINES.length]);
      line++;
      cat.classList.remove('is-happy');
      void cat.offsetWidth;
      cat.classList.add('is-happy');
    });

    /* Blink every few seconds */
    if (!PREFERS_REDUCED_MOTION) {
      const blink = () => {
        cat.classList.add('blink');
        setTimeout(() => cat.classList.remove('blink'), 170);
        setTimeout(blink, 2500 + Math.random() * 3500);
      };
      setTimeout(blink, 2000);
    }
  });

  /* Swat with the paw nearest the cursor */
  function swat(entry, side) {
    entry.lastSwat = performance.now();
    const cls = side === 'left' ? 'swat-left' : 'swat-right';
    entry.wrap.classList.remove('swat-left', 'swat-right');
    void entry.paws.offsetWidth;
    entry.wrap.classList.add(cls);
    setTimeout(() => entry.wrap.classList.remove(cls), 520);
  }

  /* Eyes follow the pointer; get close and the cat swats */
  let px = window.innerWidth / 2;
  let py = window.innerHeight / 2;
  let queued = false;
  const update = () => {
    queued = false;
    cats.forEach(entry => {
      entry.pupils.forEach(pupil => {
        const eye = pupil.parentElement.querySelector('ellipse').getBoundingClientRect();
        const cx = eye.left + eye.width / 2;
        const cy = eye.top + eye.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(4, dist / 30);
        pupil.style.transform = `translate(${(dx / dist) * reach}px, ${(dy / dist) * reach * 0.7}px)`;
      });

      if (PREFERS_REDUCED_MOTION || entry.wrap.classList.contains('cat-ducked')) return;
      const box = entry.cat.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const near = Math.hypot(px - cx, py - cy) < 120;
      const overCat = px > box.left && px < box.right && py > box.top && py < box.bottom;
      if (near && !overCat && performance.now() - entry.lastSwat > 900) {
        swat(entry, px < cx ? 'left' : 'right');
      }
    });
  };
  window.addEventListener('pointermove', e => {
    px = e.clientX;
    py = e.clientY;
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
}

/* =========================================================
   3. Paw, bone and fish confetti
   ========================================================= */
function burstPets(x, y, count = 34) {
  if (PREFERS_REDUCED_MOTION) return;
  const shapes = [pawSvg(), pawSvg(), BONE_SVG, FISH_SVG];
  const colors = ['var(--brand)', 'var(--orange)', 'var(--ok)', 'var(--cat-fur)', 'var(--brand-deep)'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'pet-confetti';
    el.innerHTML = shapes[i % shapes.length];
    el.style.color = colors[i % colors.length];
    const size = 14 + Math.random() * 14;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const speed = 110 + Math.random() * 220;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 120;
    const spin = (Math.random() - 0.5) * 540;

    const anim = el.animate([
      { transform: 'translate(-50%, -50%) scale(.3) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.4 },
      { transform: `translate(calc(-50% + ${dx * 1.25}px), calc(-50% + ${dy + 280}px)) scale(.85) rotate(${spin}deg)`, opacity: 0 }
    ], { duration: 1500 + Math.random() * 700, easing: 'cubic-bezier(.15,.7,.4,1)' });
    anim.onfinish = () => el.remove();
  }
}

function burstFrom(element, count) {
  if (!element) return;
  const r = element.getBoundingClientRect();
  burstPets(r.left + r.width / 2, r.top + r.height / 2, count);
}

/* =========================================================
   4. Click to leave a paw print (home page only)
   ========================================================= */
function initClickPaws() {
  if (document.body.dataset.page !== 'home' || PREFERS_REDUCED_MOTION) return;
  let live = 0;
  document.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    if (e.target.closest('a, button, input, select, textarea, label, [role="tab"], .peek-cat, .patient-photo, .idle-dog')) return;
    if (live > 12) return;
    live++;
    const print = document.createElement('span');
    print.className = 'click-paw';
    print.innerHTML = pawSvg();
    print.style.left = `${e.clientX}px`;
    print.style.top = `${e.clientY}px`;
    print.style.setProperty('--tilt', `${Math.round((Math.random() - 0.5) * 50)}deg`);
    document.body.appendChild(print);
    setTimeout(() => { print.remove(); live--; }, 1500);
  });
}

/* =========================================================
   5. Scroll progress bar with a running dog
   ========================================================= */
const RUN_DOG_SVG = `<svg viewBox="0 0 46 30" aria-hidden="true">
  <path class="dog-tail" d="M9 14C5 12 3.5 8 4.5 4.5" stroke="var(--dog-fur)" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <g class="dog-legs-back">
    <rect x="10.5" y="18" width="3.2" height="10" rx="1.6" fill="var(--dog-ear)"/>
    <rect x="25" y="18" width="3.2" height="10" rx="1.6" fill="var(--dog-ear)"/>
  </g>
  <g class="dog-body">
    <ellipse cx="19" cy="16" rx="11.5" ry="6.8" fill="var(--dog-fur)"/>
    <circle cx="33.5" cy="11" r="7" fill="var(--dog-fur)"/>
    <ellipse cx="40" cy="13.2" rx="4.4" ry="3.2" fill="var(--dog-muzzle)"/>
    <circle cx="43.6" cy="12.2" r="1.5" fill="var(--pet-ink)"/>
    <ellipse cx="30.5" cy="9.5" rx="2.6" ry="5.2" fill="var(--dog-ear)" transform="rotate(22 30.5 9.5)"/>
    <circle cx="35.6" cy="9.4" r="1.2" fill="var(--pet-ink)"/>
  </g>
  <g class="dog-legs-front">
    <rect x="14" y="18" width="3.2" height="10" rx="1.6" fill="var(--dog-fur)"/>
    <rect x="28.4" y="18" width="3.2" height="10" rx="1.6" fill="var(--dog-fur)"/>
  </g>
</svg>`;

function initScrollDog() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const track = document.createElement('div');
  track.className = 'scroll-track';
  track.setAttribute('aria-hidden', 'true');
  track.innerHTML = `<div class="scroll-fill"></div><div class="scroll-dog">${RUN_DOG_SVG}</div>`;
  header.appendChild(track);

  let lastY = window.scrollY;
  let stopTimer;
  let queued = false;

  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    track.style.setProperty('--p', p.toFixed(4));
    track.classList.toggle('is-visible', max > 200 && y > 8);
    if (y !== lastY) {
      track.classList.toggle('is-left', y < lastY);
      track.classList.add('is-running');
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => track.classList.remove('is-running'), 220);
    }
    lastY = y;
  };

  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* =========================================================
   9. Idle dog: peeks up from the bottom corner
   ========================================================= */
const IDLE_DOG_SVG = `<svg viewBox="0 0 120 104" aria-hidden="true">
  <g class="idle-head">
    <ellipse cx="30" cy="44" rx="11" ry="22" fill="var(--dog-ear)" transform="rotate(20 30 44)"/>
    <ellipse cx="90" cy="44" rx="11" ry="22" fill="var(--dog-ear)" transform="rotate(-20 90 44)"/>
    <ellipse cx="60" cy="52" rx="32" ry="30" fill="var(--dog-fur)"/>
    <ellipse cx="60" cy="68" rx="17" ry="12" fill="var(--dog-muzzle)"/>
    <g class="idle-eyes">
      <circle cx="48" cy="48" r="4.4" fill="var(--pet-ink)"/>
      <circle cx="72" cy="48" r="4.4" fill="var(--pet-ink)"/>
      <circle cx="49.4" cy="46.6" r="1.3" fill="#FFFFFF"/>
      <circle cx="73.4" cy="46.6" r="1.3" fill="#FFFFFF"/>
    </g>
    <ellipse cx="60" cy="63" rx="6" ry="4.4" fill="var(--pet-ink)"/>
    <path class="idle-tongue" d="M55.5 72q4.5 11 9 0Z" fill="var(--dog-tongue)"/>
    <path d="M60 67v4.5M53.5 72q6.5 4 13 0" stroke="var(--pet-ink)" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>
  <ellipse cx="36" cy="96" rx="15" ry="9" fill="var(--dog-fur)"/>
  <ellipse cx="84" cy="96" rx="15" ry="9" fill="var(--dog-fur)"/>
  <path d="M30 92v6M36 91v7M42 92v6M78 92v6M84 91v7M90 92v6" stroke="var(--dog-ear)" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const IDLE_LINES = ['Still there?', 'Psst… need a checkup?', 'Did someone say walk?'];

function initIdleDog() {
  if (PREFERS_REDUCED_MOTION) return;

  const dog = document.createElement('button');
  dog.type = 'button';
  dog.className = 'idle-dog';
  dog.setAttribute('aria-label', 'Say hi to the dog');
  dog.tabIndex = -1;
  dog.innerHTML = IDLE_DOG_SVG;

  const bubble = document.createElement('span');
  bubble.className = 'cat-bubble idle-bubble';
  bubble.setAttribute('role', 'status');
  bubble.setAttribute('aria-live', 'polite');

  document.body.append(dog, bubble);

  const IDLE_MS = 20000;
  const MAX_VISITS = 3;
  let visits = 0;
  let idleTimer;
  let up = false;

  function show() {
    if (document.hidden || visits >= MAX_VISITS) return;
    visits++;
    up = true;
    dog.classList.add('is-up');
    dog.tabIndex = 0;
    setTimeout(() => { if (up) sayIn(bubble, IDLE_LINES[(visits - 1) % IDLE_LINES.length], 2600); }, 900);
  }

  function hide() {
    up = false;
    dog.classList.remove('is-up', 'is-wagging');
    dog.tabIndex = -1;
    bubble.classList.remove('is-visible');
  }

  function reset() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(show, IDLE_MS);
  }

  function activity(e) {
    if (up) {
      /* Moving toward the dog shouldn't scare it away */
      if (e && e.type === 'pointermove') {
        const r = dog.getBoundingClientRect();
        if (Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < 220) return;
      }
      if (e && e.target && e.target.closest && e.target.closest('.idle-dog')) return;
      hide();
    }
    reset();
  }

  ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(type => {
    window.addEventListener(type, activity, { passive: true });
  });

  dog.addEventListener('click', () => {
    sayIn(bubble, 'Woof!', 1400);
    dog.classList.remove('is-wagging');
    void dog.offsetWidth;
    dog.classList.add('is-wagging');
    setTimeout(hide, 1600);
    reset();
  });

  reset();
}

/* =========================================================
   10. Shy cat on the sign-in page
   ========================================================= */
const SHY_CAT_SVG = `<svg viewBox="0 0 160 140" aria-hidden="true">
  <path d="M30 70 40 14 76 48Z" fill="var(--cat-fur)"/>
  <path d="M130 70 120 14 84 48Z" fill="var(--cat-fur)"/>
  <path d="M39 59 44 28 66 48Z" fill="var(--cat-ear)"/>
  <path d="M121 59 116 28 94 48Z" fill="var(--cat-ear)"/>
  <ellipse cx="80" cy="80" rx="56" ry="44" fill="var(--cat-fur)"/>
  <path d="M80 37v13M67 40l4 11M93 40l-4 11" stroke="var(--cat-stripe)" stroke-width="4" stroke-linecap="round"/>
  <g class="shy-eye">
    <ellipse cx="60" cy="76" rx="11" ry="12" fill="var(--cat-iris)"/>
    <g class="shy-pupil"><ellipse cx="60" cy="76" rx="4" ry="8.5" fill="var(--pet-ink)"/><circle cx="62.5" cy="71.5" r="2" fill="#FFFFFF"/></g>
  </g>
  <g class="shy-eye">
    <ellipse cx="100" cy="76" rx="11" ry="12" fill="var(--cat-iris)"/>
    <g class="shy-pupil"><ellipse cx="100" cy="76" rx="4" ry="8.5" fill="var(--pet-ink)"/><circle cx="102.5" cy="71.5" r="2" fill="#FFFFFF"/></g>
  </g>
  <path d="M75 92h10l-5 5.5Z" fill="var(--cat-ear)"/>
  <path d="M80 97.5c-2 5-7 5.5-10 2.5M80 97.5c2 5 7 5.5 10 2.5" stroke="var(--pet-ink)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M44 92 16 86M44 98 16 101M116 92l28-6M116 98l28 3" stroke="var(--pet-ink)" stroke-width="1.6" opacity=".45" stroke-linecap="round"/>
  <g class="shy-paw shy-paw-l">
    <ellipse cx="52" cy="128" rx="20" ry="13" fill="var(--cat-fur)"/>
    <path d="M44 122v8M52 120v10M60 122v8" stroke="var(--cat-stripe)" stroke-width="2.4" stroke-linecap="round"/>
  </g>
  <g class="shy-paw shy-paw-r">
    <ellipse cx="108" cy="128" rx="20" ry="13" fill="var(--cat-fur)"/>
    <path d="M100 122v8M108 120v10M116 122v8" stroke="var(--cat-stripe)" stroke-width="2.4" stroke-linecap="round"/>
  </g>
</svg>`;

function initShyCat() {
  const holder = document.getElementById('shy-cat');
  if (!holder) return;
  holder.innerHTML = SHY_CAT_SVG;

  const email = document.getElementById('login_email');
  const password = document.getElementById('login_password');
  const showPw = document.getElementById('show_password');
  const pupils = holder.querySelectorAll('.shy-pupil');

  function lookAt(x, y) {
    pupils.forEach(p => { p.style.transform = `translate(${x}px, ${y}px)`; });
  }

  function setMode(mode) {
    holder.classList.remove('is-covering', 'is-peeking', 'is-watching');
    if (mode) holder.classList.add(mode);
  }

  function followText(input) {
    const len = input.value.length;
    const x = Math.max(-4, Math.min(4, -4 + len * 0.3));
    lookAt(x, 3);
  }

  function passwordMode() {
    setMode(showPw && showPw.checked ? 'is-peeking' : 'is-covering');
  }

  if (email) {
    email.addEventListener('focus', () => { setMode('is-watching'); followText(email); });
    email.addEventListener('input', () => followText(email));
    email.addEventListener('blur', () => { setMode(''); lookAt(0, 0); });
  }
  if (password) {
    password.addEventListener('focus', passwordMode);
    password.addEventListener('blur', () => setMode(''));
  }
  if (showPw) {
    showPw.addEventListener('change', () => {
      password.type = showPw.checked ? 'text' : 'password';
      /* Ticking the box moves focus off the password; send it back so the cat reacts */
      if (password.value) {
        password.focus();
        passwordMode();
      }
    });
  }

  /* Blink now and then when not covering */
  if (!PREFERS_REDUCED_MOTION) {
    const blink = () => {
      if (!holder.classList.contains('is-covering')) {
        holder.classList.add('blink');
        setTimeout(() => holder.classList.remove('blink'), 170);
      }
      setTimeout(blink, 2800 + Math.random() * 3000);
    };
    setTimeout(blink, 1800);
  }
}

/* =========================================================
   11. Pet photos react: hearts on click (tilt is CSS)
   ========================================================= */
function initPetPhotos() {
  document.addEventListener('click', e => {
    const photo = e.target.closest('.patient-photo');
    if (!photo) return;
    photo.classList.remove('is-loved');
    void photo.offsetWidth;
    photo.classList.add('is-loved');
    if (PREFERS_REDUCED_MOTION) return;
    for (let i = 0; i < 4; i++) {
      const heart = document.createElement('span');
      heart.className = 'love-heart';
      heart.innerHTML = HEART_SVG;
      heart.style.left = `${e.clientX + (Math.random() - 0.5) * 40}px`;
      heart.style.top = `${e.clientY}px`;
      heart.style.setProperty('--drift', `${Math.round((Math.random() - 0.5) * 60)}px`);
      heart.style.animationDelay = `${i * 90}ms`;
      heart.style.width = heart.style.height = `${18 + Math.random() * 12}px`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1500 + i * 90);
    }
  });
}

/* =========================================================
   12. Paw-print page transitions
   ========================================================= */
const WIPE_KEY = 'pethome-wipe';
let wipeEl = null;

function navigateWithWipe(url) {
  if (PREFERS_REDUCED_MOTION || !wipeEl) {
    window.location.href = url;
    return;
  }
  try { sessionStorage.setItem(WIPE_KEY, '1'); } catch (err) { /* storage blocked: skip the reveal */ }
  wipeEl.classList.add('is-covering');
  setTimeout(() => { window.location.href = url; }, 430);
}

function initPageTransitions() {
  const root = document.documentElement;
  if (PREFERS_REDUCED_MOTION) {
    root.classList.remove('wipe-in');
    return;
  }

  wipeEl = document.createElement('div');
  wipeEl.className = 'page-wipe';
  wipeEl.setAttribute('aria-hidden', 'true');
  wipeEl.innerHTML = `<div class="wipe-fill">${pawSvg('wipe-logo')}</div><div class="wipe-edge"></div>`;
  document.body.appendChild(wipeEl);

  /* Arriving from another page: start covered, then slide away */
  if (root.classList.contains('wipe-in')) {
    wipeEl.classList.add('no-anim', 'is-covering');
    root.classList.remove('wipe-in');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      wipeEl.classList.remove('no-anim', 'is-covering');
      wipeEl.classList.add('is-leaving');
      setTimeout(() => {
        wipeEl.classList.add('no-anim');
        wipeEl.classList.remove('is-leaving');
        requestAnimationFrame(() => wipeEl.classList.remove('no-anim'));
      }, 560);
    }));
  }

  /* Leaving: cover the page, then follow the link */
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link || e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || /^[a-z]+:/i.test(href)) return;
    const url = new URL(href, window.location.href);
    if (url.pathname === window.location.pathname) return;
    e.preventDefault();
    navigateWithWipe(url.href);
  });

  /* Back/forward cache: make sure the page isn't left covered */
  window.addEventListener('pageshow', e => {
    if (e.persisted && wipeEl) wipeEl.classList.remove('is-covering', 'is-leaving');
  });
}

/* ---------- Called from main.js on every page ---------- */
function initEffects() {
  initPageTransitions();
  initPawWalk();
  initPeekCat();
  initClickPaws();
  initScrollDog();
  initIdleDog();
  initShyCat();
  initPetPhotos();
}

/* =========================================================
   PetHome Veterinary Clinic — main script
   One file for every page. Each page sets <body data-page="...">
   and only the matching init function runs, so nothing breaks on
   pages that don't have a given form or widget.
   ========================================================= */

/* When the PHP step is done, set this to true: valid forms will then
   submit to their PHP "action" instead of showing the demo message. */
const USE_PHP_BACKEND = false;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- Date & format helpers ---------- */
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function daysFromToday(n) {
  const d = startOfToday();
  d.setDate(d.getDate() + n);
  return d;
}
function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fmtDate(d, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return d.toLocaleDateString('en-US', opts);
}
function fmtTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = ((h + 11) % 12) + 1;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function fromMinutes(total) {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
function money(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function findService(id) { return SERVICES.find(s => s.id === id); }
function findVet(id) { return VETS.find(v => v.id === id); }
function findPet(id) { return DEMO_PETS.find(p => p.id === id); }

/* ---------- Toast ---------- */
let toastTimer;
function toast(message) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.innerHTML = `${icon('check')}<span>${escapeHtml(message)}</span>`;
  requestAnimationFrame(() => el.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3200);
}

/* ---------- Header ---------- */
function initHeader() {
  const header = $('.site-header');
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  const page = document.body.dataset.page;

  $$('[data-nav]').forEach(link => {
    if (link.dataset.nav === page) link.setAttribute('aria-current', 'page');
  });

  if (toggle && nav) {
    toggle.innerHTML = icon('menu') + '<span class="sr-only">Open menu</span>';
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = icon(open ? 'close' : 'menu') + `<span class="sr-only">${open ? 'Close' : 'Open'} menu</span>`;
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle.click();
    });
    $$('a', nav).forEach(a => a.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) toggle.click();
    }));
  }

  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Icons placed in static HTML: <span data-icon="phone"></span> ---------- */
function initIcons() {
  $$('[data-icon]').forEach(el => {
    el.outerHTML = icon(el.dataset.icon, el.className || '');
  });
}

/* ---------- Footer ---------- */
function initFooter() {
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const form = $('#newsletter-form');
  if (!form) return;
  const msg = $('.newsletter-msg', form.parentElement);
  form.addEventListener('submit', e => {
    const input = $('input[type="email"]', form);
    const value = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (!valid) {
      e.preventDefault();
      input.setAttribute('aria-invalid', 'true');
      msg.classList.add('is-error');
      msg.textContent = 'Enter an email like name@example.com.';
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    if (USE_PHP_BACKEND) return;
    e.preventDefault();
    msg.classList.remove('is-error');
    msg.textContent = `Subscribed. Pet health tips will go to ${value}.`;
    form.reset();
  });
}

/* ---------- Clinic hours widgets ---------- */
function clinicStatus(now = new Date()) {
  const today = HOURS[now.getDay()];
  const mins = now.getHours() * 60 + now.getMinutes();
  if (mins >= toMinutes(today.open) && mins < toMinutes(today.close)) {
    return { open: true, text: `Open now · until ${fmtTime(today.close)}` };
  }
  if (mins < toMinutes(today.open)) {
    return { open: false, text: `Closed · opens today at ${fmtTime(today.open)}` };
  }
  const next = HOURS[(now.getDay() + 1) % 7];
  return { open: false, text: `Closed · opens ${next.label} at ${fmtTime(next.open)}` };
}

function initHours() {
  const todayIdx = new Date().getDay();
  $$('[data-hours-table]').forEach(table => {
    const order = [1, 2, 3, 4, 5, 6, 0];
    table.innerHTML = `<tbody>${order.map(i => {
      const h = HOURS[i];
      return `<tr class="${i === todayIdx ? 'today' : ''}"><th scope="row">${h.label}</th><td>${fmtTime(h.open)} – ${fmtTime(h.close)}</td></tr>`;
    }).join('')}</tbody>`;
  });
  const status = clinicStatus();
  $$('[data-open-now]').forEach(el => {
    el.innerHTML = `<span class="live-dot" style="${status.open ? '' : 'background:var(--danger);animation:none'}"></span>${status.text}`;
  });
  $$('[data-phone]').forEach(el => { el.textContent = CLINIC.phone; });
  $$('[data-emergency]').forEach(el => { el.textContent = CLINIC.emergency; });
  $$('[data-email]').forEach(el => { el.textContent = CLINIC.email; });
  $$('[data-address]').forEach(el => { el.textContent = CLINIC.address; });
}

/* ---------- Form validation (shared by every form) ---------- */
function fieldErrorEl(input) {
  const field = input.closest('.field') || input.parentElement;
  let err = $('.field-error', field);
  if (!err) {
    err = document.createElement('p');
    err.className = 'field-error';
    err.id = `${input.id || input.name}-error`;
    field.appendChild(err);
  }
  return err;
}

function checkInput(input) {
  const value = (input.value || '').trim();
  const label = input.dataset.label || 'This field';

  if (input.type === 'checkbox') {
    if (input.required && !input.checked) return input.dataset.message || 'Please check this box to continue.';
    return '';
  }
  if (input.type === 'radio') {
    const group = $$(`input[name="${input.name}"]`, input.form || document);
    if (input.required && !group.some(r => r.checked)) return input.dataset.message || `Choose a ${label.toLowerCase()}.`;
    return '';
  }
  if (input.required && !value) return `${label} is required.`;
  if (!value) return '';
  if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Enter an email like name@example.com.';
  if (input.type === 'tel' && value.replace(/\D/g, '').length < 10) return 'Enter a 10-digit phone number, e.g. (555) 123-4567.';
  if (input.minLength > 0 && value.length < input.minLength) return `${label} needs at least ${input.minLength} characters.`;
  if (input.type === 'number') {
    const n = Number(value);
    if (Number.isNaN(n)) return `${label} must be a number.`;
    if (input.min !== '' && n < Number(input.min)) return `${label} can't be less than ${input.min}.`;
    if (input.max !== '' && n > Number(input.max)) return `${label} can't be more than ${input.max}.`;
  }
  return '';
}

function showError(input, message) {
  const targets = input.type === 'radio'
    ? $$(`input[name="${input.name}"]`, input.form || document)
    : [input];
  const err = fieldErrorEl(input);
  err.textContent = message;
  targets.forEach(t => {
    if (message) {
      t.setAttribute('aria-invalid', 'true');
      t.setAttribute('aria-describedby', err.id);
    } else {
      t.removeAttribute('aria-invalid');
    }
  });
}

function validate(container) {
  const inputs = $$('input, select, textarea', container).filter(el => el.type !== 'hidden' && !el.disabled);
  const seenRadio = new Set();
  let firstBad = null;
  inputs.forEach(input => {
    if (input.type === 'radio') {
      if (seenRadio.has(input.name)) return;
      seenRadio.add(input.name);
    }
    const message = checkInput(input);
    showError(input, message);
    if (message && !firstBad) firstBad = input;
  });
  if (firstBad) firstBad.focus();
  return !firstBad;
}

function liveValidation(form) {
  form.addEventListener('input', e => {
    if (e.target.getAttribute('aria-invalid') === 'true') showError(e.target, checkInput(e.target));
  });
  form.addEventListener('change', e => {
    if (e.target.getAttribute('aria-invalid') === 'true') showError(e.target, checkInput(e.target));
  });
}

function successMarkup(title, body, extra = '') {
  return `<div class="form-success" role="status">
    <div class="success-icon"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></div>
    <h2>${title}</h2>
    <p class="lead">${body}</p>
    ${extra}
  </div>`;
}

/* Friendly empty state with a drawing from effects.js */
function emptyState(art, title, text, tag = 'div') {
  const drawing = typeof PET_ART !== 'undefined' ? PET_ART[art] : '';
  return `<${tag} class="empty-state">${drawing}<strong>${title}</strong><p>${text}</p></${tag}>`;
}

/* ---------- Count-up numbers ---------- */
function initCounters() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduce) return;
    const start = performance.now();
    const duration = 1400;
    const tick = now => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- Service cards ---------- */
function serviceCard(s) {
  const emergency = s.category === 'Emergency' ? ' service-card--emergency' : '';
  return `<a class="service-card fade-in${emergency}" href="book.html#${s.id}">
    <span class="service-icon">${icon(s.icon)}</span>
    <span class="tag">${s.category}</span>
    <div><h3>${s.name}</h3><p>${s.description}</p></div>
    <div class="service-meta">
      <span><span class="price">${s.priceLabel}</span> · ${s.duration}</span>
      <span class="book-link">Book ${icon('arrow', 'icon--arrow')}</span>
    </div>
  </a>`;
}

/* ---------- Appointment slots (shared by home + booking) ---------- */
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* Returns every 30-minute slot for a date, marking ones that are taken.
   Until MySQL is connected, "taken" is a fixed pseudo-random pattern. */
function slotsFor(date, vetId = 'any') {
  const hours = HOURS[date.getDay()];
  const vetsWorking = VETS.filter(v => v.days.includes(date.getDay()));
  if (vetId !== 'any' && !vetsWorking.some(v => v.id === vetId)) return { offDay: true, slots: [] };
  if (!vetsWorking.length) return { offDay: true, slots: [] };

  const isToday = isoDate(date) === isoDate(new Date());
  const now = new Date();
  const cutoff = now.getHours() * 60 + now.getMinutes() + 60;
  const slots = [];
  for (let m = toMinutes(hours.open); m <= toMinutes(hours.close) - 30; m += 30) {
    const time = fromMinutes(m);
    const key = `${isoDate(date)}|${vetId}|${time}`;
    const taken = hashCode(key) % 10 < (vetId === 'any' ? 2 : 4);
    const past = isToday && m < cutoff;
    slots.push({ time, available: !taken && !past });
  }
  return { offDay: false, slots };
}

function nextAvailable() {
  for (let i = 0; i < 14; i++) {
    const d = daysFromToday(i);
    const { slots } = slotsFor(d);
    const open = slots.find(s => s.available);
    if (open) {
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : fmtDate(d, { weekday: 'long' });
      return `${label} at ${fmtTime(open.time)}`;
    }
  }
  return 'Call us for the next opening';
}

/* =========================================================
   PAGE: Home
   ========================================================= */
function initHome() {
  initCounters();
  const grid = $('#home-services');
  if (grid) grid.innerHTML = SERVICES.slice(0, 6).map(serviceCard).join('');
  $$('[data-next-slot]').forEach(el => { el.textContent = nextAvailable(); });
}

/* =========================================================
   PAGE: Services
   ========================================================= */
function initServices() {
  const grid = $('#service-grid');
  const chipsWrap = $('#service-filters');
  if (!grid || !chipsWrap) return;

  const categories = ['All', ...new Set(SERVICES.map(s => s.category))];
  chipsWrap.innerHTML = categories.map(c => {
    const count = c === 'All' ? SERVICES.length : SERVICES.filter(s => s.category === c).length;
    return `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === 'All'}">${c}<span class="count">${count}</span></button>`;
  }).join('');

  const render = cat => {
    const list = cat === 'All' ? SERVICES : SERVICES.filter(s => s.category === cat);
    grid.innerHTML = list.map(serviceCard).join('');
  };
  render('All');

  chipsWrap.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $$('.chip', chipsWrap).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    render(chip.dataset.cat);
  });
}

/* =========================================================
   PAGE: Our Vets
   ========================================================= */
function initTeam() {
  const grid = $('#vet-grid');
  const staffGrid = $('#staff-grid');
  const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (grid) {
    grid.innerHTML = VETS.map(v => `
      <article class="vet-card">
        <div class="vet-avatar ${v.color}" aria-hidden="true">${v.initials}</div>
        <div><h3>${v.name}, ${v.credentials}</h3><p class="role">${v.role}</p></div>
        <p>${v.bio}</p>
        <div>
          <p class="vet-langs"><strong>Speaks:</strong> ${v.languages}</p>
        </div>
        <div class="days" aria-label="Works ${v.days.map(d => dayNames[d]).join(', ')}">
          ${[1, 2, 3, 4, 5, 6, 0].map(d => `<span class="${v.days.includes(d) ? 'on' : ''}" title="${dayNames[d]}">${dayLetters[d]}</span>`).join('')}
        </div>
        <a class="btn btn--ghost btn--sm" href="book.html#vet-${v.id}">Book with ${v.name} ${icon('arrow', 'icon--arrow')}</a>
      </article>`).join('');
  }
  if (staffGrid) {
    staffGrid.innerHTML = STAFF.map(s => `
      <article class="vet-card">
        <div class="vet-avatar ${s.color}" aria-hidden="true">${s.initials}</div>
        <div><h3>${s.name}</h3><p class="role">${s.role}</p></div>
      </article>`).join('');
  }
}

/* =========================================================
   PAGE: Book an appointment (4-step wizard)
   ========================================================= */
function initBooking() {
  const form = $('#booking-form');
  if (!form) return;

  const state = { step: 1, date: null, time: null };
  const steps = $$('.wizard-step', form);
  const progress = $$('.progress li');
  const serviceGrid = $('#service-options');
  const vetGrid = $('#vet-options');
  const dateStrip = $('#date-strip');
  const slotWrap = $('#slot-wrap');

  /* Step 2 options */
  serviceGrid.innerHTML = SERVICES.map((s, i) => `
    <label class="option-card">
      <input type="radio" name="service" value="${s.id}" ${i === 0 ? 'required data-label="Service" data-message="Choose a service to continue."' : ''}>
      <span class="opt"><span class="opt-icon">${icon(s.icon)}</span><strong>${s.name}</strong><small>${s.priceLabel} · ${s.duration}</small></span>
    </label>`).join('');

  vetGrid.innerHTML = `
    <label class="option-card">
      <input type="radio" name="vet" value="any" checked>
      <span class="opt"><span class="opt-icon">${icon('users')}</span><strong>Any available vet</strong><small>Most openings</small></span>
    </label>` + VETS.map(v => `
    <label class="option-card">
      <input type="radio" name="vet" value="${v.id}">
      <span class="opt"><span class="mini-avatar ${v.color}" aria-hidden="true">${v.initials}</span><strong>${v.name}</strong><small>${v.role.split(' · ')[0]}</small></span>
    </label>`).join('');

  /* Preselect from link: book.html#dental or book.html#vet-two */
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash.startsWith('vet-')) {
    const r = $(`input[name="vet"][value="${hash.slice(4)}"]`, form);
    if (r) r.checked = true;
  } else if (hash) {
    const r = $(`input[name="service"][value="${hash}"]`, form);
    if (r) r.checked = true;
  }

  /* Step 3: date strip */
  const days = Array.from({ length: 14 }, (_, i) => daysFromToday(i));
  dateStrip.innerHTML = days.map((d, i) => `
    <button type="button" class="date-btn" data-date="${isoDate(d)}" aria-pressed="false" aria-label="${fmtDate(d, { weekday: 'long', month: 'long', day: 'numeric' })}">
      <small>${i === 0 ? 'Today' : fmtDate(d, { weekday: 'short' })}</small>
      <strong>${d.getDate()}</strong>
      <small>${fmtDate(d, { month: 'short' })}</small>
    </button>`).join('');

  const currentVet = () => ($('input[name="vet"]:checked', form) || {}).value || 'any';

  function renderSlots() {
    $('#appointment_time').value = '';
    if (!state.date) {
      slotWrap.innerHTML = '<p class="slots-empty">Pick a day above to see open times.</p>';
      return;
    }
    const date = new Date(`${state.date}T00:00:00`);
    const vetId = currentVet();
    const { offDay, slots } = slotsFor(date, vetId);
    if (offDay) {
      const vet = findVet(vetId);
      const who = vet ? `${vet.name} isn't in on ${fmtDate(date, { weekday: 'long' })}s.` : 'No vets are scheduled that day.';
      slotWrap.innerHTML = emptyState('puzzledDog', 'No vet that day', `${who} Pick another day, or go back and choose "Any available vet".`);
      state.time = null;
      updateSummary();
      return;
    }
    const groups = [
      { label: 'Morning', test: t => toMinutes(t) < 12 * 60 },
      { label: 'Afternoon', test: t => toMinutes(t) >= 12 * 60 && toMinutes(t) < 17 * 60 },
      { label: 'Evening', test: t => toMinutes(t) >= 17 * 60 }
    ];
    const html = groups.map(g => {
      const list = slots.filter(s => g.test(s.time));
      if (!list.length) return '';
      return `<div class="slot-group"><h3>${g.label}</h3><div class="slots">${list.map(s =>
        `<button type="button" class="slot-btn" data-time="${s.time}" aria-pressed="${state.time === s.time}" ${s.available ? '' : 'disabled aria-label="' + fmtTime(s.time) + ' unavailable"'}>${fmtTime(s.time)}</button>`
      ).join('')}</div></div>`;
    }).join('');
    const anyOpen = slots.some(s => s.available);
    slotWrap.innerHTML = anyOpen ? html : emptyState('puzzledDog', 'Fully booked', 'Every slot that day is taken. Try the next day.');
    if (!slots.some(s => s.available && s.time === state.time)) state.time = null;
    if (state.time) $('#appointment_time').value = state.time;
    updateSummary();
  }

  dateStrip.addEventListener('click', e => {
    const btn = e.target.closest('.date-btn');
    if (!btn) return;
    state.date = btn.dataset.date;
    state.time = null;
    $('#appointment_date').value = state.date;
    $$('.date-btn', dateStrip).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    $('#slot-error').textContent = '';
    renderSlots();
  });

  slotWrap.addEventListener('click', e => {
    const btn = e.target.closest('.slot-btn');
    if (!btn || btn.disabled) return;
    state.time = btn.dataset.time;
    $('#appointment_time').value = state.time;
    $$('.slot-btn', slotWrap).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    $('#slot-error').textContent = '';
    updateSummary();
  });

  vetGrid.addEventListener('change', () => { if (state.date) renderSlots(); });

  /* Summary sidebar */
  function setRow(id, value) {
    const dd = $(`#sum-${id}`);
    if (!dd) return;
    dd.textContent = value || 'Not chosen yet';
    dd.classList.toggle('empty', !value);
  }
  function updateSummary() {
    const petName = $('#pet_name').value.trim();
    const species = $('#pet_species').value;
    const owner = `${$('#owner_first').value.trim()} ${$('#owner_last').value.trim()}`.trim();
    const service = findService(($('input[name="service"]:checked', form) || {}).value);
    const vetId = currentVet();
    const vet = findVet(vetId);
    setRow('pet', petName ? `${petName}${species ? ' (' + species + ')' : ''}` : '');
    setRow('owner', owner);
    setRow('service', service ? service.name : '');
    setRow('vet', vet ? vet.name : 'Any available vet');
    let when = '';
    if (state.date) {
      const d = new Date(`${state.date}T00:00:00`);
      when = fmtDate(d, { weekday: 'short', month: 'short', day: 'numeric' }) + (state.time ? ` · ${fmtTime(state.time)}` : '');
    }
    setRow('when', when);
    $('#sum-total').textContent = service ? service.priceLabel : '—';
  }
  form.addEventListener('input', updateSummary);
  form.addEventListener('change', updateSummary);

  /* Step navigation */
  function goTo(step) {
    state.step = step;
    steps.forEach(s => { s.hidden = Number(s.dataset.step) !== step; });
    progress.forEach((li, i) => {
      li.classList.toggle('is-done', i + 1 < step);
      li.classList.toggle('is-current', i + 1 === step);
      if (i + 1 === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    if (step === 4) fillReview();
    const top = $('.booking-main').getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    const heading = $(`.wizard-step[data-step="${step}"] h2`, form);
    if (heading) heading.focus({ preventScroll: true });
  }

  function stepIsValid(step) {
    const section = $(`.wizard-step[data-step="${step}"]`, form);
    if (step === 3) {
      const err = $('#slot-error');
      if (!state.date) { err.textContent = 'Pick a day for the visit.'; return false; }
      if (!state.time) { err.textContent = 'Pick a time from the open slots.'; return false; }
      err.textContent = '';
      return true;
    }
    return validate(section);
  }

  form.addEventListener('click', e => {
    const next = e.target.closest('[data-next]');
    const back = e.target.closest('[data-back]');
    const edit = e.target.closest('[data-edit]');
    if (next && stepIsValid(state.step)) goTo(state.step + 1);
    if (back) goTo(state.step - 1);
    if (edit) goTo(Number(edit.dataset.edit));
  });

  function fillReview() {
    const service = findService($('input[name="service"]:checked', form).value);
    const vet = findVet(currentVet());
    const d = new Date(`${state.date}T00:00:00`);
    const firstVisit = ($('input[name="first_visit"]:checked', form) || {}).value === 'yes';
    $('#review').innerHTML = `
      <dl class="summary-list">
        <div><dt>Owner</dt><dd>${escapeHtml($('#owner_first').value)} ${escapeHtml($('#owner_last').value)}<br><span style="font-weight:500">${escapeHtml($('#owner_email').value)} · ${escapeHtml($('#owner_phone').value)}</span></dd></div>
        <div><dt>Pet</dt><dd>${escapeHtml($('#pet_name').value)} · ${escapeHtml($('#pet_species').value)}${$('#pet_age').value ? ', ' + escapeHtml($('#pet_age').value) + ' yrs' : ''}${firstVisit ? ' · first visit' : ''}</dd></div>
        <div><dt>Service</dt><dd>${service.name} (${service.priceLabel})</dd></div>
        <div><dt>Vet</dt><dd>${vet ? vet.name : 'Any available vet'}</dd></div>
        <div><dt>When</dt><dd>${fmtDate(d, { weekday: 'long', month: 'long', day: 'numeric' })} at ${fmtTime(state.time)}</dd></div>
      </dl>`;
  }

  /* Submit */
  liveValidation(form);
  form.addEventListener('submit', e => {
    if (!stepIsValid(4)) { e.preventDefault(); return; }
    if (USE_PHP_BACKEND) return;
    e.preventDefault();
    const ref = 'PH-' + String(Math.floor(100000 + Math.random() * 900000));
    const petName = escapeHtml($('#pet_name').value.trim());
    const d = new Date(`${state.date}T00:00:00`);
    $('#booking-card').innerHTML = successMarkup(
      `${petName} is booked in`,
      `${fmtDate(d, { weekday: 'long', month: 'long', day: 'numeric' })} at ${fmtTime(state.time)}. A confirmation will go to ${escapeHtml($('#owner_email').value.trim())}.`,
      `<p>Your reference</p><span class="ref-code">${ref}</span>
       <div class="hero-actions" style="justify-content:center;margin-top:8px">
         <a class="btn" href="portal.html#appointments">View my appointments</a>
         <a class="btn btn--ghost" href="book.html">Book another visit</a>
       </div>`
    );
    $('.progress').hidden = true;
    toast('Appointment booked');
    if (typeof burstFrom === 'function') setTimeout(() => burstFrom($('.success-icon')), 250);
  });

  slotWrap.innerHTML = '<p class="slots-empty">Pick a day above to see open times.</p>';
  goTo(1);
  updateSummary();
}

/* =========================================================
   PAGE: Client portal (demo data)
   ========================================================= */
function vaccineStatus(dueDays) {
  if (dueDays < 0) return { cls: 'pill--danger', text: 'Overdue' };
  if (dueDays <= 30) return { cls: 'pill--warn', text: 'Due soon' };
  return { cls: 'pill--ok', text: 'Up to date' };
}

function sparkline(points) {
  const w = 280, h = 64, pad = 6;
  const lbs = points.map(p => p.lb);
  const min = Math.min(...lbs) - 0.2;
  const max = Math.max(...lbs) + 0.2;
  const x = i => pad + (i * (w - pad * 2)) / (points.length - 1);
  const y = lb => pad + (1 - (lb - min) / (max - min)) * (h - pad * 2);
  const line = points.map((p, i) => `${x(i).toFixed(1)},${y(p.lb).toFixed(1)}`).join(' ');
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;
  const last = points[points.length - 1];
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Weight from ${points[0].lb} lb to ${last.lb} lb">
    <polygon class="area" points="${area}"/>
    <polyline class="line" points="${line}"/>
    <circle class="dot" cx="${x(points.length - 1)}" cy="${y(last.lb)}" r="5"/>
  </svg>
  <div class="spark-labels"><span>${fmtDate(daysFromToday(points[0].d), { month: 'short', year: 'numeric' })} · ${points[0].lb} lb</span><span>${fmtDate(daysFromToday(last.d), { month: 'short', year: 'numeric' })} · ${last.lb} lb</span></div>`;
}

function initPortal() {
  const tabs = $$('.portal-tab');
  const panels = $$('.portal-panel');
  if (!tabs.length) return;

  const appts = DEMO_APPOINTMENTS.map(a => ({ ...a }));
  const invoices = DEMO_INVOICES.map(i => ({ ...i }));

  $('#portal-name').textContent = DEMO_OWNER.name;
  $('#portal-initials').textContent = DEMO_OWNER.initials;
  $('#portal-since').textContent = `Client since ${DEMO_OWNER.since}`;

  function apptItem(a) {
    const d = daysFromToday(a.day);
    const pet = findPet(a.pet);
    const service = findService(a.service);
    const vet = findVet(a.vet);
    const past = a.day < 0;
    const pillCls = a.status === 'Cancelled' ? 'pill--neutral' : past ? 'pill--neutral' : 'pill--ok';
    const action = !past && a.status !== 'Cancelled'
      ? `<button type="button" class="btn btn--ghost btn--sm" data-cancel="${a.id}">Cancel</button>`
      : `<span class="pill ${pillCls}">${a.status}</span>`;
    return `<li class="appt ${past || a.status === 'Cancelled' ? 'appt--past' : ''}">
      <div class="appt-date"><small>${fmtDate(d, { month: 'short' })}</small><strong>${d.getDate()}</strong></div>
      <div class="appt-info"><strong>${pet.name} · ${service.name}</strong><span>${fmtDate(d, { weekday: 'short' })} ${fmtTime(a.time)} with ${vet.name} · ${a.note}</span></div>
      ${action}
    </li>`;
  }

  function renderOverview() {
    const upcoming = appts.filter(a => a.day >= 0 && a.status !== 'Cancelled').sort((a, b) => a.day - b.day);
    const dueVax = DEMO_VACCINES.filter(v => v.due <= 30);
    const balance = invoices.filter(i => !i.paid).reduce((sum, i) => sum + i.amount, 0);
    $('#ov-upcoming').textContent = upcoming.length;
    $('#ov-vax').textContent = dueVax.length;
    $('#ov-balance').textContent = money(balance);
    $('#ov-next').innerHTML = upcoming.length
      ? upcoming.slice(0, 2).map(apptItem).join('')
      : emptyState('sleepingCat', 'Nothing coming up', 'No visits on the calendar. <a href="book.html">Book a checkup</a> when it\'s time.', 'li');
    $('#ov-alerts').innerHTML = dueVax.sort((a, b) => a.due - b.due).map(v => {
      const st = vaccineStatus(v.due);
      const pet = findPet(v.pet);
      const when = v.due < 0 ? `${Math.abs(v.due)} days overdue` : `due in ${v.due} days`;
      return `<li class="appt"><div class="pet-chip"><img src="${pet.photo}" alt=""></div>
        <div class="appt-info"><strong>${pet.name} · ${v.name}</strong><span>${when} (${fmtDate(daysFromToday(v.due))})</span></div>
        <span class="pill ${st.cls}">${st.text}</span></li>`;
    }).join('');
    const badge = $('#badge-billing');
    const unpaid = invoices.filter(i => !i.paid).length;
    badge.textContent = unpaid;
    badge.hidden = unpaid === 0;
    $('#badge-vax').textContent = dueVax.length;
    $('#badge-vax').hidden = dueVax.length === 0;
  }

  function renderPets() {
    $('#pet-list').innerHTML = DEMO_PETS.map(p => {
      const vet = findVet(p.vet);
      const vax = DEMO_VACCINES.filter(v => v.pet === p.id);
      const worst = vax.reduce((acc, v) => Math.min(acc, v.due), Infinity);
      const st = vaccineStatus(worst);
      return `<article class="pet-profile">
        <div class="patient-photo"><img src="${p.photo}" alt="${p.name}, ${p.breed}"></div>
        <div class="patient-body">
          <header><h3>${p.name}</h3><span class="pill ${st.cls}">Vaccines: ${st.text.toLowerCase()}</span></header>
          <dl class="chart-rows">
            <div><dt>Species / breed</dt><dd>${p.species} · ${p.breed}</dd></div>
            <div><dt>Sex · age</dt><dd>${p.sex} · ${p.ageYears} yrs</dd></div>
            <div><dt>Current weight</dt><dd>${p.weightLb} lb</dd></div>
            <div><dt>Microchip</dt><dd>${p.microchip}</dd></div>
            <div><dt>Primary vet</dt><dd>${vet.name}</dd></div>
          </dl>
          <div><p style="font-weight:700;font-size:.9rem;margin-bottom:4px">Weight history</p>${sparkline(p.weights)}</div>
          <p style="color:var(--muted);font-size:.92rem"><strong style="color:var(--ink)">Care notes:</strong> ${p.notes}</p>
        </div>
      </article>`;
    }).join('');
  }

  function renderAppointments() {
    const upcoming = appts.filter(a => a.day >= 0).sort((a, b) => a.day - b.day);
    const past = appts.filter(a => a.day < 0).sort((a, b) => b.day - a.day);
    const active = upcoming.filter(a => a.status !== 'Cancelled');
    $('#appt-upcoming').innerHTML = (active.length
      ? active.map(apptItem).join('')
      : emptyState('sleepingCat', 'All quiet', 'No upcoming visits. <a href="book.html">Book one</a> whenever you need us.', 'li'))
      + upcoming.filter(a => a.status === 'Cancelled').map(apptItem).join('');
    $('#appt-past').innerHTML = past.map(apptItem).join('');
  }

  function renderVaccines() {
    const rows = [...DEMO_VACCINES].sort((a, b) => a.due - b.due);
    $('#vax-body').innerHTML = rows.map(v => {
      const pet = findPet(v.pet);
      const st = vaccineStatus(v.due);
      return `<tr>
        <td><span class="pet-chip"><img src="${pet.photo}" alt="">${pet.name}</span></td>
        <td>${v.name}</td>
        <td class="num">${fmtDate(daysFromToday(v.given))}</td>
        <td class="num">${fmtDate(daysFromToday(v.due))}</td>
        <td><span class="pill ${st.cls}">${st.text}</span></td>
      </tr>`;
    }).join('');
  }

  function renderBilling() {
    $('#bill-body').innerHTML = invoices.map(inv => {
      const pet = findPet(inv.pet);
      const action = inv.paid
        ? '<span class="pill pill--ok">Paid</span>'
        : `<button type="button" class="btn btn--orange btn--sm" data-pay="${inv.id}">Pay ${money(inv.amount)}</button>`;
      return `<tr>
        <td><strong>${inv.id}</strong></td>
        <td class="num">${fmtDate(daysFromToday(inv.day))}</td>
        <td><span class="pet-chip"><img src="${pet.photo}" alt="">${pet.name}</span></td>
        <td>${inv.items}</td>
        <td class="num">${money(inv.amount)}</td>
        <td>${action}</td>
      </tr>`;
    }).join('');
  }

  function renderAll() {
    renderOverview();
    renderPets();
    renderAppointments();
    renderVaccines();
    renderBilling();
  }

  function selectTab(id, focus = false) {
    tabs.forEach(t => {
      const on = t.dataset.tab === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(p => { p.hidden = p.id !== `panel-${id}`; });
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t.dataset.tab));
    t.addEventListener('keydown', e => {
      const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!dir) return;
      e.preventDefault();
      selectTab(tabs[(i + dir + tabs.length) % tabs.length].dataset.tab, true);
    });
  });
  document.addEventListener('click', e => {
    const jump = e.target.closest('[data-goto-tab]');
    if (jump) { e.preventDefault(); selectTab(jump.dataset.gotoTab); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  });

  /* Cancel: first click asks, second click confirms */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-cancel]');
    if (!btn) return;
    if (btn.dataset.confirming !== 'true') {
      btn.dataset.confirming = 'true';
      btn.textContent = 'Confirm cancel';
      btn.classList.remove('btn--ghost');
      btn.style.setProperty('--btn-bg', 'var(--danger)');
      setTimeout(() => {
        if (btn.isConnected && btn.dataset.confirming === 'true') {
          btn.dataset.confirming = 'false';
          btn.textContent = 'Cancel';
          btn.classList.add('btn--ghost');
          btn.style.removeProperty('--btn-bg');
        }
      }, 4000);
      return;
    }
    const appt = appts.find(a => a.id === btn.dataset.cancel);
    appt.status = 'Cancelled';
    renderAll();
    toast(`${findPet(appt.pet).name}'s appointment was cancelled`);
  });

  /* Pay: first click asks, second click confirms */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-pay]');
    if (!btn) return;
    const inv = invoices.find(i => i.id === btn.dataset.pay);
    if (btn.dataset.confirming !== 'true') {
      btn.dataset.confirming = 'true';
      btn.textContent = `Confirm ${money(inv.amount)}`;
      return;
    }
    inv.paid = true;
    const rect = btn.getBoundingClientRect();
    renderAll();
    if (typeof burstPets === 'function') burstPets(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
    toast(`${inv.id} paid · ${money(inv.amount)}`);
  });

  renderAll();
  const tabFromHash = () => {
    const id = location.hash.slice(1);
    return tabs.some(t => t.dataset.tab === id) ? id : null;
  };
  selectTab(tabFromHash() || 'overview');
  window.addEventListener('hashchange', () => {
    const id = tabFromHash();
    if (id) { selectTab(id); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  });
}

/* =========================================================
   PAGE: Contact
   ========================================================= */
function initContact() {
  const form = $('#contact-form');
  if (!form) return;
  liveValidation(form);
  form.addEventListener('submit', e => {
    if (!validate(form)) { e.preventDefault(); return; }
    if (USE_PHP_BACKEND) return;
    e.preventDefault();
    const name = escapeHtml($('#contact_name').value.trim().split(' ')[0]);
    $('#contact-card').innerHTML = successMarkup(
      `Thanks, ${name}`,
      'Your message reached the front desk. We reply within one business day. For anything urgent, call us instead.',
      `<a class="btn btn--ghost" href="contact.html">Send another message</a>`
    );
  });
}

/* =========================================================
   PAGE: Sign in (front end only until the PHP step)
   ========================================================= */
function initLogin() {
  const form = $('#login-form');
  if (!form) return;
  liveValidation(form);
  form.addEventListener('submit', e => {
    if (!validate(form)) { e.preventDefault(); return; }
    if (USE_PHP_BACKEND) return;
    e.preventDefault();
    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    setTimeout(() => {
      if (typeof navigateWithWipe === 'function') navigateWithWipe('portal.html');
      else window.location.href = 'portal.html';
    }, 500);
  });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initHeader();
  initFooter();
  initHours();
  if (typeof initEffects === 'function') initEffects();
  const pages = {
    home: initHome,
    services: initServices,
    team: initTeam,
    book: initBooking,
    portal: initPortal,
    contact: initContact,
    login: initLogin
  };
  const run = pages[document.body.dataset.page];
  if (run) run();
});

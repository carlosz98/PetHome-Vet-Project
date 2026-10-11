/* =========================================================
   PetHome Veterinary Clinic — site data
   This file stands in for the MySQL database until the PHP step.
   Each array maps to a future table: services, vets, clinic_hours,
   and the demo owner/pets/appointments/vaccinations/invoices.
   ========================================================= */

const ICONS = {
  paw: '<circle cx="5.5" cy="10" r="2.2"/><circle cx="9.2" cy="5.2" r="2.2"/><circle cx="14.8" cy="5.2" r="2.2"/><circle cx="18.5" cy="10" r="2.2"/><path d="M12 11.5c-2.6 0-5.8 3.2-5.8 5.8 0 1.8 1.4 2.7 2.9 2.7 1.3 0 1.9-.7 2.9-.7s1.6.7 2.9.7c1.5 0 2.9-.9 2.9-2.7 0-2.6-3.2-5.8-5.8-5.8Z"/>',
  stethoscope: '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  syringe: '<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>',
  tooth: '<path d="M7 3C4.5 3 3 5 3 7.5c0 2 1 3.5 1.5 5.5.6 2.5.8 8 2.8 8 1.7 0 1.5-5 3.2-5h1c1.7 0 1.5 5 3.2 5 2 0 2.2-5.5 2.8-8 .5-2 1.5-3.5 1.5-5.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3Z"/>',
  scalpel: '<path d="M3 21 14.5 9.5"/><path d="M14.5 9.5 19 5a2.1 2.1 0 0 1 3 3l-4.5 4.5-3-3Z"/><path d="M9 21h4"/>',
  microscope: '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
  siren: '<path d="M12 2v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/><path d="M7 18v-6a5 5 0 0 1 10 0v6"/><path d="M5 18h14v3H5z"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/>',
  chip: '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 2v3"/><path d="M15 2v3"/><path d="M9 19v3"/><path d="M15 19v3"/><path d="M2 9h3"/><path d="M2 15h3"/><path d="M19 9h3"/><path d="M19 15h3"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/><path d="M3.2 12h6.3l.5-1 2 4.5 2-7 1.5 3.5h5.3"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  back: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
  receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  sparkle: '<path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="m5.6 5.6 2.8 2.8"/><path d="m15.6 15.6 2.8 2.8"/><path d="m5.6 18.4 2.8-2.8"/><path d="m15.6 8.4 2.8-2.8"/>',
  scale: '<path d="M12 3v18"/><path d="M5 7h14"/><path d="m5 7-3 7a4 4 0 0 0 6 0Z"/><path d="m19 7-3 7a4 4 0 0 0 6 0Z"/><path d="M8 21h8"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
};

function icon(name, extraClass = '') {
  const filled = name === 'paw' ? ' style="fill:currentColor;stroke:none"' : '';
  return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" aria-hidden="true"${filled}>${ICONS[name] || ''}</svg>`;
}

/* ---- services table ---- */
const SERVICES = [
  { id: 'wellness', name: 'Wellness Exam', category: 'Wellness', icon: 'stethoscope', price: 85, priceLabel: '$85', duration: '30 min',
    description: 'Nose-to-tail checkup: weight, heart and lungs, eyes, ears, teeth, skin and joints, plus a written care plan.' },
  { id: 'vaccines', name: 'Vaccinations', category: 'Wellness', icon: 'syringe', price: 35, priceLabel: 'from $35', duration: '20 min',
    description: 'Core and lifestyle vaccines on schedule: Rabies, DHPP and Bordetella for dogs, FVRCP and FeLV for cats.' },
  { id: 'dental', name: 'Dental Cleaning', category: 'Dental', icon: 'tooth', price: 650, priceLabel: 'from $650', duration: 'Drop-off, half day',
    description: 'Scaling and polishing under anesthesia with dental X-rays, so we catch problems below the gumline.' },
  { id: 'surgery', name: 'Spay & Neuter', category: 'Surgery', icon: 'scalpel', price: 450, priceLabel: 'from $450', duration: 'Day procedure',
    description: 'Routine surgery with pre-op bloodwork, pain management and a same-day discharge call.' },
  { id: 'diagnostics', name: 'Lab Work & X-Ray', category: 'Diagnostics', icon: 'microscope', price: 175, priceLabel: 'from $175', duration: '45 min',
    description: 'In-house bloodwork, urinalysis and digital radiographs, with most results back the same day.' },
  { id: 'urgent', name: 'Urgent Care', category: 'Emergency', icon: 'siren', price: 150, priceLabel: '$150 exam', duration: 'Same day',
    description: 'Vomiting, limping, cuts or a pet who just seems off. We hold same-day slots for sick visits.' },
  { id: 'microchip', name: 'Microchipping', category: 'Wellness', icon: 'chip', price: 60, priceLabel: '$60', duration: '15 min',
    description: 'A quick implant and registration so a lost pet can be scanned and returned home.' },
  { id: 'senior', name: 'Senior Pet Care', category: 'Wellness', icon: 'heart', price: 110, priceLabel: '$110', duration: '45 min',
    description: 'Longer exams for pets 7 and older, with screening for kidney, thyroid and joint changes.' },
  { id: 'grooming', name: 'Nail Trim & Grooming', category: 'Grooming', icon: 'scissors', price: 25, priceLabel: 'from $25', duration: '20 min',
    description: 'Nail trims, ear cleaning and medicated baths handled by staff who know nervous pets.' }
];

/* ---- vets table ---- */
const VETS = [
  { id: 'one', name: 'Dr. One', initials: 'D1', credentials: 'DVM', role: 'Medical Director · General Practice & Surgery',
    bio: 'Leads the clinic and does most of our soft-tissue surgery. Known for explaining every option before anything happens.',
    languages: 'English, Spanish', days: [1, 2, 3, 4], color: 'vet-avatar--ink' },
  { id: 'two', name: 'Dr. Two', initials: 'D2', credentials: 'DVM', role: 'Dentistry',
    bio: 'Handles dental cleanings, extractions and oral X-rays. Will show you the before and after photos.',
    languages: 'English, Mandarin', days: [2, 3, 4, 5, 6], color: 'vet-avatar--brand' },
  { id: 'three', name: 'Dr. Three', initials: 'D3', credentials: 'DVM', role: 'Feline Medicine',
    bio: 'Runs our cat-only appointment hours with a quiet exam room and pheromone diffusers.',
    languages: 'English, Hindi', days: [1, 3, 5, 6], color: 'vet-avatar--orange' },
  { id: 'four', name: 'Dr. Four', initials: 'D4', credentials: 'DVM', role: 'Urgent & Critical Care',
    bio: 'Covers sick visits and urgent cases, including weekends. Calm under pressure, great with big dogs.',
    languages: 'English', days: [0, 4, 5, 6], color: 'vet-avatar--ink' }
];

const STAFF = [
  { name: 'Staff 1', role: 'Lead Veterinary Technician', initials: 'S1', color: 'vet-avatar--brand' },
  { name: 'Staff 2', role: 'Front Desk & Client Care', initials: 'S2', color: 'vet-avatar--orange' }
];

/* ---- clinic_hours table (0 = Sunday) ---- */
const HOURS = [
  { day: 0, label: 'Sunday', open: '10:00', close: '15:00' },
  { day: 1, label: 'Monday', open: '08:00', close: '19:00' },
  { day: 2, label: 'Tuesday', open: '08:00', close: '19:00' },
  { day: 3, label: 'Wednesday', open: '08:00', close: '19:00' },
  { day: 4, label: 'Thursday', open: '08:00', close: '19:00' },
  { day: 5, label: 'Friday', open: '08:00', close: '19:00' },
  { day: 6, label: 'Saturday', open: '09:00', close: '17:00' }
];

const CLINIC = {
  name: 'PetHome Veterinary Clinic',
  phone: '(888) 888-8888',
  emergency: '(999) 999-9999',
  email: 'pethome@email.com',
  address: '31-10 Thomson Ave, Long Island City, NY 11101'
};

/* ---- demo client account (owners, pets, appointments, vaccinations, invoices) ----
   Dates are stored as "days from today" so the demo stays current. */
const DEMO_OWNER = { name: 'Carlos Zabala', initials: 'CZ', email: 'carlos.zabala83@login.cuny.edu', phone: '(111) 111-1111', since: 2026 };

const DEMO_PETS = [
  { id: 'princess', name: 'Princess', species: 'Dog', breed: 'Maltipoo', sex: 'Female (spayed)', ageYears: 4, weightLb: 9.9,
    photo: 'img/dog.jpg', microchip: '985 112 004 337 219', vet: 'one',
    weights: [{ d: -270, lb: 9.5 }, { d: -200, lb: 9.7 }, { d: -150, lb: 10.1 }, { d: -100, lb: 10.1 }, { d: -60, lb: 9.9 }],
    notes: 'Loves belly rubs. Needs a groom every 6 weeks; watch for tear stains.' },
  { id: 'mochi', name: 'Mochi', species: 'Cat', breed: 'Domestic Longhair (gray tabby)', sex: 'Male (neutered)', ageYears: 3, weightLb: 10.6,
    photo: 'img/cat.jpg', microchip: '985 112 006 901 554', vet: 'three',
    weights: [{ d: -270, lb: 9.7 }, { d: -220, lb: 9.9 }, { d: -165, lb: 10.1 }, { d: -120, lb: 10.4 }, { d: -45, lb: 10.6 }],
    notes: 'Indoor only. Long coat: brush weekly to prevent mats and hairballs. Happy to wear sweaters.' }
];

const DEMO_APPOINTMENTS = [
  { id: 'A-2210', pet: 'princess', service: 'vaccines', vet: 'one', day: 12, time: '10:30', status: 'Confirmed', note: 'DHPP booster' },
  { id: 'A-2231', pet: 'mochi', service: 'dental', vet: 'two', day: 20, time: '08:00', status: 'Confirmed', note: 'Drop off by 8:00, no food after midnight' },
  { id: 'A-2087', pet: 'princess', service: 'wellness', vet: 'one', day: -60, time: '15:00', status: 'Completed', note: 'Annual exam, all normal' },
  { id: 'A-1964', pet: 'mochi', service: 'urgent', vet: 'four', day: -120, time: '11:30', status: 'Completed', note: 'Vomiting hairballs; diet change, resolved' }
];

const DEMO_VACCINES = [
  { pet: 'princess', name: 'Rabies (3-year)', given: -685, due: 410 },
  { pet: 'princess', name: 'DHPP', given: -353, due: 12 },
  { pet: 'princess', name: 'Leptospirosis', given: -370, due: -5 },
  { pet: 'princess', name: 'Bordetella', given: -215, due: 150 },
  { pet: 'mochi', name: 'Rabies (1-year)', given: -165, due: 200 },
  { pet: 'mochi', name: 'FVRCP', given: -340, due: 25 },
  { pet: 'mochi', name: 'FeLV', given: -65, due: 300 }
];

const DEMO_INVOICES = [
  { id: 'INV-1077', pet: 'princess', day: -8, items: 'Lepto vaccine reminder visit, heartworm test', amount: 142.00, paid: false },
  { id: 'INV-1042', pet: 'princess', day: -60, items: 'Wellness exam, fecal test', amount: 186.50, paid: true },
  { id: 'INV-0981', pet: 'mochi', day: -120, items: 'Urgent care exam, anti-nausea injection', amount: 211.00, paid: true },
  { id: 'INV-0930', pet: 'mochi', day: -165, items: 'Rabies vaccine, wellness exam', amount: 98.00, paid: true }
];

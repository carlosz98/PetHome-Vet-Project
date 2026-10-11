# PetHome Veterinary Clinic

New updated version of my previous final project for System Analysis and Design, rebuilt as a veterinary clinic web application.

**Live site:** https://carlosz98.github.io/PetHome-Vet-Project/

**Course:** MAC 272 Web Development 2, Prof. Samia Alblwi  
**Author:** Carlos Zabala

The original version (a pet adoption center site) is at [carlosz98/Pet-Adoption-Center](https://github.com/carlosz98/Pet-Adoption-Center).

## Clinic details (placeholder data)

| Item | Value |
|---|---|
| Address | 31-10 Thomson Ave, Long Island City, NY 11101 |
| Main phone | (888) 888-8888 |
| Urgent line | (999) 999-9999 |
| Email | pethome@email.com |
| Founded | 2026 |
| Hours | Mon–Fri 8 AM–7 PM, Sat 9 AM–5 PM, Sun 10 AM–3 PM |
| Vets | Dr. One, Dr. Two, Dr. Three, Dr. Four (DVM) |
| Staff | Staff 1, Staff 2 |
| Demo client | Carlos Zabala, with pets Princess (Maltipoo) and Mochi (gray longhair cat) |

Service prices are based on typical NYC veterinary costs (Wellness Exam $85, Vaccinations from $35, Dental Cleaning from $650, Spay & Neuter from $450, Lab Work & X-Ray from $175, Urgent Care $150 exam, Microchipping $60, Senior Pet Care $110, Nail Trim & Grooming from $25). Pet weights are shown in pounds.

## What it does

- **Services & prices:** filterable list of clinic services.
- **Our Vets:** each veterinarian's specialty and working days.
- **Book a Visit:** 4-step booking (pet & owner → service & vet → date & time → review) with live open slots and a booking summary.
- **My Pets portal (demo data):** upcoming and past appointments, vaccine status, weight history and invoices with a pay button.
- **Sign in:** front-end sign-in page.
- **Contact:** validated contact form, hours and urgent line.

## Built with

- HTML, CSS and vanilla JavaScript (no frameworks)
- Responsive layout with light and dark mode
- Pet-themed animations drawn in code (no image files): walking paw prints, a peeking cat, paw/bone/fish confetti, a scroll-progress dog, an idle dog, a shy cat on the sign-in page, and paw-print page transitions. All motion respects the "reduce motion" setting.

## Project structure

```
index.html        Home
services.html     Services & prices
team.html         Our vets
about.html        About the clinic
contact.html      Contact form
book.html         Appointment booking
portal.html       My Pets client portal (demo)
login.html        Sign in
css/styles.css    All styles
js/data.js        Temporary clinic data: services, vets, hours, demo records
js/effects.js     Pet animations
js/main.js        Page logic: booking, portal, forms, validation
img/              Photos
contact.php       Contact form handler (for the PHP step)
subscribe.php     Newsletter handler (for the PHP step)
```

## Next steps

- PHP + MySQL back end: user accounts, saving bookings, real records and payments.
- Everything in `js/data.js` is temporary data that stands in for the database until then; each list maps to a future MySQL table (services, vets, staff, clinic hours, owners, pets, appointments, vaccinations, invoices).
- GitHub Pages only serves static files, so the PHP files don't run there. Forms stay in demo mode until the back end is hosted on a PHP server (or run locally with XAMPP).

---

Student project for MAC 272 Web Development 2. PetHome is not a real veterinary clinic: names, phone numbers and records are placeholders.

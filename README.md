# NAVION ROBOTICS — Thamarai workshop frontend

Student-facing robotics workshop landing page for NAVION ROBOTICS and Thamarai International School, Kumbakonam. Prepared for Jameel to connect to standard PHP hosting.

## Preview locally
Open a terminal inside the repository folder, run:

    python -m http.server 8080 --bind 127.0.0.1

Then open http://127.0.0.1:8080 . Stop with Ctrl+C.

## Hosting
Upload index.html, register.html, confirmation.html, styles.css, app.js, registration.js and the assets folder together into the chosen public directory. Relative links support hosting in a subfolder. No build step or dependencies are needed. README.md is a handoff note; keep it outside the public directory. No private management proposal is included.

## Content to edit
- index.html: school identity, Classes VI–X eligibility, December 2026, date announcement, fee of ₹3,500, project details and included benefits.
- register.html: student and parent/guardian form, with required admission number, email and previous robotics experience.
- confirmation.html: details review, payment-pending state, and inert verified-payment success template.
- registration.js: browser-tab draft and review logic only; no API calls.
- REGISTRATION_HANDOFF.md: database and Razorpay handoff for Jamil.
- assets/workshop-poster.svg: standalone downloadable poster with embedded logos and illustration.
- assets/concepts/: the three active robot creative illustrations, generated with OpenAI Imagegen. These are illustrative scenes rather than a manufacturing bill of materials.

## Before public launch
Confirm eligibility, exact date and public copy with the school. Connect the reviewed registration frontend to the backend and payment flow. Define consent, payment/refund terms and support details before collecting information or payments. If Razorpay is added, create orders and verify signatures on the PHP backend; keep payment secrets server-side. Remove noindex/nofollow tags when approved for indexing. Update the poster when any workshop facts change.

## Identity assets
NAVION logo source: https://navionrobotics.com/assets/img/logo-mark.png
Thamarai logo source: https://thamaraischools.org/assets/logo.png

The workshop is an independent student-led project. No certificate, support hours, exact timetable or registration URL is promised.

## Deployment automation
Clone or pull the `main` branch, then deploy `index.html`, `register.html`, `confirmation.html`, `registration.js`, `styles.css`, `app.js` and `assets/` together. There is no build command. The site works at the domain root or within a subfolder. Configure hosting credentials and deployment triggers in the hosting system; none are stored here.

## Registration preview
See REGISTRATION_HANDOFF.md for the backend connection points. confirmation-preview.html is a clearly labeled success-screen design reference, not a production payment confirmation endpoint.

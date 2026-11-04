# Registration frontend handoff for Jamil

## Current behavior
The form and review page work as a frontend preview. Data stays in sessionStorage for the current browser tab. No registration is submitted, payment taken, email sent or WhatsApp invitation delivered. The payment button is intentionally disabled. No Razorpay SDK or credentials are included. Do not use browser storage as the final registration database or evidence of payment.

## Approved fields
All are required: student_name, admission_number (string; preserve leading zeroes/letters), student_class (VI, VII, VIII, IX, X), student_section, robotics_experience (beginner, basic, experienced), guardian_name, guardian_mobile (10-digit Indian mobile; add country prefix +91 server-side), guardian_email, guardian_consent (true).
The school is fixed to Thamarai International School, Kumbakonam. The workshop is December 2026; exact date remains unannounced. Fee: INR 3,500 per student. Admission number identifies the student; no separate roll number is collected.

## Production flow
1. Validate the complete form on the server, including consent, allowable class/experience values and duplicate admission numbers. Save a pending registration with an opaque registration ID; protect session-bound endpoints with appropriate request validation. Replace sessionStorage preview logic with server-owned registration state. Do not put personal details in query strings.
2. Calculate amount and currency on the server (350000 paise, INR); never trust a client amount. Create a Razorpay order for this registration on the server and pass its order ID and public key ID to Standard Checkout. Only enable the payment button once this is connected. Keep the key secret on the server.
3. Send the Checkout payment ID, order ID and signature to the backend. Verify the signature against the server-stored order ID and secret. Confirm the amount, currency and captured payment status before marking the registration paid. Handle pending, failed and cancelled payments without showing success. Make webhook processing and receipt creation idempotent to avoid duplicate confirmations or invitations.
4. confirmation.html includes #verified-payment-confirmation as an inert HTML template. Render its success content only from a server-verified paid registration, with actual registration ID, student name, amount and payment reference in [data-verified-receipt]. A URL flag, local storage entry or client callback must never unlock verified success. Populate values as text or escape them server-side.
5. Once payment is confirmed, send the WhatsApp group invitation to the parent's supplied contact through the agreed delivery process. The page copy says: “Once payment is successful, we’ll send you the link to join the workshop WhatsApp group for further details.” The group URL and delivery automation have not been supplied; connect these before opening registration. Do not embed a private group invite in public source files.
6. Remove the registration-preview message and adjust the landing-page registration availability text when enrolment opens. Confirm the final contact/privacy wording and payment/refund terms with the organiser before launch. Keep README and this handoff document outside the public web root.

## Frontend files
register.html, confirmation.html, registration.js and styles.css. index.html links to register.html. Relative paths work in a PHP hosting subfolder. Browser draft storage errors show a recoverable message. Empty review sessions offer a link back to the form. Editing restores the current tab's draft. User-entered values are displayed with textContent.

## Official integration reference
https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
https://github.com/razorpay/markdown-docs/blob/master/payments/payment-gateway/quick-integration/integration-steps.md

## Success screen design preview
Open confirmation-preview.html to review the successful-payment layout. All receipt values are placeholders and a visible preview banner explains that no registration or payment has been processed. This is a design reference; do not deploy it as the production success endpoint. Render the verified template from confirmation.html with real backend data after payment verification.

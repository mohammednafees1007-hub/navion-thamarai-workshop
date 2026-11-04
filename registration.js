// Frontend preview only. No registration or payment API requests are made.
(() => {
  const storageKey = 'navion.workshop.registration.draft.v1';
  const experienceLabels = {beginner: 'No previous experience', basic: 'School classes or basic projects', experienced: 'Built or programmed a robot before'};
  const fields = ['student_name', 'admission_number', 'student_class', 'student_section', 'robotics_experience', 'guardian_name', 'guardian_mobile', 'guardian_email'];
  const readDraft = () => { try { const data = JSON.parse(sessionStorage.getItem(storageKey) || 'null'); return data && typeof data === 'object' ? data : null; } catch { return null; } };
  const form = document.querySelector('#workshop-registration');
  if (form) {
    const mobile = form.elements.namedItem('guardian_mobile');
    const panel = document.querySelector('#otp-panel');
    const code = document.querySelector('#mobile-otp');
    const send = document.querySelector('#send-otp');
    const feedback = document.querySelector('#otp-feedback');
    const status = document.querySelector('#otp-status');
    let requestedNumber = '';
    let previewConfirmedNumber = '';
    const resetOtp = () => {
      requestedNumber = ''; previewConfirmedNumber = ''; panel.hidden = true;
      code.value = ''; code.disabled = true; feedback.textContent = '';
      status.textContent = 'Confirm this number before continuing.';
      status.classList.remove('otp-complete'); send.disabled = false;
      send.textContent = 'Send OTP'; send.setAttribute('aria-expanded', 'false');
      try { const draft = readDraft(); if (draft) { delete draft.mobile_otp_preview_completed; sessionStorage.setItem(storageKey, JSON.stringify(draft)); } } catch {}
    };
    const requestOtpPreview = () => {
      mobile.value = mobile.value.trim();
      if (!mobile.reportValidity()) return;
      requestedNumber = mobile.value; previewConfirmedNumber = '';
      panel.hidden = false; code.disabled = false; code.value = '';
      feedback.textContent = ''; status.classList.remove('otp-complete');
      status.textContent = `Preview code ready for +91 ${requestedNumber}. No message was sent.`;
      send.setAttribute('aria-expanded', 'true'); send.textContent = 'Request new OTP';
      code.focus();
    };
    send.addEventListener('click', requestOtpPreview);
    document.querySelector('#resend-otp').addEventListener('click', requestOtpPreview);
    mobile.addEventListener('input', resetOtp);
    document.querySelector('#verify-otp').addEventListener('click', () => {
      if (!requestedNumber || requestedNumber !== mobile.value.trim()) { resetOtp(); mobile.focus(); return; }
      if (!/^[0-9]{6}$/.test(code.value.trim())) { feedback.textContent = 'Enter the 6-digit code.'; code.focus(); return; }
      if (code.value.trim() !== '123456') { feedback.textContent = 'That code does not match. Use 123456 for this preview.'; code.focus(); return; }
      previewConfirmedNumber = requestedNumber;
      status.textContent = `OTP preview complete for +91 ${previewConfirmedNumber}.`;
      status.classList.add('otp-complete'); panel.hidden = true; code.value = ''; code.disabled = true;
      send.disabled = true; send.setAttribute('aria-expanded', 'false');
      document.querySelector('#registration-error').hidden = true;
    });
    code.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); document.querySelector('#verify-otp').click(); } });
    form.addEventListener('reset', resetOtp);
    form.addEventListener('reset', () => { try { sessionStorage.removeItem(storageKey); } catch {} document.querySelector('#registration-error').hidden = true; });
    const draft = readDraft();
    if (draft) { for (const name of fields) { if (typeof draft[name] === 'string') form.elements.namedItem(name).value = draft[name]; } form.elements.namedItem('guardian_consent').checked = draft.guardian_consent === true; }
    form.addEventListener('submit', event => {
      event.preventDefault();
      const error = document.querySelector('#registration-error');
      for (const name of fields) { const input = form.elements.namedItem(name); input.value = input.value.trim(); }
      if (!form.reportValidity()) return;
      if (previewConfirmedNumber !== form.elements.namedItem('guardian_mobile').value) { error.textContent = 'Complete the mobile OTP preview before continuing.'; error.hidden = false; send.focus(); return; }
      const draft = Object.fromEntries(fields.map(name => [name, form.elements.namedItem(name).value]));
      draft.mobile_otp_preview_completed = true; // UI demo only; never evidence of real verification.
      draft.guardian_consent = form.elements.namedItem('guardian_consent').checked;
      try { sessionStorage.setItem(storageKey, JSON.stringify(draft)); window.location.assign('confirmation.html'); }
      catch { error.textContent = 'Your browser could not keep the details for this preview. Allow session storage and try again.'; error.hidden = false; }
    });
  }
  const review = document.querySelector('#registration-review');
  if (review) {
    const draft = readDraft();
    const valid = draft && fields.every(name => typeof draft[name] === 'string' && draft[name].trim()) && draft.guardian_consent === true;
    document.querySelector(valid ? '#registration-review' : '#empty-registration').hidden = false;
    if (valid) {
      const rows = [['Student', draft.student_name], ['Admission number', draft.admission_number], ['Class & section', `${draft.student_class} – ${draft.student_section}`], ['School', 'Thamarai International School, Kumbakonam'], ['Robotics experience', experienceLabels[draft.robotics_experience] || draft.robotics_experience], ['Parent / guardian', draft.guardian_name], ['Mobile', `+91 ${draft.guardian_mobile}`], ['Mobile confirmation', draft.mobile_otp_preview_completed ? 'OTP preview completed — not live verification' : 'OTP confirmation required'], ['Email', draft.guardian_email], ['Parent / guardian permission', 'Given']];
      const list = document.querySelector('#review-details');
      for (const [label, value] of rows) { const row = document.createElement('div'); const term = document.createElement('dt'); const detail = document.createElement('dd'); term.textContent = label; detail.textContent = value; row.append(term, detail); list.append(row); }
    }
  }
})();

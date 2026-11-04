// Frontend preview only. No registration or payment API requests are made.
(() => {
  const storageKey = 'navion.workshop.registration.draft.v1';
  const experienceLabels = {beginner: 'No previous experience', basic: 'School classes or basic projects', experienced: 'Built or programmed a robot before'};
  const fields = ['student_name', 'admission_number', 'student_class', 'student_section', 'robotics_experience', 'guardian_name', 'guardian_mobile', 'guardian_email'];
  const readDraft = () => { try { const data = JSON.parse(sessionStorage.getItem(storageKey) || 'null'); return data && typeof data === 'object' ? data : null; } catch { return null; } };
  const form = document.querySelector('#workshop-registration');
  if (form) {
    form.addEventListener('reset', () => { try { sessionStorage.removeItem(storageKey); } catch {} document.querySelector('#registration-error').hidden = true; });
    const draft = readDraft();
    if (draft) { for (const name of fields) { if (typeof draft[name] === 'string') form.elements.namedItem(name).value = draft[name]; } form.elements.namedItem('guardian_consent').checked = draft.guardian_consent === true; }
    form.addEventListener('submit', event => {
      event.preventDefault();
      const error = document.querySelector('#registration-error');
      for (const name of fields) { const input = form.elements.namedItem(name); input.value = input.value.trim(); }
      if (!form.reportValidity()) return;
      const draft = Object.fromEntries(fields.map(name => [name, form.elements.namedItem(name).value]));
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
      const rows = [['Student', draft.student_name], ['Admission number', draft.admission_number], ['Class & section', `${draft.student_class} – ${draft.student_section}`], ['School', 'Thamarai International School, Kumbakonam'], ['Robotics experience', experienceLabels[draft.robotics_experience] || draft.robotics_experience], ['Parent / guardian', draft.guardian_name], ['Mobile', `+91 ${draft.guardian_mobile}`], ['Email', draft.guardian_email], ['Parent / guardian permission', 'Given']];
      const list = document.querySelector('#review-details');
      for (const [label, value] of rows) { const row = document.createElement('div'); const term = document.createElement('dt'); const detail = document.createElement('dd'); term.textContent = label; detail.textContent = value; row.append(term, detail); list.append(row); }
    }
  }
})();

/**
 * FORMULAIRES ERIAS PRO (Masterclass & IC LYCÉE) — Netlify Forms
 *
 * Attributs reconnus sur <form class="ep-form"> :
 *   data-ref-prefix="MC"            préfixe du numéro de dossier
 *   data-prefill                    pré-remplit les champs depuis l'URL (?champ=valeur)
 *   data-redirect="/page?x={champ}" redirection après envoi (valeurs encodées)
 * Dans le formulaire :
 *   [data-check-group="nom"]        groupe de cases → champ caché name="nom" (« A · B »)
 *   [data-required-group]           au moins une case cochée
 * Dans le bloc de confirmation [data-form-success] :
 *   [data-fill="champ"]             reçoit la valeur du champ
 *   [data-wa="numéro"][data-wa-text="Bonjour {prenom}…"]  lien WhatsApp pré-rempli
 */
(function () {
  const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
  window.ERIAS_WA = {
    general: '24177420617', // WhatsApp officiel ERIAS (+241 77 42 06 17)
    paiement: '24177109642' // Paiement Mobile Money & preuves IC LYCÉE (077 10 96 42)
  };

  const waLink = (number, text) => `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  window.ERIAS_WA.link = waLink;

  function fieldValue(form, name) {
    const fields = form.querySelectorAll(`[name="${CSS.escape(name)}"]`);
    if (!fields.length) return '';
    const first = fields[0];
    if (first.type === 'radio') {
      const checked = [...fields].find((f) => f.checked);
      return checked ? checked.value : '';
    }
    if (first.tagName === 'SELECT') {
      return first.value;
    }
    return first.value || '';
  }

  const fill = (template, form) =>
    String(template || '').replace(/\{([a-z0-9_-]+)\}/gi, (_m, key) => fieldValue(form, key).trim());

  function syncGroups(form) {
    form.querySelectorAll('[data-check-group]').forEach((group) => {
      const name = group.dataset.checkGroup;
      const hidden = form.querySelector(`input[type="hidden"][name="${CSS.escape(name)}"]`);
      const values = [...group.querySelectorAll('input[type="checkbox"]:checked')].map((c) => c.value);
      if (hidden) hidden.value = values.join(' · ');
    });
  }

  function validateGroups(form) {
    let firstInvalid = null;
    form.querySelectorAll('[data-check-group][data-required-group]').forEach((group) => {
      const ok = !!group.querySelector('input[type="checkbox"]:checked');
      let msg = group.parentElement.querySelector(':scope > .ep-group-error');
      if (!ok) {
        if (!msg) {
          msg = document.createElement('div');
          msg.className = 'ep-group-error';
          msg.setAttribute('role', 'alert');
          group.insertAdjacentElement('afterend', msg);
        }
        msg.textContent = group.dataset.requiredGroup || 'Coche au moins une option.';
        if (!firstInvalid) firstInvalid = group;
      } else if (msg) {
        msg.remove();
      }
    });
    return firstInvalid;
  }

  function prefill(form) {
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      const fields = form.querySelectorAll(`[name="${CSS.escape(key)}"]`);
      fields.forEach((f) => {
        if (f.type === 'radio' || f.type === 'checkbox') {
          if (f.value === value) f.checked = true;
        } else if (f.tagName === 'SELECT') {
          if ([...f.options].some((o) => o.value === value)) f.value = value;
        } else if (f.type !== 'hidden' && f.type !== 'file') {
          f.value = value;
        }
        f.dispatchEvent(new Event('change', { bubbles: true }));
      });
      // Cases à cocher groupées (ex. ?matieres=Maths)
      form.querySelectorAll(`[data-check-group="${CSS.escape(key)}"] input[type="checkbox"]`).forEach((c) => {
        if (value.split(/\s*[·,]\s*/).includes(c.value)) c.checked = true;
      });
    });
  }

  function initForm(form) {
    const errorBox = form.querySelector('[data-form-error]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const card = form.closest('.fx-card') || form.parentElement;
    const success = card.querySelector('[data-form-success]');

    if (form.hasAttribute('data-prefill')) prefill(form);

    form.addEventListener('change', (e) => {
      if (e.target.closest('[data-check-group]')) validateGroups(form);
      if (e.target.classList.contains('ep-field-invalid') && e.target.checkValidity()) {
        e.target.classList.remove('ep-field-invalid');
      }
    });

    const showError = (msg) => {
      if (!errorBox) { alert(msg); return; }
      errorBox.textContent = msg;
      errorBox.hidden = false;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (errorBox) errorBox.hidden = true;

      // Validation des champs (natifs) puis des groupes de cases
      const invalidFields = [...form.querySelectorAll('input, select, textarea')].filter((f) => !f.checkValidity());
      invalidFields.forEach((f) => f.classList.add('ep-field-invalid'));
      const invalidGroup = validateGroups(form);
      if (invalidFields.length) {
        invalidFields[0].reportValidity();
        invalidFields[0].focus();
        return;
      }
      if (invalidGroup) {
        invalidGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const files = [...form.querySelectorAll('input[type="file"]')].flatMap((input) => [...input.files]);
      if (files.reduce((sum, f) => sum + f.size, 0) > MAX_UPLOAD_BYTES) {
        showError('Le fichier joint dépasse 8 Mo. Merci d\'envoyer un document plus léger (PDF compressé ou photo).');
        return;
      }

      syncGroups(form);
      const reference = `${form.dataset.refPrefix || 'ERIAS'}-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`;
      const refField = form.querySelector('input[name="reference_dossier"]');
      if (refField) refField.value = reference;
      form.dispatchEvent(new CustomEvent('ep:before-submit', { detail: { reference } }));

      const data = new FormData(form);
      const request = form.enctype === 'multipart/form-data'
        ? { method: 'POST', body: data }
        : {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data).toString()
          };

      const label = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours…';
      }

      try {
        const response = await fetch('/', request);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        if (form.dataset.redirect) {
          window.location.href = form.dataset.redirect.replace(/\{([a-z0-9_-]+)\}/gi, (_m, key) =>
            encodeURIComponent(key === 'reference' ? reference : fieldValue(form, key).trim()));
          return;
        }

        if (success) {
          success.querySelectorAll('[data-fill]').forEach((el) => {
            el.textContent = el.dataset.fill === 'reference_dossier' ? reference : fieldValue(form, el.dataset.fill);
          });
          success.querySelectorAll('[data-wa]').forEach((a) => {
            a.href = waLink(window.ERIAS_WA[a.dataset.wa] || a.dataset.wa, fill(String(a.dataset.waText || '').replace(/\{reference\}/g, reference), form));
            a.target = '_blank';
            a.rel = 'noopener';
          });
          form.hidden = true;
          success.hidden = false;
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (err) {
        showError("L'envoi a échoué. Vérifie ta connexion Internet puis réessaie. Si le problème persiste, écris-nous sur WhatsApp au +241 77 42 06 17.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = label;
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form.ep-form').forEach(initForm);
  });
})();

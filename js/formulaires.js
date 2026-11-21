/**
 * FORMULAIRES D'INSCRIPTION PAR ENTITÉ (Netlify Forms)
 * - formulaire-pce-icn.html     : Module Basique PCEICN-0001 (Niveau 1 / Niveau 2)
 * - formulaire-metiers-vae.html : Formations métiers en alternance & programme VAE
 *
 * Les soumissions sont envoyées à Netlify Forms (POST url-encodé ou multipart
 * si le formulaire contient des fichiers) puis une confirmation est affichée.
 */

(function () {
  const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // limite Netlify Forms par envoi

  const formatFcfa = (n) => Number(n).toLocaleString('fr-FR').replace(/ | /g, ' ') + ' FCFA';

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form.fx-form').forEach(initForm);
  });

  function initForm(form) {
    const radios = [...form.querySelectorAll('input[type="radio"][data-show]')];

    // --- Affichage des blocs conditionnels + champs obligatoires associés ---
    const syncConditional = () => {
      radios.forEach((radio) => {
        const id = radio.dataset.show;
        if (!id) return;
        const bloc = document.getElementById(id);
        if (!bloc) return;
        const visible = radio.checked;
        bloc.hidden = !visible;
        bloc.querySelectorAll('[data-required-when-shown]').forEach((field) => {
          field.required = visible;
        });
      });
    };

    radios.forEach((radio) => radio.addEventListener('change', () => {
      syncConditional();
      updateRecap();
    }));

    // --- Spécifique : formulaire PCE ICN (montant selon le niveau) ---
    const amountField = form.querySelector('input[name="montant_fcfa"]');

    // --- Spécifique : formulaire Métiers & VAE (pôle → métier → coûts) ---
    const poleSelect = form.querySelector('select[name="pole"]');
    const metierSelect = form.querySelector('select[name="metier"]');
    const coutField = form.querySelector('input[name="cout_estime_fcfa"]');
    const ref = window.referentiel && window.referentiel.data;

    if (poleSelect && metierSelect && ref) {
      ref.polesMetiers.forEach((pole) => {
        const opt = document.createElement('option');
        opt.value = pole.nom;
        opt.dataset.poleId = pole.id;
        opt.textContent = `${pole.icon} ${pole.nom}`;
        poleSelect.appendChild(opt);
      });

      poleSelect.addEventListener('change', () => {
        const selected = poleSelect.selectedOptions[0];
        const pole = ref.polesMetiers.find((p) => p.id === (selected && selected.dataset.poleId));
        metierSelect.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = pole ? '— Sélectionnez un métier —' : "— Choisissez d'abord un pôle —";
        metierSelect.appendChild(placeholder);
        if (pole) {
          pole.metiers.forEach((m) => {
            const opt = document.createElement('option');
            opt.value = `${m.code} — ${m.nom}`;
            opt.dataset.code = m.code;
            opt.textContent = `${m.nom} (${m.dureeMois} mois)`;
            metierSelect.appendChild(opt);
          });
        }
        metierSelect.disabled = !pole;
        updateRecap();
      });

      metierSelect.addEventListener('change', updateRecap);
    }

    function updateRecap() {
      const formuleEl = form.querySelector('[data-recap="formule"]');
      const montantEl = form.querySelector('[data-recap="montant"]');
      const labelEl = form.querySelector('[data-recap="label"]');
      const linesEl = form.querySelector('[data-recap="lines"]');
      const checked = form.querySelector('input[type="radio"][data-show]:checked');

      // PCE ICN : niveau 1 ou 2
      if (amountField && checked && checked.dataset.amount) {
        const amount = Number(checked.dataset.amount);
        amountField.value = String(amount);
        if (formuleEl) formuleEl.textContent = checked.value.replace(/\s*\(.*\)\s*$/, '');
        if (montantEl) montantEl.textContent = formatFcfa(amount);
        return;
      }

      // Métiers & VAE
      if (!metierSelect || !ref) return;
      const isVae = checked && checked.dataset.show === 'blocVae';
      const titleEl = form.querySelector('[data-parcours-title]');
      if (titleEl) titleEl.textContent = isVae ? 'Votre expérience professionnelle' : 'Votre projet de formation';

      const code = metierSelect.selectedOptions[0] && metierSelect.selectedOptions[0].dataset.code;
      const metier = code ? window.referentiel.getMetier(code) : null;

      if (labelEl) labelEl.textContent = isVae ? 'Programme VAE' : 'Formation en alternance';
      if (!metier) {
        if (formuleEl) formuleEl.textContent = 'Sélectionnez un métier';
        if (montantEl) montantEl.textContent = '—';
        if (linesEl) linesEl.innerHTML = '';
        if (coutField) coutField.value = '';
        return;
      }

      let total;
      let lines;
      if (isVae) {
        const vae = ref.vaeProgramme;
        total = vae.fraisDossier + vae.coutEvaluation;
        lines = [
          ['Frais de dossier VAE', formatFcfa(vae.fraisDossier)],
          ["Évaluation & jury d'experts", formatFcfa(vae.coutEvaluation)]
        ];
      } else {
        total = metier.coutTotal;
        const payePendant = metier.mensualite * metier.mensualites;
        lines = [
          ['Durée', `${metier.dureeMois} mois`],
          ["Frais d'inscription", formatFcfa(ref.facilitePaiementDefaults.fraisInscriptionGlobaux)],
          ['Mensualité pendant la formation', `${formatFcfa(metier.mensualite)} × ${metier.mensualites}`],
          ['Solde couvert par la facilité de paiement (stage)', formatFcfa(Math.max(0, metier.coutTotal - payePendant))]
        ];
      }

      if (formuleEl) formuleEl.textContent = metier.nom;
      if (montantEl) montantEl.textContent = formatFcfa(total);
      if (coutField) coutField.value = String(total);
      if (linesEl) {
        linesEl.innerHTML = '';
        lines.forEach(([label, value]) => {
          const row = document.createElement('div');
          const l = document.createElement('span');
          const v = document.createElement('strong');
          l.textContent = label;
          v.textContent = value;
          row.append(l, v);
          linesEl.appendChild(row);
        });
      }
    }

    syncConditional();
    updateRecap();

    // --- Envoi vers Netlify Forms ---
    const errorBox = form.querySelector('[data-form-error]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const card = form.closest('.fx-card');
    const success = card && card.querySelector('[data-form-success]');

    const showError = (msg) => {
      if (!errorBox) { alert(msg); return; }
      errorBox.textContent = msg;
      errorBox.hidden = false;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (errorBox) errorBox.hidden = true;

      const files = [...form.querySelectorAll('input[type="file"]')].flatMap((input) => [...input.files]);
      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      if (totalSize > MAX_UPLOAD_BYTES) {
        showError('Les fichiers joints dépassent 8 Mo au total. Merci de réduire leur taille ou d\'envoyer un seul document.');
        return;
      }

      // Numéro de dossier unique
      const checked = form.querySelector('input[type="radio"][data-ref-prefix]:checked');
      const prefix = (checked && checked.dataset.refPrefix) || form.dataset.refPrefix || 'PCE';
      const reference = `${prefix}-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`;
      const refField = form.querySelector('input[name="reference_dossier"]');
      if (refField) refField.value = reference;

      const data = new FormData(form);
      const hasFiles = form.enctype === 'multipart/form-data';
      const request = hasFiles
        ? { method: 'POST', body: data }
        : {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data).toString()
          };

      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours…';
      }

      try {
        const response = await fetch('/', request);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        form.hidden = true;
        if (success) {
          const refEl = success.querySelector('[data-success-ref]');
          if (refEl) refEl.textContent = reference;
          success.hidden = false;
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (err) {
        showError("L'envoi a échoué. Vérifiez votre connexion Internet puis réessayez. Si le problème persiste, contactez-nous sur WhatsApp au +241 77 00 11 22.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    });
  }
})();

/**
 * GESTION IC LYCÉE — onglets Professeurs / Demandes / Planning
 * API : /api/ic-lycee/* (en-tête x-erias-admin = code admin ERIAS)
 */
(function () {
  const KEY = 'erias_iclycee_admin';
  const API = '/api/ic-lycee';
  const state = { profs: [], demandes: [], seances: [], matchOpen: null, matches: {} };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const list = (arr) => (Array.isArray(arr) ? arr : []).join(', ');
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const statusClass = (s) => ({
    'En attente': 'st-attente', 'Certifié': 'st-certifie', 'Actif': 'st-actif', 'Suspendu': 'st-suspendu',
    '1ère tranche': 'st-tranche', 'Payé': 'st-paye', 'Retard': 'st-retard',
    'Planifié': 'st-planifie', 'Effectué': 'st-effectue', 'Reporté': 'st-reporte', 'Annulé': 'st-annule'
  }[s] || 'st-attente');
  const badge = (s) => `<span class="ep-status ${statusClass(s)}">${esc(s)}</span>`;
  const dateFr = (iso) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return esc(iso || '—');
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  // Numéro WhatsApp → format international Gabon (241…)
  const waNumber = (raw) => {
    let d = String(raw || '').replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    if (d.startsWith('241')) return d;
    if (d.length === 9 && d.startsWith('0')) return '241' + d.slice(1);
    if (d.length === 8) return '241' + d;
    return d;
  };

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'ep-toast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  async function api(path, options = {}) {
    const res = await fetch(API + path, {
      ...options,
      headers: { 'content-type': 'application/json', 'x-erias-admin': sessionStorage.getItem(KEY) || '', ...(options.headers || {}) }
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 401) {
      logout('Code admin invalide ou session expirée.');
      throw new Error('unauthorized');
    }
    if (!res.ok) throw new Error(body.error || `Erreur ${res.status}`);
    return body;
  }

  /* -------------------------------------------------------------- Session */
  function logout(message) {
    sessionStorage.removeItem(KEY);
    $('gApp').hidden = true;
    $('gLogin').hidden = false;
    if (message) {
      $('gLoginError').textContent = message;
      $('gLoginError').hidden = false;
    }
  }

  async function login(code) {
    sessionStorage.setItem(KEY, code);
    await api('/session');
    $('gLogin').hidden = true;
    $('gApp').hidden = false;
    await loadAll();
  }

  async function loadAll() {
    const [p, d, s] = await Promise.all([api('/profs'), api('/demandes'), api('/planning')]);
    state.profs = p.profs || [];
    state.demandes = d.demandes || [];
    state.seances = s.seances || [];
    renderAll();
  }

  const profById = (id) => state.profs.find((p) => p.id === id);

  /* ---------------------------------------------------------------- KPIs */
  function renderKpis() {
    $('kProfs').textContent = state.profs.filter((p) => p.statut === 'Certifié' || p.statut === 'Actif').length;
    $('kSansProf').textContent = state.demandes.filter((d) => !d.profId).length;
    $('kAttente').textContent = state.demandes.filter((d) => d.statutPaiement === 'En attente' || d.statutPaiement === 'Retard').length;
    const encaisse = state.demandes.reduce((sum, d) => {
      if (d.statutPaiement === 'Payé') return sum + d.montant;
      if (d.statutPaiement === '1ère tranche') return sum + Math.ceil(d.montant / 2);
      return sum;
    }, 0);
    $('kEncaisse').textContent = `${fmt(encaisse)} F`;
    $('cProfs').textContent = state.profs.length;
    $('cDemandes').textContent = state.demandes.length;
    $('cPlanning').textContent = state.seances.length;
  }

  /* ---------------------------------------------------------- Professeurs */
  function renderProfs() {
    const q = norm($('gSearchProfs').value);
    const f = $('gFilterProfs').value;
    const rows = state.profs.filter((p) =>
      (!f || p.statut === f) &&
      (!q || norm([p.nom, list(p.matieres), list(p.niveaux), p.ville, p.mode, p.statutPro].join(' ')).includes(q)));

    $('tProfs').innerHTML = rows.length ? rows.map((p) => `
      <tr>
        <td><strong>${esc(p.nom)}</strong><br><small>${esc(p.statutPro)}${p.etablissement ? ' · ' + esc(p.etablissement) : ''}</small>
          <br><small>${esc(p.whatsapp)}${p.tarifHoraire ? ' · ' + esc(p.tarifHoraire) : ''}</small>
          ${p.cvUrl && /^https?:\/\//.test(p.cvUrl) ? `<br><a href="${esc(p.cvUrl)}" target="_blank" rel="noopener" style="color:var(--ep-gold-light);">Voir CV / diplôme</a>` : ''}</td>
        <td>${esc(list(p.matieres))}</td>
        <td>${esc(list(p.niveaux))}</td>
        <td>${esc(p.ville)}</td>
        <td>${esc(p.mode)}</td>
        <td>${badge(p.statut)}<br><small>Certif. : ${esc(p.certification || '—')}</small></td>
        <td><div class="ep-actions-cell">
          <button type="button" class="ep-btn ep-btn-gold ep-btn-sm" data-prof-statut="Certifié" data-id="${p.id}" ${p.statut === 'Certifié' ? 'disabled' : ''}>Certifier</button>
          <button type="button" class="ep-btn ep-btn-green ep-btn-sm" data-prof-statut="Actif" data-id="${p.id}" ${p.statut === 'Actif' ? 'disabled' : ''}>Activer</button>
          <button type="button" class="ep-btn ep-btn-outline ep-btn-sm" data-prof-statut="Suspendu" data-id="${p.id}" ${p.statut === 'Suspendu' ? 'disabled' : ''}>Suspendre</button>
          <a class="ep-btn ep-btn-wa ep-btn-sm" href="https://wa.me/${waNumber(p.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>
        </div></td>
      </tr>`).join('') : '<tr><td colspan="7" class="ep-empty">Aucun professeur pour le moment. Les candidatures du formulaire « Devenir Professeur » apparaissent ici automatiquement.</td></tr>';
  }

  /* ------------------------------------------------------------- Demandes */
  function matchPanel(d) {
    const m = state.matches[d.id];
    if (!m) return '<div class="ep-match-panel">Recherche des professeurs correspondants…</div>';
    const firstDate = /^\d{4}-\d{2}-\d{2}$/.test(d.dateDebut) ? d.dateDebut : '';
    const crit = (ok, label) => `<span class="ep-crit${ok ? ' ok' : ''}">${ok ? '✓' : '✗'} ${label}</span>`;
    const others = state.profs.filter((p) => (p.statut === 'Certifié' || p.statut === 'Actif') && !m.some((x) => x.prof.id === p.id));
    return `<div class="ep-match-panel">
      <strong style="color:#ffc078;">Matching automatique</strong> — ${esc(list(d.matieres))} · ${esc(d.classe)} · ${esc(d.ville)} · ${esc(d.mode)}
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;">
        <label style="font-size:.78rem;color:var(--text-muted);">1ère séance <input type="date" class="ep-mini-select" data-first-date="${d.id}" value="${esc(firstDate)}"></label>
        <label style="font-size:.78rem;color:var(--text-muted);">Heure <input type="time" class="ep-mini-select" data-first-heure="${d.id}" value="16:00"></label>
      </div>
      ${m.length ? m.map((x) => `
        <div class="ep-match">
          <div><strong>${esc(x.prof.nom)}</strong> ${badge(x.prof.statut)} <small>· ${esc(x.prof.ville)} · ${esc(x.prof.mode)}</small><br>
            ${crit(x.criteres.matiere, 'Matière : ' + esc(x.matieresCommunes.join(', ')))}${crit(x.criteres.niveau, 'Niveau ' + esc(d.classe))}${crit(x.criteres.mode, 'Mode')}${crit(x.criteres.ville, 'Ville')}</div>
          <button type="button" class="ep-btn ep-btn-orange ep-btn-sm" data-assign="${d.id}" data-prof="${x.prof.id}">Assigner</button>
        </div>`).join('') : '<p class="fx-hint">Aucun professeur certifié ne correspond encore à cette demande (matière, mode et ville).</p>'}
      ${others.length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px;">
        <small style="color:var(--text-muted);">Ou choisir manuellement :</small>
        <select class="ep-mini-select" data-manual-prof="${d.id}">${others.map((p) => `<option value="${p.id}">${esc(p.nom)} — ${esc(list(p.matieres))} (${esc(p.ville)})</option>`).join('')}</select>
        <button type="button" class="ep-btn ep-btn-outline ep-btn-sm" data-assign-manual="${d.id}">Assigner</button>
      </div>` : ''}
    </div>`;
  }

  function renderDemandes() {
    const q = norm($('gSearchDemandes').value);
    const f = $('gFilterDemandes').value;
    const rows = state.demandes.filter((d) =>
      (!f || d.statutPaiement === f) &&
      (!q || norm([d.eleveNom, d.parentNom, d.classe, list(d.matieres), d.ville, d.forfait].join(' ')).includes(q)));

    $('tDemandes').innerHTML = rows.length ? rows.map((d) => {
      const prof = d.profId ? profById(d.profId) : null;
      const waText = `Bonjour ${d.parentNom || ''}, ici IC LYCÉE au sujet des cours de ${d.eleveNom} (${list(d.matieres)}, ${d.classe}) — Forfait ${d.forfait}.`;
      return `
      <tr>
        <td><strong>${esc(d.eleveNom)}</strong><br><small>Parent : ${esc(d.parentNom)} · ${esc(d.ville)}</small><br><small>${esc(d.besoin)} · début ${dateFr(d.dateDebut)}</small></td>
        <td>${esc(d.classe)}</td>
        <td>${esc(list(d.matieres))}</td>
        <td>${esc(d.mode)}</td>
        <td>${esc(d.forfait)}${d.facilitePaiement ? '<br><small style="color:#ffc078;">Paiement en 2 fois</small>' : ''}</td>
        <td><strong>${fmt(d.montant)} F</strong></td>
        <td>${badge(d.statutPaiement)}<br>
          <select class="ep-mini-select" data-paiement="${d.id}" aria-label="Statut de paiement" style="margin-top:6px;">
            ${['En attente', '1ère tranche', 'Payé', 'Retard'].map((s) => `<option${s === d.statutPaiement ? ' selected' : ''}>${s}</option>`).join('')}
          </select></td>
        <td>${prof ? `<strong>${esc(prof.nom)}</strong>` : '<small>Non assigné</small>'}</td>
        <td><div class="ep-actions-cell">
          <button type="button" class="ep-btn ep-btn-orange ep-btn-sm" data-match="${d.id}">${state.matchOpen === d.id ? 'Fermer' : (prof ? 'Réassigner' : 'Assigner Prof')}</button>
          <a class="ep-btn ep-btn-wa ep-btn-sm" href="https://wa.me/${waNumber(d.whatsapp)}?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener">Contacter WhatsApp</a>
        </div></td>
      </tr>
      ${state.matchOpen === d.id ? `<tr><td colspan="9">${matchPanel(d)}</td></tr>` : ''}`;
    }).join('') : '<tr><td colspan="9" class="ep-empty">Aucune demande pour le moment. Les envois du formulaire « Demander un Cours » apparaissent ici automatiquement.</td></tr>';
  }

  /* ------------------------------------------------------------- Planning */
  function renderPlanning() {
    $('pDemande').innerHTML = '<option value="">— Choisir une demande —</option>' + state.demandes
      .map((d) => `<option value="${d.id}">${esc(d.eleveNom)} · ${esc(d.classe)} · ${esc(list(d.matieres))}</option>`).join('');
    $('pProf').innerHTML = '<option value="">Prof assigné à la demande</option>' + state.profs
      .filter((p) => p.statut === 'Certifié' || p.statut === 'Actif')
      .map((p) => `<option value="${p.id}">${esc(p.nom)}</option>`).join('');

    $('tPlanning').innerHTML = state.seances.length ? state.seances.map((s) => `
      <tr>
        <td><strong>${dateFr(s.date)}</strong></td>
        <td>${esc(s.heure || '—')}</td>
        <td>${esc(s.profNom || 'Non assigné')}</td>
        <td>${esc(s.eleve)}</td>
        <td>${esc(s.matiere)}</td>
        <td>${esc(s.mode)}</td>
        <td>${badge(s.statut)}
          <select class="ep-mini-select" data-seance="${s.id}" aria-label="Statut de la séance" style="margin-left:6px;">
            ${['Planifié', 'Effectué', 'Reporté', 'Annulé'].map((x) => `<option${x === s.statut ? ' selected' : ''}>${x}</option>`).join('')}
          </select></td>
      </tr>`).join('') : '<tr><td colspan="7" class="ep-empty">Aucune séance planifiée. Assigne un professeur à une demande ou ajoute une séance ci-dessus.</td></tr>';
  }

  function renderAll() {
    renderKpis();
    renderProfs();
    renderDemandes();
    renderPlanning();
  }

  /* -------------------------------------------------------------- Actions */
  async function run(fn, okMsg) {
    try {
      await fn();
      if (okMsg) toast(okMsg);
    } catch (e) {
      if (e.message !== 'unauthorized') toast(`⚠️ ${e.message}`);
    }
  }

  async function assign(demandeId, profId) {
    const date = document.querySelector(`[data-first-date="${demandeId}"]`);
    const heure = document.querySelector(`[data-first-heure="${demandeId}"]`);
    const res = await api(`/demandes/${demandeId}/assigner`, {
      method: 'POST',
      body: JSON.stringify({ profId, date: date ? date.value : '', heure: heure ? heure.value : '' })
    });
    state.matchOpen = null;
    await loadAll();
    return res;
  }

  function bind() {
    $('gLoginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      $('gLoginError').hidden = true;
      login($('gCode').value.trim()).catch((err) => {
        if (err.message === 'unauthorized') return;
        sessionStorage.removeItem(KEY);
        $('gLoginError').textContent = `Connexion impossible (${err.message}). Réessaie dans un instant.`;
        $('gLoginError').hidden = false;
      });
    });
    $('gLogout').addEventListener('click', () => logout());
    $('gRefresh').addEventListener('click', () => run(loadAll, 'Données actualisées'));

    document.querySelectorAll('.ep-tab').forEach((tab) => tab.addEventListener('click', () => {
      document.querySelectorAll('.ep-tab').forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      document.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
    }));

    ['gSearchProfs', 'gFilterProfs'].forEach((id) => $(id).addEventListener('input', renderProfs));
    ['gSearchDemandes', 'gFilterDemandes'].forEach((id) => $(id).addEventListener('input', renderDemandes));

    document.addEventListener('click', (e) => {
      const st = e.target.closest('[data-prof-statut]');
      if (st) {
        run(async () => {
          await api(`/profs/${st.dataset.id}`, { method: 'PATCH', body: JSON.stringify({ statut: st.dataset.profStatut }) });
          await loadAll();
        }, `Professeur : ${st.dataset.profStatut}`);
        return;
      }

      const m = e.target.closest('[data-match]');
      if (m) {
        const id = Number(m.dataset.match);
        state.matchOpen = state.matchOpen === id ? null : id;
        renderDemandes();
        if (state.matchOpen) {
          run(async () => {
            const r = await api(`/demandes/${id}/matching`);
            state.matches[id] = r.matches || [];
            renderDemandes();
          });
        }
        return;
      }

      const a = e.target.closest('[data-assign]');
      if (a) {
        run(() => assign(Number(a.dataset.assign), Number(a.dataset.prof)), 'Professeur assigné');
        return;
      }

      const am = e.target.closest('[data-assign-manual]');
      if (am) {
        const sel = document.querySelector(`[data-manual-prof="${am.dataset.assignManual}"]`);
        if (sel && sel.value) run(() => assign(Number(am.dataset.assignManual), Number(sel.value)), 'Professeur assigné');
      }
    });

    document.addEventListener('change', (e) => {
      const p = e.target.closest('[data-paiement]');
      if (p) {
        run(async () => {
          await api(`/demandes/${p.dataset.paiement}`, { method: 'PATCH', body: JSON.stringify({ statutPaiement: p.value }) });
          await loadAll();
        }, `Paiement : ${p.value}`);
        return;
      }
      const s = e.target.closest('[data-seance]');
      if (s) {
        run(async () => {
          await api(`/planning/${s.dataset.seance}`, { method: 'PATCH', body: JSON.stringify({ statut: s.value }) });
          await loadAll();
        }, `Séance : ${s.value}`);
      }
    });

    $('pDemande').addEventListener('change', () => {
      const d = state.demandes.find((x) => String(x.id) === $('pDemande').value);
      if (d && !$('pMatiere').value) $('pMatiere').value = (d.matieres || [])[0] || '';
    });

    $('gPlanningForm').addEventListener('submit', (e) => {
      e.preventDefault();
      run(async () => {
        await api('/planning', {
          method: 'POST',
          body: JSON.stringify({
            demandeId: Number($('pDemande').value) || null,
            date: $('pDate').value,
            heure: $('pHeure').value,
            profId: Number($('pProf').value) || null,
            matiere: $('pMatiere').value,
            mode: $('pMode').value
          })
        });
        $('pMatiere').value = '';
        await loadAll();
      }, 'Séance ajoutée au planning');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bind();
    if (sessionStorage.getItem(KEY)) login(sessionStorage.getItem(KEY)).catch(() => {});
  });
})();

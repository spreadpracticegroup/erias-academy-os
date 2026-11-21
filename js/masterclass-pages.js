/**
 * MASTERCLASS PRO — catalogue filtrable & formulaire d'inscription
 * Dépend de js/masterclass-catalogue.js (window.ERIAS_MASTERCLASS)
 */
(function () {
  const MC = window.ERIAS_MASTERCLASS;
  if (!MC) return;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /* ------------------------------------------------------------ CATALOGUE */
  function initCatalogue() {
    const results = document.getElementById('mcResults');
    if (!results) return;
    const search = document.getElementById('mcSearch');
    const famille = document.getElementById('mcFamille');
    const mode = document.getElementById('mcMode');
    const chips = document.getElementById('mcChips');
    const count = document.getElementById('mcCount');

    MC.familles.forEach((f) => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${f.icon} ${f.nom}`;
      famille.appendChild(opt);
    });

    chips.innerHTML = [{ id: 'all', nom: 'Toutes', icon: '✦' }].concat(MC.familles)
      .map((f) => `<button type="button" class="ep-chip" data-famille="${esc(f.id)}">${esc(f.icon)} ${esc(f.nom)}</button>`).join('');

    const params = new URLSearchParams(window.location.search);
    if (params.get('famille') && MC.getFamille(params.get('famille'))) famille.value = params.get('famille');
    if (['Présentiel', 'En ligne', 'Hybride'].includes(params.get('mode'))) mode.value = params.get('mode');
    if (params.get('q')) search.value = params.get('q');

    const card = (m) => {
      const f = MC.getFamille(m.famille);
      const low = m.places <= 6;
      return `
        <article class="ep-card ep-mc-card">
          <div class="ep-mc-top">
            <span class="ep-badge ${m.famille === 'phares' ? 'ep-badge-icn' : 'ep-badge-metiers'}">${esc(f ? f.nom : '')}</span>
            <span class="ep-places${low ? ' low' : ''}">● ${esc(m.places)} places restantes</span>
          </div>
          <h3>${esc(m.titre)}</h3>
          <p>${esc(m.description)}</p>
          <dl class="ep-mc-meta">
            <div><dt>Durée</dt><dd>${esc(m.duree)}</dd></div>
            <div><dt>Niveau</dt><dd>${esc(m.niveau)}</dd></div>
            <div><dt>Mode</dt><dd>${esc(m.mode)}</dd></div>
            <div><dt>Dates</dt><dd>${esc(m.date)}</dd></div>
          </dl>
          <div class="ep-mc-trainer">
            <span aria-hidden="true">🎓</span>
            <div><strong>${esc(m.formateur)}</strong><small>${esc(m.formateurTitre)}</small></div>
          </div>
          <div class="ep-mc-price">
            <div><small>Prix participant</small><strong>${esc(MC.formatFcfa(m.prix))}</strong></div>
            <a class="ep-btn ep-btn-green ep-btn-sm" href="/masterclass/inscription?mc=${encodeURIComponent(m.id)}">S'inscrire →</a>
          </div>
        </article>`;
    };

    function render() {
      const q = norm(search.value.trim());
      const fam = famille.value;
      const md = mode.value;
      const list = MC.masterclasses.filter((m) =>
        (fam === 'all' || m.famille === fam) &&
        (md === 'all' || m.mode === md) &&
        (!q || norm([m.titre, m.description, m.formateur, m.niveau, (MC.getFamille(m.famille) || {}).nom, (MC.getFamille(m.famille) || {}).sousTitre, m.pole].join(' ')).includes(q)));

      chips.querySelectorAll('.ep-chip').forEach((c) => c.classList.toggle('active', c.dataset.famille === fam));
      count.textContent = `${list.length} masterclass trouvée${list.length > 1 ? 's' : ''}`;

      if (!list.length) {
        results.innerHTML = '<div class="ep-grid-3"><div class="ep-empty">Aucune masterclass ne correspond à ta recherche. Essaie un autre mot-clé ou un autre mode.</div></div>';
        return;
      }

      results.innerHTML = MC.familles
        .map((f) => {
          const items = list.filter((m) => m.famille === f.id);
          if (!items.length) return '';
          return `<h2 class="ep-family-title">${esc(f.icon)} ${esc(f.nom)}${f.sousTitre ? ` <small style="font-size:.8rem;color:var(--text-muted);font-weight:500;">${esc(f.sousTitre)}</small>` : ''}</h2>
            <div class="ep-grid-3">${items.map(card).join('')}</div>`;
        })
        .join('');
    }

    chips.addEventListener('click', (e) => {
      const btn = e.target.closest('.ep-chip');
      if (!btn) return;
      famille.value = btn.dataset.famille;
      render();
    });
    [search, famille, mode].forEach((el) => el.addEventListener('input', render));
    render();
  }

  /* ---------------------------------------------------------- INSCRIPTION */
  function initInscription() {
    const form = document.getElementById('formInscriptionMasterclass');
    if (!form) return;
    const thematique = form.querySelector('#mcThematique');
    const select = form.querySelector('#mcMasterclass');
    const idField = form.querySelector('input[name="masterclass_id"]');
    const montantField = form.querySelector('input[name="montant_fcfa"]');
    const recap = document.getElementById('mcRecap');
    const splitNote = document.getElementById('mcSplitNote');

    MC.familles.forEach((f) => {
      const opt = document.createElement('option');
      opt.value = f.nom;
      opt.dataset.famille = f.id;
      opt.textContent = `${f.icon} ${f.nom}`;
      thematique.appendChild(opt);
    });

    const fillMasterclasses = (familleId, selectedId) => {
      select.innerHTML = '';
      const ph = document.createElement('option');
      ph.value = '';
      ph.textContent = familleId ? '— Sélectionne une masterclass —' : "— Choisis d'abord une thématique —";
      select.appendChild(ph);
      MC.masterclasses.filter((m) => m.famille === familleId).forEach((m) => {
        const opt = document.createElement('option');
        opt.value = m.titre;
        opt.dataset.id = m.id;
        opt.textContent = `${m.titre} — ${m.duree} · ${MC.formatFcfa(m.prix)}`;
        if (m.id === selectedId) opt.selected = true;
        select.appendChild(opt);
      });
      select.disabled = !familleId;
      update();
    };

    function update() {
      const opt = select.selectedOptions[0];
      const m = opt && opt.dataset.id ? MC.getMasterclass(opt.dataset.id) : null;
      idField.value = m ? m.id : '';
      montantField.value = m ? String(m.prix) : '';
      recap.hidden = !m;
      if (m) {
        document.getElementById('mcRecapTitre').textContent = `${m.titre} · ${m.date} · ${m.mode}`;
        document.getElementById('mcRecapPrix').textContent = MC.formatFcfa(m.prix);
        // Mode proposé par défaut = mode de la masterclass
        const radio = form.querySelector(`input[name="mode"][value="${m.mode}"]`);
        if (radio && !form.querySelector('input[name="mode"]:checked')) radio.checked = true;
      }
      const facilite = form.querySelector('input[name="facilite_paiement"]:checked');
      if (m && facilite && facilite.value === 'Oui') {
        const half = Math.ceil(m.prix / 2);
        splitNote.textContent = `Tu paieras ${MC.formatFcfa(half)} maintenant + ${MC.formatFcfa(m.prix - half)} dans 15 jours.`;
        splitNote.hidden = false;
      } else {
        splitNote.hidden = true;
      }
    }

    thematique.addEventListener('change', () => {
      const opt = thematique.selectedOptions[0];
      fillMasterclasses(opt && opt.dataset.famille, null);
    });
    select.addEventListener('change', update);
    form.addEventListener('change', (e) => { if (e.target.name === 'facilite_paiement') update(); });

    // Pré-sélection depuis le catalogue : /masterclass/inscription?mc=MCP-DEV-01
    const preId = new URLSearchParams(window.location.search).get('mc');
    const pre = preId && MC.getMasterclass(preId);
    if (pre) {
      const f = MC.getFamille(pre.famille);
      thematique.value = f.nom;
      fillMasterclasses(f.id, pre.id);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCatalogue();
    initInscription();
  });
})();

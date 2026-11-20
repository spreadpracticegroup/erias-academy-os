/**
 * BACK-OFFICE ADMINISTRATION PCE ICN & PCE IC-ACADÉMIE DES MÉTIERS
 * Gestion des candidatures, filières, validation d'éligibilité et paramètres financiers
 */

let allDossiers = [];

document.addEventListener('DOMContentLoaded', () => {
  loadDossiers();
  renderBackofficeKPIs();
  renderDossiersTable();
  setupBackofficeFilters();
  setupParametresForm();
});

function loadDossiers() {
  const stored = localStorage.getItem('pce_dossiers_candidats');
  if (stored) {
    try {
      allDossiers = JSON.parse(stored);
    } catch (e) {
      allDossiers = [];
    }
  }

  // Si vide, insérer des dossiers exemples réalistes
  if (!allDossiers || allDossiers.length === 0) {
    allDossiers = [
      {
        numeroDossier: 'PCE-ICN-2026-000142',
        univers: 'cyber',
        filiereNom: 'Cyber-Défense Opérationnelle & SOC',
        filiereCode: 'FIL-C',
        nom: 'Ondo Mba',
        prenom: 'Jean-Christophe',
        whatsapp: '+241 77 45 89 12',
        email: 'jc.ondomba@erias-security.ga',
        ville: 'Libreville',
        pays: 'Gabon',
        partenaireLocal: 'ERIAS SECURITY GABON (Libreville)',
        statut: 'Contrat à signer',
        coutTotal: 2500000,
        dateSoumission: '2026-10-15T10:30:00Z',
        financeurType: 'candidat'
      },
      {
        numeroDossier: 'PCE-IC-2026-000219',
        univers: 'metiers',
        filiereNom: 'Pilotage de Drones Civils (Télépilote)',
        filiereCode: 'MET-DRO-01',
        nom: 'Diallo',
        prenom: 'Awa',
        whatsapp: '+221 77 654 32 10',
        email: 'awa.diallo@gov.sn',
        ville: 'Dakar',
        pays: 'Sénégal',
        partenaireLocal: 'PCE ICN Sénégal (Dakar)',
        statut: 'En vérification',
        coutTotal: 1200000,
        dateSoumission: '2026-10-18T14:20:00Z',
        financeurType: 'entreprise'
      },
      {
        numeroDossier: 'PCE-ICN-2026-000305',
        univers: 'cyber',
        filiereNom: 'Gouvernance, Risques & Conformité GRC',
        filiereCode: 'FIL-G',
        nom: 'Kouassi',
        prenom: 'Koffi Marc',
        whatsapp: '+225 07 88 99 00',
        email: 'marc.kouassi@fintech-ci.com',
        ville: 'Abidjan',
        pays: "Côte d'Ivoire",
        partenaireLocal: "PCE ICN Côte d'Ivoire (Abidjan)",
        statut: 'Inscrit',
        coutTotal: 2400000,
        dateSoumission: '2026-10-20T09:15:00Z',
        financeurType: 'candidat'
      },
      {
        numeroDossier: 'PCE-IC-2026-000412',
        univers: 'metiers',
        filiereNom: 'Installation & Câblage Photovoltaïque (VAE)',
        filiereCode: 'MET-SOL-01',
        nom: 'Mugisha',
        prenom: 'Aimé Eric',
        whatsapp: '+250 788 123 456',
        email: 'eric.mugisha@spreadpractice.rw',
        ville: 'Kigali',
        pays: 'Rwanda',
        partenaireLocal: 'Spread Practice Technology Ltd',
        statut: 'Éligibilité validée',
        coutTotal: 1350000,
        dateSoumission: '2026-10-22T16:00:00Z',
        financeurType: 'candidat'
      }
    ];
    localStorage.setItem('pce_dossiers_candidats', JSON.stringify(allDossiers));
  }
}

function renderBackofficeKPIs() {
  const total = allDossiers.length;
  const cyberCount = allDossiers.filter(d => d.univers === 'cyber').length;
  const metiersCount = allDossiers.filter(d => d.univers === 'metiers').length;
  const inscritsCount = allDossiers.filter(d => d.statut === 'Inscrit' || d.statut === 'Contrat légalisé').length;

  setElText('boKpiTotal', total);
  setElText('boKpiCyber', `${cyberCount} dossiers`);
  setElText('boKpiMetiers', `${metiersCount} dossiers`);
  setElText('boKpiInscrits', `${inscritsCount} confirmés`);

  // Montant total inscriptions encaissées (80 000 FCFA x total)
  const totalFrais = allDossiers.length * 80000;
  setElText('boKpiEncaisse', formatFCFA(totalFrais));
}

function renderDossiersTable() {
  const tbody = document.getElementById('boTableBody');
  if (!tbody) return;

  const filterUnivers = document.getElementById('boFilterUnivers')?.value || 'all';
  const filterStatut = document.getElementById('boFilterStatut')?.value || 'all';
  const searchQ = (document.getElementById('boSearchInput')?.value || '').toLowerCase().trim();

  const filtered = allDossiers.filter(d => {
    if (filterUnivers !== 'all' && d.univers !== filterUnivers) return false;
    if (filterStatut !== 'all' && d.statut !== filterStatut) return false;
    if (searchQ) {
      const txt = `${d.numeroDossier} ${d.nom} ${d.prenom} ${d.email} ${d.whatsapp} ${d.ville} ${d.filiereNom}`.toLowerCase();
      if (!txt.includes(searchQ)) return false;
    }
    return true;
  });

  tbody.innerHTML = filtered.map(d => `
    <tr>
      <td>
        <div style="font-weight: 700; color: white;">${d.prenom} ${d.nom.toUpperCase()}</div>
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary-light);">${d.numeroDossier}</div>
      </td>
      <td>
        <span class="badge ${d.univers === 'cyber' ? 'badge-primary' : 'badge-era'}">
          ${d.univers === 'cyber' ? 'Cybersécurité' : 'Métiers & VAE'}
        </span>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 3px;">${d.filiereNom}</div>
      </td>
      <td>
        <div style="font-size: 0.85rem;">${d.whatsapp}</div>
        <div style="font-size: 0.78rem; color: var(--text-muted);">${d.email}</div>
      </td>
      <td>
        <div style="font-size: 0.85rem;">${d.ville} (${d.pays})</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${d.partenaireLocal || '-'}</div>
      </td>
      <td>
        <span class="badge badge-silver">${d.financeurType}</span>
      </td>
      <td>
        <select onchange="updateDossierStatut('${d.numeroDossier}', this.value)" style="background: rgba(4, 9, 20, 0.9); border: 1px solid var(--border-color); color: white; border-radius: 6px; padding: 4px 8px; font-size: 0.8rem; cursor: pointer;">
          <option value="Soumis" ${d.statut === 'Soumis' ? 'selected' : ''}>Soumis</option>
          <option value="En vérification" ${d.statut === 'En vérification' ? 'selected' : ''}>En vérification</option>
          <option value="Éligibilité validée" ${d.statut === 'Éligibilité validée' ? 'selected' : ''}>Éligibilité validée</option>
          <option value="Contrat à signer" ${d.statut === 'Contrat à signer' ? 'selected' : ''}>Contrat à signer</option>
          <option value="Contrat légalisé" ${d.statut === 'Contrat légalisé' ? 'selected' : ''}>Contrat légalisé</option>
          <option value="Inscrit" ${d.statut === 'Inscrit' ? 'selected' : ''}>Inscrit (Validé)</option>
          <option value="Refusé" ${d.statut === 'Refusé' ? 'selected' : ''}>Refusé</option>
        </select>
      </td>
      <td>
        <div style="display: flex; gap: 0.35rem;">
          <a href="espace-candidat.html?dossier=${d.numeroDossier}" class="btn btn-outline btn-sm" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" title="Voir la fiche">
            👁️
          </a>
          <button class="btn btn-outline btn-sm" onclick="supprimerDossier('${d.numeroDossier}')" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; color: #f87171;" title="Supprimer">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  setElText('boTableCount', `${filtered.length} demande(s) affichée(s)`);
}

function updateDossierStatut(num, newStatut) {
  const d = allDossiers.find(x => x.numeroDossier === num);
  if (d) {
    d.statut = newStatut;
    localStorage.setItem('pce_dossiers_candidats', JSON.stringify(allDossiers));
    renderBackofficeKPIs();
    alert(`Statut du dossier ${num} mis à jour : ${newStatut}`);
  }
}

function supprimerDossier(num) {
  if (confirm(`Voulez-vous vraiment supprimer le dossier ${num} ?`)) {
    allDossiers = allDossiers.filter(x => x.numeroDossier !== num);
    localStorage.setItem('pce_dossiers_candidats', JSON.stringify(allDossiers));
    renderBackofficeKPIs();
    renderDossiersTable();
  }
}

function setupBackofficeFilters() {
  document.getElementById('boFilterUnivers')?.addEventListener('change', renderDossiersTable);
  document.getElementById('boFilterStatut')?.addEventListener('change', renderDossiersTable);
  document.getElementById('boSearchInput')?.addEventListener('input', renderDossiersTable);

  document.getElementById('btnExportCsv')?.addEventListener('click', () => {
    if (allDossiers.length === 0) {
      alert('Aucun dossier à exporter.');
      return;
    }
    const headers = ['Numero', 'Univers', 'Filiere', 'Nom', 'Prenom', 'WhatsApp', 'Email', 'Ville', 'Pays', 'Statut', 'Financeur'];
    const rows = allDossiers.map(d => [
      d.numeroDossier, d.univers, `"${d.filiereNom}"`, `"${d.nom}"`, `"${d.prenom}"`,
      `"${d.whatsapp}"`, `"${d.email}"`, `"${d.ville}"`, `"${d.pays}"`, `"${d.statut}"`, d.financeurType
    ]);

    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PCE_DOSSIERS_EXPORT_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  });
}

function setupParametresForm() {
  const form = document.getElementById('boParametresForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const frais = Number(document.getElementById('paramFraisInscription')?.value || 80000);
    const remuneration = Number(document.getElementById('paramRemunerationMission')?.value || 25000);

    window.referentiel.data.facilitePaiementDefaults.fraisInscriptionGlobaux = frais;
    window.referentiel.data.facilitePaiementDefaults.remunerationParParticipantSensibilise = remuneration;

    alert('Paramètres financiers officiels enregistrés avec succès !');
  });
}

function formatFCFA(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

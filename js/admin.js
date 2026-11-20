/**
 * ERIAS ACADEMY OS - Admin Dashboard Logic
 */

let currentFilterProfile = 'all';
let currentFilterStatus = 'all';
let currentSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Écouteurs de mise à jour du Store
  window.addEventListener('erias_data_updated', renderDashboard);

  // Recherche & Filtres
  const searchInput = document.getElementById('adminSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderStudentsTable();
    });
  }

  const profileFilter = document.getElementById('filterProfile');
  if (profileFilter) {
    profileFilter.addEventListener('change', (e) => {
      currentFilterProfile = e.target.value;
      renderStudentsTable();
    });
  }

  const statusFilter = document.getElementById('filterStatus');
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentFilterStatus = e.target.value;
      renderStudentsTable();
    });
  }

  // Bouton Export CSV
  const exportBtn = document.getElementById('exportCsvBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', handleExportCSV);
  }

  // Bouton Réinitialiser Démo
  const resetBtn = document.getElementById('resetDemoBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', handleResetDemo);
  }

  // Bouton Modal Ajouter Apprenant
  const openAddModalBtn = document.getElementById('openAddStudentModal');
  const addStudentModal = document.getElementById('addStudentModal');
  const closeAddStudentBtn = document.getElementById('closeAddStudentBtn');

  if (openAddModalBtn && addStudentModal) {
    openAddModalBtn.addEventListener('click', () => {
      addStudentModal.classList.add('active');
    });
  }
  if (closeAddStudentBtn && addStudentModal) {
    closeAddStudentBtn.addEventListener('click', () => {
      addStudentModal.classList.remove('active');
    });
  }

  // Formulaire d'ajout rapide
  const quickAddForm = document.getElementById('quickAddForm');
  if (quickAddForm) {
    quickAddForm.addEventListener('submit', handleQuickAddSubmit);
  }

  // Modal Détails Apprenant
  const studentDetailModal = document.getElementById('studentDetailModal');
  const closeDetailBtn = document.getElementById('closeDetailBtn');
  if (closeDetailBtn && studentDetailModal) {
    closeDetailBtn.addEventListener('click', () => {
      studentDetailModal.classList.remove('active');
    });
  }

  // Premier rendu
  renderDashboard();
});

function formatFCFA(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

function renderDashboard() {
  if (!window.eriasStore) return;
  const stats = window.eriasStore.getStats();

  // 1. Mise à jour des KPIs
  const kpiTotalInscrits = document.getElementById('kpiTotalInscrits');
  const kpiTauxRemplissage = document.getElementById('kpiTauxRemplissage');
  const kpiTotalEncaisse = document.getElementById('kpiTotalEncaisse');
  const kpiInscriptionsPayees = document.getElementById('kpiInscriptionsPayees');
  const kpiTotalPotentiel = document.getElementById('kpiTotalPotentiel');
  const kpiPlacesRestantes = document.getElementById('kpiPlacesRestantes');

  if (kpiTotalInscrits) kpiTotalInscrits.textContent = stats.totalCount;
  if (kpiTauxRemplissage) kpiTauxRemplissage.textContent = `${stats.occupancyRate}% (sur 700 places)`;
  if (kpiTotalEncaisse) kpiTotalEncaisse.textContent = formatFCFA(stats.totalCollected);
  if (kpiInscriptionsPayees) kpiInscriptionsPayees.textContent = `${stats.paidCount} payées · ${stats.pendingCount} en attente`;
  if (kpiTotalPotentiel) kpiTotalPotentiel.textContent = formatFCFA(stats.potentialTotal);
  if (kpiPlacesRestantes) kpiPlacesRestantes.textContent = `${stats.maxCapacity - stats.totalCount} places disponibles`;

  // 2. Barres de répartition des Profils
  const moniteurCount = stats.profileCounts['Moniteur'] || 0;
  const formateurCount = stats.profileCounts['Formateur'] || 0;
  const auditeurCount = stats.profileCounts['Auditeur'] || 0;
  const total = Math.max(1, stats.totalCount);

  const moniteurPct = Math.round((moniteurCount / total) * 100);
  const formateurPct = Math.round((formateurCount / total) * 100);
  const auditeurPct = Math.round((auditeurCount / total) * 100);

  const statMoniteurEl = document.getElementById('statMoniteurText');
  const barMoniteurEl = document.getElementById('barMoniteurFill');
  if (statMoniteurEl) statMoniteurEl.textContent = `${moniteurCount} (${moniteurPct}%)`;
  if (barMoniteurEl) barMoniteurEl.style.width = `${moniteurPct}%`;

  const statFormateurEl = document.getElementById('statFormateurText');
  const barFormateurEl = document.getElementById('barFormateurFill');
  if (statFormateurEl) statFormateurEl.textContent = `${formateurCount} (${formateurPct}%)`;
  if (barFormateurEl) barFormateurEl.style.width = `${formateurPct}%`;

  const statAuditeurEl = document.getElementById('statAuditeurText');
  const barAuditeurEl = document.getElementById('barAuditeurFill');
  if (statAuditeurEl) statAuditeurEl.textContent = `${auditeurCount} (${auditeurPct}%)`;
  if (barAuditeurEl) barAuditeurEl.style.width = `${auditeurPct}%`;

  // 3. Rendu de la grille des 14 Cohortes
  const cohortGrid = document.getElementById('adminCohortGrid');
  if (cohortGrid) {
    cohortGrid.innerHTML = '';
    for (let i = 1; i <= stats.groupsCount; i++) {
      const count = stats.groupCounts[i] || 0;
      const cell = document.createElement('div');
      cell.className = 'cohort-cell';
      cell.innerHTML = `
        <div class="cohort-name">Gr. ${String(i).padStart(2, '0')}</div>
        <div class="cohort-stat">${count}/50</div>
      `;
      cohortGrid.appendChild(cell);
    }
  }

  // 4. Rendu de la table filtrée
  renderStudentsTable();
}

function renderStudentsTable() {
  const students = window.eriasStore.getStudents();
  const tbody = document.getElementById('studentsTableBody');
  const countEl = document.getElementById('filteredCount');
  if (!tbody) return;

  // Filtrage
  const filtered = students.filter(student => {
    // Profil
    if (currentFilterProfile !== 'all' && student.profil !== currentFilterProfile) {
      return false;
    }
    // Statut
    if (currentFilterStatus !== 'all' && student.statutPaiement !== currentFilterStatus) {
      return false;
    }
    // Recherche textuelle
    if (currentSearchQuery) {
      const fullText = `${student.id} ${student.nom} ${student.prenom} ${student.email} ${student.whatsapp} ${student.ville} Groupe ${student.groupe}`.toLowerCase();
      if (!fullText.includes(currentSearchQuery)) {
        return false;
      }
    }
    return true;
  });

  if (countEl) {
    countEl.textContent = `${filtered.length} apprenant(s) affiché(s)`;
  }

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h4>Aucun apprenant ne correspond à vos critères</h4>
          <p>Essayez de réinitialiser la recherche ou les filtres.</p>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(student => {
    const tr = document.createElement('tr');

    // Badge profil
    let badgeClass = 'badge-gold';
    if (student.profil === 'Moniteur') badgeClass = 'badge-cyan';
    if (student.profil === 'Formateur') badgeClass = 'badge-gold';
    if (student.profil === 'Auditeur') badgeClass = 'badge-warning';

    // Badge statut
    const isPaid = student.statutPaiement === 'Payé';
    const statusBadge = isPaid
      ? `<button class="status-badge-btn" onclick="toggleStudentPayment('${student.id}')" title="Cliquer pour basculer en attente"><span class="badge badge-success">✓ Payé (25 000 F)</span></button>`
      : `<button class="status-badge-btn" onclick="toggleStudentPayment('${student.id}')" title="Cliquer pour valider le paiement"><span class="badge badge-danger">⏳ En attente (0 F)</span></button>`;

    tr.innerHTML = `
      <td>
        <div class="student-identity">
          <span class="student-name">${escapeHTML(student.prenom)} ${escapeHTML(student.nom.toUpperCase())}</span>
          <span class="student-id">${student.id}</span>
        </div>
      </td>
      <td>
        <span class="badge ${badgeClass}">${escapeHTML(student.profil)}</span>
      </td>
      <td>
        <div style="font-size: 0.85rem;">
          <div><strong style="color: var(--gold-light);">WA:</strong> ${escapeHTML(student.whatsapp)}</div>
          <div style="color: var(--text-muted); font-size: 0.8rem;">${escapeHTML(student.email)}</div>
        </div>
      </td>
      <td>
        <span style="font-size: 0.88rem; color: var(--text-secondary);">${escapeHTML(student.ville)}</span>
      </td>
      <td>
        <span class="badge badge-gold" style="font-family: 'Space Grotesk', monospace;">Groupe ${String(student.groupe).padStart(2, '0')}</span>
      </td>
      <td>
        ${statusBadge}
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-action-icon" onclick="viewStudentDetails('${student.id}')" title="Voir fiche complète">
            👁️
          </button>
          <button class="btn-action-icon danger" onclick="deleteStudentConfirm('${student.id}')" title="Supprimer">
            🗑️
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Bascule statut paiement (Payé <-> En attente)
window.toggleStudentPayment = function(id) {
  const students = window.eriasStore.getStudents();
  const current = students.find(s => s.id === id);
  if (!current) return;

  const nextStatus = current.statutPaiement === 'Payé' ? 'En attente' : 'Payé';
  window.eriasStore.updatePaymentStatus(id, nextStatus);
};

// Affichage détails
window.viewStudentDetails = function(id) {
  const students = window.eriasStore.getStudents();
  const s = students.find(item => item.id === id);
  if (!s) return;

  const modal = document.getElementById('studentDetailModal');
  const content = document.getElementById('studentDetailContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="ticket-wrapper">
      <div class="ticket-header">
        <span class="badge badge-gold">DOSSIER CERTIFIÉ PCE ICN</span>
        <div class="ticket-number">${s.id}</div>
        <h3 style="color: var(--text-white);">${escapeHTML(s.prenom)} ${escapeHTML(s.nom.toUpperCase())}</h3>
      </div>
      <div class="ticket-grid">
        <div class="ticket-item">
          <div class="ticket-label">Profil de formation</div>
          <div class="ticket-val" style="color: var(--gold-light);">${escapeHTML(s.profil)}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-label">Attribution Pédagogique</div>
          <div class="ticket-val">Groupe ${String(s.groupe).padStart(2, '0')} (Max 50)</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-label">WhatsApp</div>
          <div class="ticket-val">${escapeHTML(s.whatsapp)}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-label">Email</div>
          <div class="ticket-val" style="word-break: break-all;">${escapeHTML(s.email)}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-label">Territoire / Ville</div>
          <div class="ticket-val">${escapeHTML(s.ville)}</div>
        </div>
        <div class="ticket-item">
          <div class="ticket-label">Statut Financier</div>
          <div class="ticket-val" style="color: ${s.statutPaiement === 'Payé' ? '#34d399' : '#fbbf24'};">${s.statutPaiement} (${formatFCFA(s.montantPaye || 0)})</div>
        </div>
      </div>
      <div class="ticket-footer-note">
        <strong>Opérateur :</strong> ERIAS SECURITY GABON & PCE ICN Central<br>
        <strong>Cycle :</strong> 7 mois (15 Oct 2026 au 15 Mai 2027) · Inscription : 25 000 FCFA + 37 000 FCFA x 7 mois.
      </div>
    </div>
  `;

  modal.classList.add('active');
};

// Suppression
window.deleteStudentConfirm = function(id) {
  if (confirm(`Confirmez-vous la suppression de l'inscription ${id} ?`)) {
    window.eriasStore.deleteStudent(id);
  }
};

// Export CSV
function handleExportCSV() {
  const csvContent = window.eriasStore.exportCSV();
  if (!csvContent) {
    alert('Aucun apprenant à exporter.');
    return;
  }
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ERIAS_ACADEMY_INSCRITS_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Réinitialisation démo
function handleResetDemo() {
  if (confirm('Voulez-vous réinitialiser le tableau de bord avec les données de démonstration officielles ?')) {
    window.eriasStore.resetToDemo();
  }
}

// Ajout rapide depuis le modal admin
function handleQuickAddSubmit(e) {
  e.preventDefault();
  const nom = document.getElementById('addNom')?.value.trim();
  const prenom = document.getElementById('addPrenom')?.value.trim();
  const whatsapp = document.getElementById('addWhatsapp')?.value.trim();
  const email = document.getElementById('addEmail')?.value.trim();
  const profil = document.getElementById('addProfil')?.value;
  const ville = document.getElementById('addVille')?.value.trim();
  const statutPaiement = document.getElementById('addStatut')?.value || 'Payé';

  if (!nom || !prenom || !whatsapp || !email || !ville) {
    alert('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  window.eriasStore.addStudent({
    nom,
    prenom,
    whatsapp,
    email,
    profil,
    ville,
    statutPaiement,
    notes: 'Ajout manuel depuis le Dashboard Admin'
  });

  e.target.reset();
  const modal = document.getElementById('addStudentModal');
  if (modal) modal.classList.remove('active');
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

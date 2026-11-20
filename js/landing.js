/**
 * ERIAS ACADEMY OS - Landing Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mise à jour des jauges et compteurs en direct depuis le Store
  updateLiveMetrics();
  window.addEventListener('erias_data_updated', updateLiveMetrics);

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});

function updateLiveMetrics() {
  if (!window.eriasStore) return;
  const stats = window.eriasStore.getStats();

  // Places restantes
  const seatsRemaining = stats.maxCapacity - stats.totalCount;
  const seatsLeftEl = document.getElementById('seatsRemainingBadge');
  if (seatsLeftEl) {
    seatsLeftEl.textContent = `${seatsRemaining} places restantes sur 700`;
  }

  // Barre de progression globale
  const progressFill = document.getElementById('globalProgressFill');
  const progressText = document.getElementById('globalProgressText');
  if (progressFill) {
    const percent = Math.min(100, Math.max(1, (stats.totalCount / stats.maxCapacity) * 100));
    progressFill.style.width = `${percent}%`;
  }
  if (progressText) {
    progressText.textContent = `${stats.totalCount} / ${stats.maxCapacity} inscrits (${stats.occupancyRate}%)`;
  }

  // Rendu de la grille des 14 groupes
  const groupsMiniGrid = document.getElementById('groupsMiniGrid');
  if (groupsMiniGrid) {
    groupsMiniGrid.innerHTML = '';
    for (let i = 1; i <= stats.groupsCount; i++) {
      const count = stats.groupCounts[i] || 0;
      const box = document.createElement('div');
      box.className = 'group-badge-box';
      box.innerHTML = `
        <div class="group-num">Groupe ${String(i).padStart(2, '0')}</div>
        <div class="group-status">${count}/50 places</div>
      `;
      groupsMiniGrid.appendChild(box);
    }
  }
}

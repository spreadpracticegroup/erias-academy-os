/**
 * APPLICATION PRINCIPALE PCE ICN & PCE IC-ACADEMIE DES METIERS
 * Gestion du basculement d'univers, simulateur interactif et navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initUniverseTheme();
  initSimulateur();
  initPrerequisChecker();
  initMobileMenu();
});

// 1. GESTION DU BASCULEMENT D'UNIVERS (CYBER / METIERS)
function initUniverseTheme() {
  const currentUniverse = localStorage.getItem('pce_active_universe') || 'cyber';
  setUniverse(currentUniverse, false);

  const switchButtons = document.querySelectorAll('.universe-btn');
  switchButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetUniverse = e.currentTarget.getAttribute('data-universe');
      setUniverse(targetUniverse, true);
    });
  });
}

function setUniverse(universe, save = true) {
  const root = document.documentElement;
  root.setAttribute('data-theme', universe);

  if (save) {
    localStorage.setItem('pce_active_universe', universe);
  }

  // Mise à jour des boutons d'univers
  document.querySelectorAll('.universe-btn').forEach(btn => {
    if (btn.getAttribute('data-universe') === universe) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Mise à jour dynamique du logo en-tête et des libellés
  const headerLogo = document.getElementById('headerLogoImg');
  const headerBrandTitle = document.getElementById('headerBrandTitle');
  const headerBrandSub = document.getElementById('headerBrandSub');

  if (universe === 'cyber') {
    if (headerLogo) headerLogo.src = 'assets/logo-pce-icn.jpg';
    if (headerBrandTitle) headerBrandTitle.textContent = 'PCE-ICN CENTRAL';
    if (headerBrandSub) headerBrandSub.textContent = 'CYBERSÉCURITÉ & CONFIANCE NUMÉRIQUE';
  } else {
    if (headerLogo) headerLogo.src = 'assets/logo-pce-ic-metiers.jpg';
    if (headerBrandTitle) headerBrandTitle.textContent = 'PCE IC-ACADÉMIE DES MÉTIERS';
    if (headerBrandSub) headerBrandSub.textContent = 'FORMATION PROFESSIONNELLE & VAE';
  }

  // Événement personnalisé
  window.dispatchEvent(new CustomEvent('universe_changed', { detail: { universe } }));
}

// 2. SIMULATEUR INTERACTIF DE FACILITÉ DE PAIEMENT
function initSimulateur() {
  const filiereSelect = document.getElementById('simFiliereSelect');
  const customCoutInput = document.getElementById('simCoutCustom');
  const customPartInput = document.getElementById('simPartCustom');
  const customMensualitesInput = document.getElementById('simMensualitesCustom');

  if (!filiereSelect) return;

  function updateSimulation() {
    const selectedVal = filiereSelect.value;
    let coutTotal = 2500000;
    let partPendantPct = 0.2976;
    let nbMensualites = 12;

    if (selectedVal.startsWith('FIL-')) {
      const filiereId = selectedVal.replace('FIL-', '');
      const f = window.referentiel.getFiliere(filiereId);
      if (f) {
        coutTotal = f.coutTotal || 2500000;
        partPendantPct = f.partFormationPct || 0.2976;
        nbMensualites = f.mensualites || 12;
      }
    } else if (selectedVal.startsWith('MET-')) {
      const metierCode = selectedVal;
      const m = window.referentiel.getMetier(metierCode);
      if (m) {
        coutTotal = m.coutTotal || 1500000;
        partPendantPct = m.partPendant || 0.30;
        nbMensualites = m.dureeMois || 12;
      }
    }

    // Calculs officiels
    const sim = window.referentiel.calculerFacilitePaiement({
      coutTotal,
      partPendantPct,
      nbMensualites
    });

    // Injection dans le DOM
    setElText('simCoutTotal', formatFCFA(sim.coutTotal));
    setElText('simFraisInscription', formatFCFA(sim.fraisInscription));
    setElText('simPartPendantPct', `${sim.partPendantFormationPct}%`);
    setElText('simPayePendant', formatFCFA(sim.payePendantFormation));
    setElText('simNbMensualites', `${sim.nbMensualites} mois`);
    setElText('simMensualite', formatFCFA(sim.mensualite) + ' / mois');
    setElText('simSoldeRestant', formatFCFA(sim.soldeRestant));
    setElText('simPartSoldePct', `${sim.partSoldePct}%`);
    setElText('simNbParticipants', `≈ ${sim.nbParticipantsEstimatif} participants`);
    setElText('simGainStagiaireImmediat', formatFCFA(sim.gainImmediatStagiaireParParticipant) + ' / participant');
    setElText('simGainApresThese', formatFCFA(sim.gainApresTheseParParticipant) + ' / participant (doublement)');

    // Jauge visuelle
    const barPendant = document.getElementById('simBarPendant');
    const barSolde = document.getElementById('simBarSolde');
    if (barPendant) barPendant.style.width = `${sim.partPendantFormationPct}%`;
    if (barSolde) barSolde.style.width = `${sim.partSoldePct}%`;
  }

  filiereSelect.addEventListener('change', updateSimulation);
  updateSimulation();
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatFCFA(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

// 3. VÉRIFICATEUR DU PRÉREQUIS SOCLE PCEICN-0001
function initPrerequisChecker() {
  const checkBtn = document.getElementById('btnVerifierPrerequis');
  const codeInput = document.getElementById('inputCertificatPce000');
  const resultBox = document.getElementById('resultPrerequisBox');

  if (!checkBtn || !codeInput || !resultBox) return;

  checkBtn.addEventListener('click', () => {
    const val = codeInput.value.trim().toUpperCase();
    if (!val) {
      alert('Veuillez saisir votre numéro d\'attestation ou certificat PCEICN-0001.');
      return;
    }

    // Exemple de validation démo ou stockage local
    const isValid = val.startsWith('PCEICN-0001') || val.startsWith('PCE-000') || val.startsWith('CERT-') || val.length >= 8;

    if (isValid) {
      resultBox.innerHTML = `
        <div style="background: rgba(0, 168, 107, 0.15); border: 1.5px solid var(--primary); padding: 1.25rem; border-radius: var(--radius-md);">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #10b981; font-weight: 700; margin-bottom: 0.35rem;">
            <span>✓</span> SOCLE PCEICN-0001 VALIDÉ AVEC SUCCÈS
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">
            Certificat reconnu : <strong>${val}</strong>. Vos accès aux filières d'excellence (Cyber-Défense, GRC, Forensic, Pentest) sont débloqués.
          </p>
          <a href="candidature.html?univers=cyber&prerequis=${val}" class="btn btn-primary btn-sm" style="margin-top: 0.85rem;">
            Poursuivre mon inscription aux filières →
          </a>
        </div>
      `;
    } else {
      resultBox.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.15); border: 1.5px solid #ef4444; padding: 1.25rem; border-radius: var(--radius-md);">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #f87171; font-weight: 700; margin-bottom: 0.35rem;">
            <span>⚠️</span> CERTIFICAT NON RECONNU
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
            Sans le socle obligatoire PCEICN-0001 validé, aucune autre formation de cybersécurité ne peut être débutée.
          </p>
          <a href="candidature.html?type=pceicn-0001" class="btn btn-primary btn-sm">
            S'inscrire d'abord au Module Basique PCEICN-0001 (25 000 FCFA) →
          </a>
        </div>
      `;
    }
  });
}

// 4. MENU MOBILE
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mainNavMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }
}

/**
 * FORMULAIRE MULTI-ÉTAPES PCE ICN & PCE IC-ACADÉMIE DES MÉTIERS
 * Gestion des 9 étapes, sauvegarde brouillon et génération du contrat
 */

let currentStep = 1;
const TOTAL_STEPS = 9;

const formData = {
  univers: 'cyber', // 'cyber' ou 'metiers'
  typeDemande: 'formation', // 'formation', 'pceicn-0001', 'vae', 'masterclass', 'formateur'
  parcoursMetier: 'formation_pro', // 'formation_pro' ou 'vae'
  filiereCode: 'FIL-C',
  filiereNom: 'Cyber-Défense Opérationnelle & SOC',
  coutTotal: 2500000,
  hasPrerequisPce000: false,
  numeroPce000: '',
  anneesExperienceVae: 0,
  
  // Identité
  nom: '',
  prenom: '',
  dateNaissance: '',
  lieuNaissance: '',
  sexe: 'M',
  nationalite: 'Gabonaise',
  typePiece: 'CNI',
  numPiece: '',
  whatsapp: '',
  email: '',
  adresse: '',
  quartier: '',
  ville: 'Libreville',
  pays: 'Gabon',

  // Garants / Parents (Contrat à cinq)
  pereNom: '',
  pereTel: '',
  pereProfession: '',
  mereNom: '',
  mereTel: '',
  mereProfession: '',
  chefQuartierNom: '',
  chefQuartierTel: '',

  // Partenaire Local
  partenaireLocal: 'ERIAS SECURITY GABON (Siège National)',
  entrepriseAlternance: '',

  // Financement
  financeurType: 'candidat', // 'candidat', 'entreprise', 'ong', 'institution', 'mixte'
  sponsorNom: '',
  sponsorRccm: '',
  sponsorContact: '',
  sponsorPriseEnChargePct: 100,

  // Signature
  signatureDate: new Date().toISOString(),
  statut: 'Soumis'
};

document.addEventListener('DOMContentLoaded', () => {
  loadDraft();
  initUrlParams();
  setupEventListeners();
  updateStepView();
  renderFiliereDropdown();
});

function initUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const u = params.get('univers');
  const t = params.get('type');
  const p = params.get('parcours');
  const prereq = params.get('prerequis');

  if (u === 'cyber' || u === 'metiers') {
    formData.univers = u;
    document.documentElement.setAttribute('data-theme', u);
  }
  if (t) formData.typeDemande = t;
  if (p === 'vae') {
    formData.univers = 'metiers';
    formData.parcoursMetier = 'vae';
  }
  if (prereq) {
    formData.hasPrerequisPce000 = true;
    formData.numeroPce000 = prereq;
  }
}

function setupEventListeners() {
  // Navigation wizard
  document.getElementById('btnNextStep')?.addEventListener('click', goNextStep);
  document.getElementById('btnPrevStep')?.addEventListener('click', goPrevStep);

  // Choix Univers radio cards
  document.querySelectorAll('.choice-box-univers').forEach(box => {
    box.addEventListener('click', (e) => {
      document.querySelectorAll('.choice-box-univers').forEach(b => b.classList.remove('selected'));
      box.classList.add('selected');
      const u = box.getAttribute('data-val');
      formData.univers = u;
      document.documentElement.setAttribute('data-theme', u);
      renderFiliereDropdown();
      saveDraft();
    });
  });

  // Sélecteur filière / métier
  document.getElementById('wizardFiliereSelect')?.addEventListener('change', (e) => {
    handleFiliereChange(e.target.value);
  });

  // Switcher Financement (Candidat vs Sponsor)
  document.querySelectorAll('input[name="financeurType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      formData.financeurType = e.target.value;
      const sponsorBox = document.getElementById('sponsorFieldsBox');
      if (sponsorBox) {
        sponsorBox.style.display = (formData.financeurType === 'candidat') ? 'none' : 'block';
      }
      recalculateSimulation();
      saveDraft();
    });
  });

  // Sauvegarde automatique des inputs textes
  document.querySelectorAll('.wizard-input').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const field = e.target.getAttribute('data-field');
      if (field) {
        formData[field] = e.target.value;
        saveDraft();
      }
    });
  });

  // Signature Canvas
  setupSignaturePad();
}

function renderFiliereDropdown() {
  const select = document.getElementById('wizardFiliereSelect');
  if (!select) return;

  select.innerHTML = '';

  if (formData.univers === 'cyber') {
    const optgroup = document.createElement('optgroup');
    optgroup.label = 'Filières Cybersécurité PCE ICN';
    window.referentiel.data.filieresCyber.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.code;
      opt.textContent = `${f.label} : ${f.name} (${formatFCFA(f.coutTotal || 2500000)})`;
      optgroup.appendChild(opt);
    });
    select.appendChild(optgroup);
  } else {
    window.referentiel.data.polesMetiers.forEach(p => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = p.nom;
      p.metiers.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.code;
        opt.textContent = `${m.nom} (${m.dureeMois} mois - ${formatFCFA(m.coutTotal)})`;
        optgroup.appendChild(opt);
      });
      select.appendChild(optgroup);
    });
  }

  // Déclenche calcul initial
  handleFiliereChange(select.value);
}

function handleFiliereChange(code) {
  formData.filiereCode = code;
  let cout = 2500000;
  let partPct = 0.2976;
  let mois = 12;

  if (formData.univers === 'cyber') {
    const f = window.referentiel.getFiliere(code);
    if (f) {
      cout = f.coutTotal || 2500000;
      formData.filiereNom = f.name;
      partPct = f.partFormationPct || 0.2976;
      mois = f.mensualites || 12;
    }
  } else {
    const m = window.referentiel.getMetier(code);
    if (m) {
      cout = m.coutTotal || 1500000;
      formData.filiereNom = m.nom;
      partPct = m.partPendant || 0.30;
      mois = m.dureeMois || 12;
    }
  }

  formData.coutTotal = cout;
  formData.partFormationPct = partPct;
  formData.nbMensualites = mois;

  recalculateSimulation();
  saveDraft();
}

function recalculateSimulation() {
  const sim = window.referentiel.calculerFacilitePaiement({
    coutTotal: formData.coutTotal,
    partPendantPct: formData.partFormationPct,
    nbMensualites: formData.nbMensualites
  });

  setElText('wizSimCout', formatFCFA(sim.coutTotal));
  setElText('wizSimFrais', formatFCFA(sim.fraisInscription));
  setElText('wizSimMensualite', `${formatFCFA(sim.mensualite)} / mois (${sim.nbMensualites} mois)`);
  setElText('wizSimSolde', formatFCFA(sim.soldeRestant));
  setElText('wizSimMissions', `≈ ${sim.nbParticipantsEstimatif} participants à sensibiliser`);

  // Adaptation si prise en charge Sponsor
  if (formData.financeurType !== 'candidat') {
    const pctSponsor = Number(document.getElementById('inputSponsorPct')?.value || 100);
    const partSponsor = Math.round(sim.coutTotal * (pctSponsor / 100));
    const partCandidat = sim.coutTotal - partSponsor;

    setElText('wizSponsorRecap', `Prise en charge Sponsor (${pctSponsor}%) : ${formatFCFA(partSponsor)} · Reste candidat : ${formatFCFA(partCandidat)}`);
  }
}

function goNextStep() {
  if (!validateCurrentStep(currentStep)) return;

  if (currentStep < TOTAL_STEPS) {
    currentStep++;
    updateStepView();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  } else {
    finalizeSubmission();
  }
}

function goPrevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepView();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
}

function updateStepView() {
  // Masque tous les panneaux
  document.querySelectorAll('.wizard-step-panel').forEach(p => p.classList.remove('active'));
  
  // Affiche panneau courant
  const activePanel = document.getElementById(`stepPanel${currentStep}`);
  if (activePanel) activePanel.classList.add('active');

  // Met à jour les cercles de la barre de progression
  document.querySelectorAll('.wizard-step-indicator').forEach(ind => {
    const s = Number(ind.getAttribute('data-step'));
    ind.classList.remove('active', 'completed');
    if (s === currentStep) ind.classList.add('active');
    else if (s < currentStep) ind.classList.add('completed');
  });

  // Boutons Suivant / Précédent
  const btnPrev = document.getElementById('btnPrevStep');
  const btnNext = document.getElementById('btnNextStep');

  if (btnPrev) btnPrev.style.display = currentStep === 1 ? 'none' : 'inline-flex';
  if (btnNext) {
    if (currentStep === TOTAL_STEPS) {
      btnNext.textContent = 'Confirmer & Transmettre le Dossier →';
      btnNext.classList.add('btn-primary');
    } else {
      btnNext.textContent = 'Étape Suivante →';
    }
  }

  // Masquage ou affichage conditionnel des garants à l'étape 4 (obligatoire en cyber)
  const garantsObligatoireNote = document.getElementById('garantsObligatoireNote');
  if (garantsObligatoireNote) {
    garantsObligatoireNote.textContent = (formData.univers === 'cyber')
      ? '⚠️ Obligatoire pour le Contrat à Cinq (candidat, 2 parents, chef de quartier, représentant PCE ICN).'
      : 'Facultatif pour les candidats majeurs en formation professionnelle ou VAE.';
  }
}

function validateCurrentStep(step) {
  if (step === 2 && formData.univers === 'cyber') {
    const prereqInput = document.getElementById('inputCertifPrereqStep2');
    if (!formData.hasPrerequisPce000 && (!prereqInput || !prereqInput.value.trim())) {
      const confirmPce000 = confirm("Vous n'avez pas validé le socle PCEICN-0001. Souhaitez-vous vous inscrire d'abord au Module Basique PCEICN-0001 pour débloquer votre accès ?");
      if (confirmPce000) {
        window.location.href = 'candidature.html?type=pceicn-0001';
      }
      return false;
    }
  }

  if (step === 3) {
    const nom = document.getElementById('candidatNom')?.value.trim();
    const prenom = document.getElementById('candidatPrenom')?.value.trim();
    const tel = document.getElementById('candidatWhatsapp')?.value.trim();
    const email = document.getElementById('candidatEmail')?.value.trim();

    if (!nom || !prenom || !tel || !email) {
      alert('Veuillez renseigner vos Nom, Prénom, Téléphone WhatsApp et Email.');
      return false;
    }
    formData.nom = nom;
    formData.prenom = prenom;
    formData.whatsapp = tel;
    formData.email = email;
  }

  return true;
}

function setupSignaturePad() {
  const canvas = document.getElementById('signaturePad');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let drawing = false;

  canvas.addEventListener('mousedown', () => drawing = true);
  window.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#00a86b';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  });

  document.getElementById('btnClearSignature')?.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  });
}

function finalizeSubmission() {
  // Génération numéro dossier unique
  const prefix = (formData.univers === 'cyber') ? 'PCE-ICN' : 'PCE-IC';
  const year = '2026';
  const randomNum = String(Math.floor(100000 + Math.random() * 900000));
  const numDossier = `${prefix}-${year}-${randomNum}`;

  formData.numeroDossier = numDossier;
  formData.dateSoumission = new Date().toISOString();
  formData.statut = 'Soumis';

  // Sauvegarde dans le store global
  const allDossiers = JSON.parse(localStorage.getItem('pce_dossiers_candidats') || '[]');
  allDossiers.unshift(formData);
  localStorage.setItem('pce_dossiers_candidats', JSON.stringify(allDossiers));

  // Efface brouillon
  localStorage.removeItem('pce_candidature_draft');

  // Redirection ou affichage modal récépissé
  window.location.href = `espace-candidat.html?dossier=${numDossier}&nouveau=1`;
}

function saveDraft() {
  try {
    localStorage.setItem('pce_candidature_draft', JSON.stringify(formData));
  } catch (e) {}
}

function loadDraft() {
  try {
    const draft = localStorage.getItem('pce_candidature_draft');
    if (draft) {
      Object.assign(formData, JSON.parse(draft));
    }
  } catch (e) {}
}

function formatFCFA(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

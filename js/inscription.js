/**
 * ERIAS ACADEMY OS - Inscription Logic
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

  // Initialisation profil via URL parameter (?profil=Formateur, etc.)
  const urlParams = new URLSearchParams(window.location.search);
  const profilParam = urlParams.get('profil');

  setupProfileSelectors(profilParam);
  updateGroupPreview();

  // Soumission du formulaire
  const form = document.getElementById('inscriptionForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Fermeture modal
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalOverlay = document.getElementById('successModal');
  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // Bouton Impression / Export Reçu
  const printReceiptBtn = document.getElementById('printReceiptBtn');
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }
});

function setupProfileSelectors(initialProfile) {
  const cards = document.querySelectorAll('.profile-option-card');
  const summaryProfileEl = document.getElementById('summaryProfile');

  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');

    if (initialProfile && radio.value.toLowerCase() === initialProfile.toLowerCase()) {
      radio.checked = true;
      card.classList.add('selected');
      if (summaryProfileEl) summaryProfileEl.textContent = radio.value;
    }

    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      radio.checked = true;
      if (summaryProfileEl) summaryProfileEl.textContent = radio.value;
    });
  });
}

function updateGroupPreview() {
  if (!window.eriasStore) return;
  const students = window.eriasStore.getStudents();
  const nextGroup = window.eriasStore.findNextAvailableGroup(students);
  const summaryGroupEl = document.getElementById('summaryGroup');
  if (summaryGroupEl) {
    summaryGroupEl.textContent = `Groupe ${String(nextGroup).padStart(2, '0')} / 14`;
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const nom = document.getElementById('nom')?.value.trim();
  const prenom = document.getElementById('prenom')?.value.trim();
  const whatsapp = document.getElementById('whatsapp')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const ville = document.getElementById('ville')?.value.trim();
  
  const selectedProfileRadio = document.querySelector('input[name="profil"]:checked');
  const profil = selectedProfileRadio ? selectedProfileRadio.value : 'Moniteur';

  // Validation
  if (!nom || !prenom) {
    alert('Veuillez renseigner vos Nom et Prénom.');
    return;
  }
  if (!whatsapp || whatsapp.length < 6) {
    alert('Veuillez saisir un numéro de téléphone WhatsApp valide.');
    return;
  }
  if (!email || !email.includes('@')) {
    alert('Veuillez saisir une adresse email valide.');
    return;
  }
  if (!ville) {
    alert('Veuillez renseigner votre Ville de résidence.');
    return;
  }

  // Enregistrement dans le Store
  const newStudent = window.eriasStore.addStudent({
    nom,
    prenom,
    whatsapp,
    email,
    profil,
    ville,
    statutPaiement: 'Payé', // Enregistré et validé pour la V1
    montantPaye: 25000,
    notes: 'Inscription directe en ligne'
  });

  // Affichage du Récépissé Officiel
  showSuccessModal(newStudent);

  // Réinitialisation du formulaire
  e.target.reset();
  setupProfileSelectors(profil);
  updateGroupPreview();
}

function showSuccessModal(student) {
  const modal = document.getElementById('successModal');
  if (!modal) return;

  // Injection des données dans le ticket
  document.getElementById('receiptId').textContent = student.id;
  document.getElementById('receiptNom').textContent = `${student.prenom} ${student.nom.toUpperCase()}`;
  document.getElementById('receiptProfil').textContent = student.profil;
  document.getElementById('receiptGroupe').textContent = `Groupe ${String(student.groupe).padStart(2, '0')} (Cohorte 50 max)`;
  document.getElementById('receiptVille').textContent = student.ville;
  document.getElementById('receiptContact').textContent = `${student.whatsapp} · ${student.email}`;
  document.getElementById('receiptMontant').textContent = `25 000 FCFA (Inscription réglée)`;
  document.getElementById('receiptDate').textContent = new Date(student.dateInscription).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  modal.classList.add('active');
}

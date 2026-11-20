/**
 * ERIAS ACADEMY OS - Data Store (LocalStorage)
 * Gestionnaire des inscriptions, métriques et persistance locale.
 */

const STORAGE_KEY = 'erias_academy_students_v1';
const INSCRIPTION_FEE = 25000; // FCFA
const MONTHLY_FEE = 37000;     // FCFA x 7 mois
const TOTAL_DURATION_MONTHS = 7;
const TOTAL_CAPACITY = 700;
const GROUPS_COUNT = 14;
const GROUP_CAPACITY = 50;

// Données initiales réalistes basées sur l'écosystème ERIAS SECURITY GABON & PCE ICN Central
const INITIAL_DEMO_STUDENTS = [
  {
    id: 'ERIAS-2026-001',
    nom: 'Ondo Mba',
    prenom: 'Jean-Christophe',
    whatsapp: '+241 77 45 89 12',
    email: 'jc.ondomba@erias-security.ga',
    profil: 'Auditeur',
    ville: 'Libreville (Gabon)',
    groupe: 1,
    dateInscription: '2026-09-15T10:30:00Z',
    statutPaiement: 'Payé',
    montantPaye: 25000,
    mensualitesPayees: 1,
    notes: 'Inscrit via ERIAS Security Gabon'
  },
  {
    id: 'ERIAS-2026-002',
    nom: 'Ndong Ekomie',
    prenom: 'Priscillia',
    whatsapp: '+241 66 12 34 56',
    email: 'p.ndong@gmail.com',
    profil: 'Formateur',
    ville: 'Port-Gentil (Gabon)',
    groupe: 1,
    dateInscription: '2026-09-16T14:15:00Z',
    statutPaiement: 'Payé',
    montantPaye: 25000,
    mensualitesPayees: 0,
    notes: 'Enseignante en informatique'
  },
  {
    id: 'ERIAS-2026-003',
    nom: 'Kouassi',
    prenom: 'Koffi Marc',
    whatsapp: '+225 07 88 99 00',
    email: 'marc.kouassi@fintech-ci.com',
    profil: 'Auditeur',
    ville: 'Abidjan (Côte d\'Ivoire)',
    groupe: 1,
    dateInscription: '2026-09-18T09:00:00Z',
    statutPaiement: 'Payé',
    montantPaye: 25000,
    mensualitesPayees: 0,
    notes: 'PCE ICN Côte d\'Ivoire'
  },
  {
    id: 'ERIAS-2026-004',
    nom: 'Diallo',
    prenom: 'Awa',
    whatsapp: '+221 77 654 32 10',
    email: 'awa.diallo@gov.sn',
    profil: 'Moniteur',
    ville: 'Dakar (Sénégal)',
    groupe: 1,
    dateInscription: '2026-09-20T11:45:00Z',
    statutPaiement: 'En attente',
    montantPaye: 0,
    mensualitesPayees: 0,
    notes: 'Administration publique'
  },
  {
    id: 'ERIAS-2026-005',
    nom: 'Mugisha',
    prenom: 'Aimé Eric',
    whatsapp: '+250 788 123 456',
    email: 'eric.mugisha@spreadpractice.rw',
    profil: 'Formateur',
    ville: 'Kigali (Rwanda)',
    groupe: 2,
    dateInscription: '2026-09-22T16:20:00Z',
    statutPaiement: 'Payé',
    montantPaye: 25000,
    mensualitesPayees: 1,
    notes: 'Spread Practice Technology'
  },
  {
    id: 'ERIAS-2026-006',
    nom: 'Boussougou',
    prenom: 'Alain-Pierre',
    whatsapp: '+241 74 90 81 72',
    email: 'alain.boussougou@banque-bgfi.ga',
    profil: 'Auditeur',
    ville: 'Libreville (Gabon)',
    groupe: 2,
    dateInscription: '2026-09-24T08:30:00Z',
    statutPaiement: 'Payé',
    montantPaye: 25000,
    mensualitesPayees: 0,
    notes: 'Secteur bancaire'
  },
  {
    id: 'ERIAS-2026-007',
    nom: 'Hounkpatin',
    prenom: 'Sègbégnon Fabrice',
    whatsapp: '+229 97 11 22 33',
    email: 'fabrice.hounkpatin@cyber.bj',
    profil: 'Moniteur',
    ville: 'Cotonou (Bénin)',
    groupe: 2,
    dateInscription: '2026-09-27T15:10:00Z',
    statutPaiement: 'Payé',
    montantPaye: 25000,
    mensualitesPayees: 0,
    notes: 'PCE ICN Bénin SARL'
  },
  {
    id: 'ERIAS-2026-008',
    nom: 'Randrianasolo',
    prenom: 'Feno',
    whatsapp: '+261 34 56 789 00',
    email: 'feno.randria@telecom.mg',
    profil: 'Formateur',
    ville: 'Antananarivo (Madagascar)',
    groupe: 2,
    dateInscription: '2026-09-29T10:00:00Z',
    statutPaiement: 'En attente',
    montantPaye: 0,
    mensualitesPayees: 0,
    notes: 'PCE ICN Madagascar'
  },
  {
    id: 'ERIAS-2026-009',
    nom: 'Tremblay',
    prenom: 'Patrick (Diaspora)',
    whatsapp: '+1 514 890 1234',
    email: 'patrick.tremblay@diaspora.ca',
    profil: 'Auditeur',
    ville: 'Montréal (Canada)',
    groupe: 3,
    dateInscription: '2026-10-01T17:40:00Z',
    statutPaiement: 'Payé',
    montantPaye: 25000,
    mensualitesPayees: 1,
    notes: 'PCE ICN Canada'
  },
  {
    id: 'ERIAS-2026-010',
    nom: 'Obiang',
    prenom: 'Chantal',
    whatsapp: '+241 65 30 20 10',
    email: 'chantal.obiang@erias-academy.ga',
    profil: 'Moniteur',
    ville: 'Franceville (Gabon)',
    groupe: 3,
    dateInscription: '2026-10-03T13:25:00Z',
    statutPaiement: 'Payé',
    montantPaye: 25000,
    mensualitesPayees: 0,
    notes: 'Sensibilisation administration'
  },
  {
    id: 'ERIAS-2026-011',
    nom: 'Mendes',
    prenom: 'Carlos',
    whatsapp: '+1 809 345 6789',
    email: 'carlos.mendes@santodomingo.do',
    profil: 'Auditeur',
    ville: 'Saint-Domingue (Rép. Dominicaine)',
    groupe: 3,
    dateInscription: '2026-10-05T19:15:00Z',
    statutPaiement: 'Payé',
    montantPaye: 25000,
    mensualitesPayees: 0,
    notes: 'PCE ICN République Dominicaine'
  },
  {
    id: 'ERIAS-2026-012',
    nom: 'Meyo',
    prenom: 'Christian',
    whatsapp: '+241 77 12 90 45',
    email: 'christian.meyo@oilandgas.ga',
    profil: 'Formateur',
    ville: 'Port-Gentil (Gabon)',
    groupe: 4,
    dateInscription: '2026-10-08T09:10:00Z',
    statutPaiement: 'Payé',
    montantPaye: 25000,
    mensualitesPayees: 0,
    notes: 'Secteur Pétrole & Énergie'
  }
];

class EriasStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.resetToDemo();
    }
  }

  getStudents() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erreur lecture localStorage:', e);
      return [];
    }
  }

  saveStudents(students) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      window.dispatchEvent(new Event('erias_data_updated'));
    } catch (e) {
      console.error('Erreur sauvegarde localStorage:', e);
    }
  }

  resetToDemo() {
    this.saveStudents(INITIAL_DEMO_STUDENTS);
    return INITIAL_DEMO_STUDENTS;
  }

  clearAll() {
    this.saveStudents([]);
    return [];
  }

  // Attribution automatique du prochain groupe disponible (1 à 14, 50 max par groupe)
  findNextAvailableGroup(students) {
    const groupCounts = {};
    for (let i = 1; i <= GROUPS_COUNT; i++) {
      groupCounts[i] = 0;
    }
    students.forEach(s => {
      const g = s.groupe || 1;
      if (groupCounts[g] !== undefined) {
        groupCounts[g]++;
      }
    });

    for (let i = 1; i <= GROUPS_COUNT; i++) {
      if (groupCounts[i] < GROUP_CAPACITY) {
        return i;
      }
    }
    return 14; // Si complet, assigne au dernier ou débordement
  }

  addStudent(studentInput) {
    const students = this.getStudents();
    
    // Génération ID unique format ERIAS-2026-XXX
    const nextNumber = students.length + 1;
    const paddedNum = String(nextNumber).padStart(3, '0');
    const id = `ERIAS-2026-${paddedNum}`;

    const assignedGroup = this.findNextAvailableGroup(students);

    const newStudent = {
      id,
      nom: (studentInput.nom || '').trim(),
      prenom: (studentInput.prenom || '').trim(),
      whatsapp: (studentInput.whatsapp || '').trim(),
      email: (studentInput.email || '').trim().toLowerCase(),
      profil: studentInput.profil || 'Moniteur', // Moniteur, Formateur, Auditeur
      ville: (studentInput.ville || '').trim(),
      groupe: assignedGroup,
      dateInscription: new Date().toISOString(),
      statutPaiement: studentInput.statutPaiement || 'Payé', // 'Payé' par défaut pour démo ou 'En attente'
      montantPaye: studentInput.statutPaiement === 'Payé' ? INSCRIPTION_FEE : (studentInput.montantPaye || 0),
      mensualitesPayees: 0,
      notes: studentInput.notes || 'Inscription en ligne - V1'
    };

    students.unshift(newStudent); // En haut de liste
    this.saveStudents(students);
    return newStudent;
  }

  updatePaymentStatus(id, newStatus) {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index].statutPaiement = newStatus;
      if (newStatus === 'Payé' && students[index].montantPaye === 0) {
        students[index].montantPaye = INSCRIPTION_FEE;
      } else if (newStatus === 'En attente') {
        students[index].montantPaye = 0;
      }
      this.saveStudents(students);
      return students[index];
    }
    return null;
  }

  deleteStudent(id) {
    let students = this.getStudents();
    students = students.filter(s => s.id !== id);
    this.saveStudents(students);
    return true;
  }

  getStats() {
    const students = this.getStudents();
    const totalCount = students.length;

    let totalCollected = 0;
    let paidCount = 0;
    let pendingCount = 0;

    const profileCounts = {
      'Moniteur': 0,
      'Formateur': 0,
      'Auditeur': 0
    };

    const groupCounts = {};
    for (let i = 1; i <= GROUPS_COUNT; i++) {
      groupCounts[i] = 0;
    }

    students.forEach(s => {
      // Comptage profils
      if (profileCounts[s.profil] !== undefined) {
        profileCounts[s.profil]++;
      } else {
        profileCounts['Moniteur']++;
      }

      // Comptage groupes
      const g = s.groupe || 1;
      if (groupCounts[g] !== undefined) {
        groupCounts[g]++;
      }

      // Calcul financier
      if (s.statutPaiement === 'Payé') {
        paidCount++;
        totalCollected += (s.montantPaye || INSCRIPTION_FEE);
        // Ajout éventuel mensualités
        if (s.mensualitesPayees) {
          totalCollected += (s.mensualitesPayees * MONTHLY_FEE);
        }
      } else {
        pendingCount++;
      }
    });

    const occupancyRate = ((totalCount / TOTAL_CAPACITY) * 100).toFixed(1);

    return {
      totalCount,
      maxCapacity: TOTAL_CAPACITY,
      occupancyRate,
      paidCount,
      pendingCount,
      totalCollected,
      potentialTotal: totalCount * INSCRIPTION_FEE,
      profileCounts,
      groupCounts,
      groupsCount: GROUPS_COUNT,
      groupCapacity: GROUP_CAPACITY,
      inscriptionFee: INSCRIPTION_FEE,
      monthlyFee: MONTHLY_FEE
    };
  }

  exportCSV() {
    const students = this.getStudents();
    if (!students.length) return '';

    const headers = [
      'ID',
      'Nom',
      'Prénom',
      'Téléphone WhatsApp',
      'Email',
      'Profil',
      'Ville',
      'Groupe',
      'Date Inscription',
      'Statut Paiement',
      'Montant Encaissé (FCFA)'
    ];

    const rows = students.map(s => [
      `"${s.id}"`,
      `"${s.nom}"`,
      `"${s.prenom}"`,
      `"${s.whatsapp}"`,
      `"${s.email}"`,
      `"${s.profil}"`,
      `"${s.ville}"`,
      `"Groupe ${s.groupe}"`,
      `"${new Date(s.dateInscription).toLocaleDateString('fr-FR')}"`,
      `"${s.statutPaiement}"`,
      `"${s.montantPaye || 0}"`
    ]);

    return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  }
}

// Instance globale
window.eriasStore = new EriasStore();

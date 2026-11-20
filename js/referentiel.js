/**
 * REFERENTIEL OFFICIEL PCE ICN & PCE IC-ACADEMIE DES METIERS
 * Données complètes : 30 formations, 7 filières, 6 pôles métiers, VAE, Masterclass et Formateurs
 */

const REFERENTIEL = {
  // Paramètres par défaut de la facilité de paiement
  facilitePaiementDefaults: {
    fraisInscriptionGlobaux: 80000, // 80 000 FCFA
    partPendantFormationPct: 0.2976, // 29.76% (ou configurable)
    nbMensualitesCyber: 12,
    remunerationParParticipantSensibilise: 25000, // FCFA
    partRemboursementSoldePct: 0.95, // 95% sert à solder
    gainStagiairePendantStagePct: 0.05, // 5% gain immédiat
    gainStagiaireApresThesePct: 0.10 // 10% après validation thèse
  },

  // 1. STATISTIQUES GLOBALES
  stats: [
    { key: "stats.formations", value: "30", label: "Formations Certifiantes" },
    { key: "stats.filieres", value: "7", label: "Filières d'Excellence Cyber" },
    { key: "stats.poles", value: "6", label: "Pôles Métiers en Alternance" },
    { key: "stats.territoires", value: "10+", label: "Territoires & Diaspora" }
  ],

  // 2. UNIVERS A - CYBERSÉCURITÉ PCE ICN : 7 FILIERES ET PARCOURS D'EXCELLENCE
  filieresCyber: [
    {
      id: "S",
      code: "SOCLE",
      label: "Filière Socle",
      name: "Fondamentaux & Hygiène Numérique",
      tagline: "Le prérequis non négociable pour tout parcours en cybersécurité.",
      description: "Poser le socle non négociable de tout parcours PCE ICN : comprendre les menaces, adopter une hygiène numérique irréprochable et agir avec éthique.",
      obligatoire: true,
      debloque: true,
      formationPhare: "PCE-000"
    },
    {
      id: "C",
      code: "DEFENSE",
      label: "Filière C",
      name: "Cyber-Défense Opérationnelle & SOC",
      tagline: "Surveillance, détection d'intrusions et réponse aux incidents en temps réel.",
      description: "Formation intensive d'analystes SOC et d'ingénieurs en cyber-résilience opérationnelle.",
      dureeMois: 18,
      coutTotal: 2500000,
      partFormationPct: 0.2976,
      mensualites: 12,
      mensualiteMontant: 62000,
      soldeRestant: 1756000
    },
    {
      id: "G",
      code: "GOUV",
      label: "Filière G",
      name: "Gouvernance, Risques & Conformité (GRC)",
      tagline: "Politiques de sécurité, conformité réglementaire et audits PCE ICN.",
      description: "Maîtriser les normes ISO 27001, référentiels de cyber-résilience et gestion des crises.",
      dureeMois: 18,
      coutTotal: 2400000,
      partFormationPct: 0.30,
      mensualites: 12,
      mensualiteMontant: 60000,
      soldeRestant: 1680000
    },
    {
      id: "F",
      code: "FORENSIC",
      label: "Filière F",
      name: "Forensic, Investigation & Cyber-Renseignement",
      tagline: "Analyse post-incident, rétro-ingénierie et recherche de preuves numériques.",
      description: "Méthodes criminalistiques numériques et traçabilité des attaques informatiques.",
      dureeMois: 18,
      coutTotal: 2600000,
      partFormationPct: 0.30,
      mensualites: 12,
      mensualiteMontant: 65000,
      soldeRestant: 1820000
    },
    {
      id: "A",
      code: "AUDIT",
      label: "Filière A",
      name: "Audit Technique & Tests d'Intrusion (Pentest)",
      tagline: "Évaluation offensive, tests de pénétration et remédiation des vulnérabilités.",
      description: "Devenez auditeur accrédité capable de simuler des cyberattaques éthiques.",
      dureeMois: 18,
      coutTotal: 2700000,
      partFormationPct: 0.30,
      mensualites: 12,
      mensualiteMontant: 67500,
      soldeRestant: 1890000
    },
    {
      id: "I",
      code: "INDUS",
      label: "Filière I",
      name: "Sécurité des Systèmes Industriels & IoT (SCADA)",
      tagline: "Protection des infrastructures critiques : énergie, eau, télécoms et transport.",
      description: "Spécialisation dans les réseaux opérationnels (OT) et la sécurité SCADA/ICS.",
      dureeMois: 18,
      coutTotal: 2800000,
      partFormationPct: 0.30,
      mensualites: 12,
      mensualiteMontant: 70000,
      soldeRestant: 1960000
    },
    {
      id: "E",
      code: "ETHIQUE",
      label: "Filière E",
      name: "Éthique Numérique & Souveraineté des Données",
      tagline: "Droit du numérique, protection des données personnelles et confiance africaine.",
      description: "Former les futurs délégués à la protection des données (DPO) et stratèges de la confiance numérique.",
      dureeMois: 18,
      coutTotal: 2200000,
      partFormationPct: 0.30,
      mensualites: 12,
      mensualiteMontant: 55000,
      soldeRestant: 1540000
    }
  ],

  // Formations phares Cybersécurité (dont le socle non négociable PCE-000)
  formationsCyber: [
    {
      code: "PCE-000",
      filiereId: "S",
      titre: "Module Basique — Sensibilisation, Hygiène Numérique & Éthique",
      badge: "SOCLE OBLIGATOIRE",
      niveau: "Niveau 1 & 2",
      duree: "30 heures d'apprentissage + examen",
      price: 25000,
      listPrice: 50000,
      prerequis: "Aucun (Entrée universelle)",
      debloqueTous: true,
      description: "Poser le socle non négociable de tout parcours PCE ICN : comprendre les menaces, adopter une hygiène numérique irréprochable et agir avec éthique. Sans ce module validé, aucune autre formation n'est débloquée.",
      certificatDelivre: "Certificat international en initiation aux bases de la cybersécurité, cyber-résilience, éthique numérique et sécurité informatique (Niveaux 1 et 2)"
    },
    {
      code: "PCE-F01",
      filiereId: "C",
      titre: "Analyste Cyber-Résilience & Surveillance SOC",
      badge: "EXCELLENCE PRO",
      niveau: "Expert Opérationnel",
      duree: "18 mois (12 mois cours + 6 mois stage)",
      price: 2500000,
      prerequis: "PCE-000 validé",
      description: "Superviser les flux d'alerte de sécurité, détecter les anomalies critiques et piloter la résilience des systèmes d'information."
    },
    {
      code: "PCE-S01",
      filiereId: "A",
      titre: "Auditeur Sécurité & Tests d'Intrusion Éthiques",
      badge: "ACCRÉDITÉ PCE",
      niveau: "Spécialiste Certifié",
      duree: "18 mois (12 mois cours + 6 mois stage)",
      price: 2700000,
      prerequis: "PCE-000 validé",
      description: "Maîtriser les méthodologies d'audit sur site, les scans de vulnérabilités et la rédaction de plans de remédiation 90 jours."
    },
    {
      code: "PCE-B02",
      filiereId: "G",
      titre: "Manager de Crise Cyber & Continuité d'Activité",
      badge: "GOUVERNANCE",
      niveau: "Consultant Senior",
      duree: "18 mois (12 mois cours + 6 mois stage)",
      price: 2400000,
      prerequis: "PCE-000 validé",
      description: "Concevoir des plans de continuité d'activité (PCA/PRA), diriger une cellule de crise et dialoguer avec les comités de direction."
    }
  ],

  // 3. UNIVERS B - PCE IC-ACADÉMIE DES MÉTIERS : 6 PÔLES MÉTIERS EN ALTERNANCE & VAE
  polesMetiers: [
    {
      id: "pole-info",
      code: "INFO",
      nom: "Pôle Informatique & Bureautique",
      icon: "💻",
      description: "Maîtrise des outils informatiques, réseaux locaux, assistance technique et productivité numérique d'entreprise.",
      metiers: [
        { code: "MET-INF-01", nom: "Initiation à l'Informatique & Culture Numérique", dureeMois: 6, coutTotal: 650000, mensualites: 6, mensualite: 32500, partPendant: 0.30 },
        { code: "MET-INF-02", nom: "Bureautique Avancée (Word, Excel Expert, PowerPoint)", dureeMois: 6, coutTotal: 750000, mensualites: 6, mensualite: 37500, partPendant: 0.30 },
        { code: "MET-INF-03", nom: "Maintenance des Ordinateurs & Support Technique", dureeMois: 12, coutTotal: 1200000, mensualites: 12, mensualite: 30000, partPendant: 0.30 },
        { code: "MET-INF-04", nom: "Réseaux Informatiques & Câblage Structuré", dureeMois: 12, coutTotal: 1400000, mensualites: 12, mensualite: 35000, partPendant: 0.30 }
      ]
    },
    {
      id: "pole-digital",
      code: "DIGITAL",
      nom: "Pôle Digital & Intelligence Artificielle",
      icon: "🤖",
      description: "Exploitation de l'IA générative, stratégie sur les réseaux sociaux, protection des données et marketing numérique.",
      metiers: [
        { code: "MET-DIG-01", nom: "Initiation aux Outils d'Intelligence Artificielle (IA)", dureeMois: 6, coutTotal: 850000, mensualites: 6, mensualite: 42500, partPendant: 0.30 },
        { code: "MET-DIG-02", nom: "Community Management & Stratégie Digitale", dureeMois: 9, coutTotal: 1100000, mensualites: 9, mensualite: 36600, partPendant: 0.30 },
        { code: "MET-DIG-03", nom: "Cybersécurité Appliquée & Protection des Données PME", dureeMois: 12, coutTotal: 1500000, mensualites: 12, mensualite: 37500, partPendant: 0.30 }
      ]
    },
    {
      id: "pole-telecom",
      code: "TELECOM",
      nom: "Pôle Télécoms, Électronique & Industrie",
      icon: "📡",
      description: "Infrastructures télécoms, automatismes industriels, régulation SCADA et capteurs connectés (IoT).",
      metiers: [
        { code: "MET-TEL-01", nom: "Technicien des Réseaux de Télécommunications (Fibre & 4G/5G)", dureeMois: 12, coutTotal: 1600000, mensualites: 12, mensualite: 40000, partPendant: 0.30 },
        { code: "MET-TEL-02", nom: "Électronique Fondamentale & Cartes de Commande", dureeMois: 12, coutTotal: 1450000, mensualites: 12, mensualite: 36250, partPendant: 0.30 },
        { code: "MET-TEL-03", nom: "Systèmes SCADA & Automatisme Industriel", dureeMois: 18, coutTotal: 2200000, mensualites: 18, mensualite: 36600, partPendant: 0.30 },
        { code: "MET-TEL-04", nom: "IoT (Internet des Objets) & Systèmes Embarqués", dureeMois: 12, coutTotal: 1750000, mensualites: 12, mensualite: 43750, partPendant: 0.30 }
      ]
    },
    {
      id: "pole-drones",
      code: "DRONES",
      nom: "Pôle Drones & Technologies Aériennes",
      icon: "🚁",
      description: "Télépilotage professionnel certifié, photogrammétrie, cartographie thermique et maintenance d'aéronefs télépilotés.",
      metiers: [
        { code: "MET-DRO-01", nom: "Pilotage de Drones Civils (Télépilote Certifié)", dureeMois: 6, coutTotal: 1200000, mensualites: 6, mensualite: 60000, partPendant: 0.30 },
        { code: "MET-DRO-02", nom: "Prise de Vue Aérienne & Audiovisuel par Drone", dureeMois: 6, coutTotal: 1350000, mensualites: 6, mensualite: 67500, partPendant: 0.30 },
        { code: "MET-DRO-03", nom: "Inspection Technique, Cartographie & Photogrammétrie", dureeMois: 12, coutTotal: 1950000, mensualites: 12, mensualite: 48750, partPendant: 0.30 },
        { code: "MET-DRO-04", nom: "Maintenance, Réparation & Assemblage de Drones", dureeMois: 12, coutTotal: 1800000, mensualites: 12, mensualite: 45000, partPendant: 0.30 }
      ]
    },
    {
      id: "pole-solaire",
      code: "SOLAIRE",
      nom: "Pôle Énergie Solaire & Transition Énergétique",
      icon: "☀️",
      description: "Étude, dimensionnement, pose et maintenance de centrales photovoltaïques et stations solaires off-grid.",
      metiers: [
        { code: "MET-SOL-01", nom: "Installation & Câblage de Panneaux Photovoltaïques", dureeMois: 9, coutTotal: 1350000, mensualites: 9, mensualite: 45000, partPendant: 0.30 },
        { code: "MET-SOL-02", nom: "Dimensionnement & Étude Technique de Systèmes Solaires", dureeMois: 12, coutTotal: 1700000, mensualites: 12, mensualite: 42500, partPendant: 0.30 },
        { code: "MET-SOL-03", nom: "Maintenance & Diagnostic des Installations PV", dureeMois: 9, coutTotal: 1250000, mensualites: 9, mensualite: 41600, partPendant: 0.30 },
        { code: "MET-SOL-04", nom: "Pompage Solaire & Solutions Énergétiques Hors Réseau (Off-Grid)", dureeMois: 12, coutTotal: 1850000, mensualites: 12, mensualite: 46250, partPendant: 0.30 }
      ]
    },
    {
      id: "pole-auto",
      code: "AUTO",
      nom: "Pôle Automobile, Électricité & Électronique Embarquée",
      icon: "🚗",
      description: "Diagnostic multimarque sur valise électronique, calculateurs de bord, multiplexage et véhicules hybrides/électriques.",
      metiers: [
        { code: "MET-AUT-01", nom: "Électricité & Câblage Électronique Automobile", dureeMois: 12, coutTotal: 1400000, mensualites: 12, mensualite: 35000, partPendant: 0.30 },
        { code: "MET-AUT-02", nom: "Diagnostic Électronique Avancé & Valise Multimarque", dureeMois: 12, coutTotal: 1750000, mensualites: 12, mensualite: 43750, partPendant: 0.30 },
        { code: "MET-AUT-03", nom: "Maintenance des Systèmes Embarqués & Multiplexage", dureeMois: 18, coutTotal: 2100000, mensualites: 18, mensualite: 35000, partPendant: 0.30 },
        { code: "MET-AUT-04", nom: "Initiation aux Véhicules Hybrides & Électriques", dureeMois: 12, coutTotal: 1900000, mensualites: 12, mensualite: 47500, partPendant: 0.30 }
      ]
    }
  ],

  // Pôles à venir activables depuis le back-office
  polesAVenir: [
    { nom: "Pôle BTP, Topographie & Génie Civil", icon: "🏗️", status: "Bientôt disponible" },
    { nom: "Pôle Logistique, Transport Intelligent & Flottes", icon: "🚛", status: "Bientôt disponible" }
  ],

  // 4. PROGRAMME VAE (Validation des Acquis de l'Expérience)
  vaeProgramme: {
    eligible: "Candidats justifiant d'au moins 3 ans d'expérience pratique dans le métier visé",
    fraisDossier: 80000, // FCFA
    coutEvaluation: 250000, // FCFA
    etapes: [
      { num: 1, titre: "Recevabilité", desc: "Dépôt du CV, attestations d'employeurs et 3 ans d'expérience vérifiée" },
      { num: 2, titre: "Dossier de Preuves", desc: "Rapport d'activité, photos/vidéos de réalisations, références clients" },
      { num: 3, titre: "Entretien du Jury", desc: "Mise en situation pratique ou soutenance devant un collège d'experts" },
      { num: 4, titre: "Décision & Titre", desc: "Validation Totale (Certificat délivré) ou Partielle (parcours raccourci)" }
    ]
  },

  // 5. MASTERCLASS THEMATIQUES D'ACQUISITION DE COMPÉTENCES
  masterclasses: [
    {
      id: "MC-01",
      titre: "Sécurisation des PME et Réflexes Face aux Ransomwares",
      pole: "Cybersécurité",
      univers: "cyber",
      niveau: "Tous niveaux",
      format: "Hybride (Présentiel Libreville + Visio)",
      duree: "2 jours (14h)",
      date: "12 - 13 Décembre 2026",
      placesRestantes: 8,
      capaciteMax: 30,
      tarifPublic: 75000,
      tarifEtudiant: 35000,
      formateurNom: "Mba Nguema",
      formateurTitre: "Formateur Certifié PCE ICN Expert",
      description: "Atelier pratique pour immuniser une organisation : hygiène des mots de passe, sauvegardes 3-2-1 et réaction rapide en cas d'attaque."
    },
    {
      id: "MC-02",
      titre: "Exploitation Pratique de l'IA Générative en Entreprise",
      pole: "Digital & IA",
      univers: "metiers",
      niveau: "Intermédiaire",
      format: "En ligne interactif",
      duree: "3 jours (18h)",
      date: "18 - 20 Janvier 2027",
      placesRestantes: 12,
      capaciteMax: 40,
      tarifPublic: 90000,
      tarifEtudiant: 45000,
      formateurNom: "Dr. Célestin Diallo",
      formateurTitre: "Expert Senior en Intelligence Artificielle",
      description: "Prompts avancés, intégration dans les flux documentaires et automatisation sans code pour booster la productivité de 40%."
    },
    {
      id: "MC-03",
      titre: "Télépilotage Professionnel de Drone & Réglementation CEMAC",
      pole: "Drones & Technologies Aériennes",
      univers: "metiers",
      niveau: "Débutant à Pratiquant",
      format: "Présentiel sur site (Terrain d'exercice)",
      duree: "4 jours (28h)",
      date: "5 - 8 Février 2027",
      placesRestantes: 5,
      capaciteMax: 15,
      tarifPublic: 180000,
      tarifEtudiant: 95000,
      formateurNom: "Capitaine Eric Tremblay",
      formateurTitre: "Instructeur Télépilote Accrédité",
      description: "Prise en main, règles de vol, sécurité aérienne et premiers levés photographiques exploitables en SIG."
    },
    {
      id: "MC-04",
      titre: "Diagnostic Automobile Avancé par Valise OBD & Bus CAN",
      pole: "Automobile & Électronique",
      univers: "metiers",
      niveau: "Technicien",
      format: "Atelier Présentiel (Garage Partenaire)",
      duree: "3 jours (21h)",
      date: "22 - 24 Février 2027",
      placesRestantes: 6,
      capaciteMax: 16,
      tarifPublic: 120000,
      tarifEtudiant: 60000,
      formateurNom: "Ing. Koffi Marc",
      formateurTitre: "Spécialiste Électronique Embarquée",
      description: "Interprétation des codes défauts complexes, test des actuateurs et décodage des trames multiplexées."
    }
  ],

  // 6. ANNUAire DES FORMATEURS CERTIFIÉS PCE ICN
  formateursCertifies: [
    {
      id: "FORM-001",
      nom: "Jean-Paul Mba Nguema",
      titre: "Formateur Certifié PCE ICN Expert",
      badgeNiveau: "Expert Senior",
      pays: "Gabon (Libreville)",
      specialites: ["Cyber-Résilience", "Audits SOC", "Hygiène Numérique"],
      masterclassAnimees: 14,
      noteEvaluation: "4.9/5",
      verifieQrCode: "PCE-CERT-FORM-001"
    },
    {
      id: "FORM-002",
      nom: "Aïssatou Ba",
      titre: "Formatrice Certifiée PCE ICN",
      badgeNiveau: "Formatrice Certifiée",
      pays: "Sénégal (Dakar)",
      specialites: ["Gouvernance des Données", "ISO 27001", "Éthique"],
      masterclassAnimees: 8,
      noteEvaluation: "4.8/5",
      verifieQrCode: "PCE-CERT-FORM-002"
    },
    {
      id: "FORM-003",
      nom: "Aimé Eric Mugisha",
      titre: "Formateur Associé PCE ICN",
      badgeNiveau: "Formateur Associé",
      pays: "Rwanda (Kigali)",
      specialites: ["Automatismes SCADA", "IoT", "Transition Solaire"],
      masterclassAnimees: 6,
      noteEvaluation: "4.9/5",
      verifieQrCode: "PCE-CERT-FORM-003"
    }
  ],

  // 7. PARTENAIRES LOCAUX ET CENTRES ACCRÉDITÉS
  partenairesLocaux: [
    { pays: "Gabon", ville: "Libreville", centre: "ERIAS SECURITY GABON (Siège National)", contact: "+241 77 00 11 22" },
    { pays: "Gabon", ville: "Port-Gentil", centre: "ERIAS Hub Maritime & Pétrole", contact: "+241 66 11 22 33" },
    { pays: "Côte d'Ivoire", ville: "Abidjan", centre: "PCE ICN Côte d'Ivoire (Plateau)", contact: "+225 07 12 34 56" },
    { pays: "Sénégal", ville: "Dakar", centre: "PCE ICN Sénégal (Almadies)", contact: "+221 77 890 12 34" },
    { pays: "Rwanda", ville: "Kigali", centre: "Spread Practice Technology Ltd", contact: "+250 788 123 456" },
    { pays: "Bénin", ville: "Cotonou", centre: "PCE ICN Bénin SARL", contact: "+229 97 11 22 33" },
    { pays: "Madagascar", ville: "Antananarivo", centre: "PCE ICN Madagascar", contact: "+261 34 56 789 00" },
    { pays: "Canada", ville: "Montréal", centre: "PCE ICN Diaspora Amériques", contact: "+1 514 890 1234" },
    { pays: "France", ville: "Paris", centre: "PCE ICN Diaspora Europe", contact: "+33 1 89 00 12 34" }
  ]
};

// Fonctions utilitaires de calcul et de récupération
window.referentiel = {
  getFiliere(id) {
    return REFERENTIEL.filieresCyber.find(f => f.id === id || f.code === id);
  },

  getFormationCyber(code) {
    return REFERENTIEL.formationsCyber.find(f => f.code === code);
  },

  getAllMetiers() {
    const list = [];
    REFERENTIEL.polesMetiers.forEach(pole => {
      pole.metiers.forEach(m => {
        list.push({ ...m, poleNom: pole.nom, poleId: pole.id });
      });
    });
    return list;
  },

  getMetier(code) {
    for (const p of REFERENTIEL.polesMetiers) {
      const found = p.metiers.find(m => m.code === code);
      if (found) return { ...found, poleNom: p.nom, poleId: p.id };
    }
    return null;
  },

  // Moteur de calcul de la Facilité de Paiement (Cyber ou Métiers)
  calculerFacilitePaiement({ coutTotal, partPendantPct = 0.2976, nbMensualites = 12 }) {
    const payePendantFormation = Math.round(coutTotal * partPendantPct);
    const mensualite = Math.ceil(payePendantFormation / nbMensualites);
    const soldeRestant = coutTotal - payePendantFormation;
    
    // Rémunération nette servant à régler le solde : 25 000 FCFA x 95% = 23 750 FCFA
    const valeurUnitaireMissionSolde = REFERENTIEL.facilitePaiementDefaults.remunerationParParticipantSensibilise * 
                                      REFERENTIEL.facilitePaiementDefaults.partRemboursementSoldePct;
    
    const nbParticipantsEstimatif = Math.ceil(soldeRestant / valeurUnitaireMissionSolde);

    return {
      coutTotal,
      fraisInscription: REFERENTIEL.facilitePaiementDefaults.fraisInscriptionGlobaux,
      partPendantFormationPct: (partPendantPct * 100).toFixed(1),
      payePendantFormation,
      nbMensualites,
      mensualite,
      soldeRestant,
      partSoldePct: (100 - (partPendantPct * 100)).toFixed(1),
      nbParticipantsEstimatif,
      gainImmediatStagiaireParParticipant: Math.round(REFERENTIEL.facilitePaiementDefaults.remunerationParParticipantSensibilise * 0.05), // 1 250 F
      gainApresTheseParParticipant: Math.round(REFERENTIEL.facilitePaiementDefaults.remunerationParParticipantSensibilise * 0.10) // 2 500 F
    };
  },

  data: REFERENTIEL
};

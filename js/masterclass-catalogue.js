/**
 * CATALOGUE MASTERCLASS PRO — ERIAS ACADEMY OS
 * Les masterclass existantes (js/referentiel.js) sont conservées dans la
 * famille « Sessions phares », complétées par 7 familles de 3 masterclass.
 */
(function () {
  const familles = [
    { id: 'phares', nom: 'Sessions phares PCE ICN & IC Métiers', icon: '⭐' },
    { id: 'dev-ia', nom: 'Développement & IA', icon: '💻' },
    { id: 'data-cloud', nom: 'Data & Cloud', icon: '☁️' },
    { id: 'reseaux', nom: 'Réseaux & Systèmes', icon: '🌐' },
    { id: 'gestion', nom: 'Gestion, Compta & Finance Digitale', icon: '📊' },
    { id: 'marketing', nom: 'Marketing, Communication & Vente', icon: '📣' },
    { id: 'emergents', nom: 'Métiers Émergents', icon: '🚀', sousTitre: 'E-Commerce, Community Management, Assistance Virtuelle' },
    { id: 'sante-edu', nom: 'Santé, Éducation & Services', icon: '🩺' }
  ];

  const nouvelles = [
    // 1. Développement & IA
    { id: 'MCP-DEV-01', famille: 'dev-ia', titre: 'Créer son 1er site web pro avec HTML, CSS & JavaScript', duree: '3 jours (18h)', niveau: 'Débutant', prix: 65000, mode: 'Hybride', date: '11 - 13 Janvier 2027', formateur: 'Arnaud Ondo Mba', formateurTitre: 'Formateur Certifié IC Métiers — Développement Web', places: 14, capacite: 25, description: 'Du design à la mise en ligne : structurer une page, la rendre responsive et la publier gratuitement.' },
    { id: 'MCP-DEV-02', famille: 'dev-ia', titre: 'Python & Automatisation des tâches de bureau', duree: '4 jours (20h)', niveau: 'Intermédiaire', prix: 85000, mode: 'En ligne', date: '25 - 28 Janvier 2027', formateur: 'Dr. Célestin Diallo', formateurTitre: 'Expert Senior en Intelligence Artificielle', places: 9, capacite: 30, description: 'Automatiser Excel, e-mails et fichiers avec Python pour gagner des heures chaque semaine.' },
    { id: 'MCP-DEV-03', famille: 'dev-ia', titre: 'Agents IA & Prompt Engineering avancé', duree: '2 jours (14h)', niveau: 'Avancé', prix: 110000, mode: 'Présentiel', date: '15 - 16 Février 2027', formateur: 'Mireille Nzé Obame', formateurTitre: 'Formatrice Certifiée PCE ICN — IA & Éthique', places: 6, capacite: 20, description: 'Concevoir des assistants IA fiables, sécurisés et conformes pour les entreprises africaines.' },

    // 2. Data & Cloud
    { id: 'MCP-DATA-01', famille: 'data-cloud', titre: 'Excel avancé & tableaux de bord Power BI', duree: '3 jours (18h)', niveau: 'Débutant', prix: 60000, mode: 'Hybride', date: '18 - 20 Janvier 2027', formateur: 'Sandrine Moussavou', formateurTitre: 'Formatrice Certifiée IC Métiers — Data', places: 18, capacite: 30, description: 'Nettoyer ses données, construire des indicateurs et un tableau de bord dynamique.' },
    { id: 'MCP-DATA-02', famille: 'data-cloud', titre: 'SQL & Analyse de données pour décideurs', duree: '3 jours (18h)', niveau: 'Intermédiaire', prix: 80000, mode: 'En ligne', date: '8 - 10 Février 2027', formateur: 'Yannick Mbadinga', formateurTitre: 'Data Analyst Certifié PCE ICN', places: 11, capacite: 25, description: 'Interroger une base de données, croiser les tables et produire des analyses actionnables.' },
    { id: 'MCP-DATA-03', famille: 'data-cloud', titre: 'Cloud AWS & Azure : déployer et sécuriser', duree: '4 jours (24h)', niveau: 'Expert', prix: 150000, mode: 'Présentiel', date: '1 - 4 Mars 2027', formateur: 'Jean-Paul Mba Nguema', formateurTitre: 'Formateur Certifié PCE ICN Expert', places: 5, capacite: 16, description: 'Architecture cloud, gestion des identités, sauvegardes et conformité des données hébergées.' },

    // 3. Réseaux & Systèmes
    { id: 'MCP-NET-01', famille: 'reseaux', titre: 'Bases des réseaux : TCP/IP, Wi-Fi & câblage', duree: '3 jours (18h)', niveau: 'Débutant', prix: 55000, mode: 'Présentiel', date: '13 - 15 Janvier 2027', formateur: 'Patrick Engone', formateurTitre: 'Formateur Certifié PCE ICN — Réseaux', places: 16, capacite: 24, description: 'Comprendre et installer un réseau de bureau fiable, du câble RJ45 au point d\'accès Wi-Fi.' },
    { id: 'MCP-NET-02', famille: 'reseaux', titre: 'Administration Windows Server & Linux', duree: '4 jours (24h)', niveau: 'Intermédiaire', prix: 95000, mode: 'Hybride', date: '1 - 4 Février 2027', formateur: 'Ghislain Ndong', formateurTitre: 'Administrateur Systèmes Certifié IC Métiers', places: 8, capacite: 20, description: 'Comptes, droits, partages, mises à jour et supervision des serveurs d\'une PME.' },
    { id: 'MCP-NET-03', famille: 'reseaux', titre: 'Pare-feux, VPN & segmentation réseau', duree: '3 jours (21h)', niveau: 'Avancé', prix: 120000, mode: 'Présentiel', date: '22 - 24 Février 2027', formateur: 'Jean-Paul Mba Nguema', formateurTitre: 'Formateur Certifié PCE ICN Expert', places: 4, capacite: 16, description: 'Configurer un pare-feu nouvelle génération, des VPN site-à-site et isoler les zones sensibles.' },

    // 4. Gestion, Compta & Finance Digitale
    { id: 'MCP-GES-01', famille: 'gestion', titre: 'Comptabilité OHADA sur logiciel (Sage / Odoo)', duree: '4 jours (24h)', niveau: 'Débutant', prix: 75000, mode: 'Hybride', date: '18 - 21 Janvier 2027', formateur: 'Clarisse Bivigou', formateurTitre: 'Expert-comptable Formatrice IC Métiers', places: 13, capacite: 25, description: 'Saisie, rapprochements, TVA et états financiers selon le référentiel SYSCOHADA.' },
    { id: 'MCP-GES-02', famille: 'gestion', titre: 'Mobile Money & finance digitale pour PME', duree: '2 jours (14h)', niveau: 'Intermédiaire', prix: 50000, mode: 'En ligne', date: '3 - 4 Février 2027', formateur: 'Hervé Koumba', formateurTitre: 'Consultant Fintech Certifié', places: 20, capacite: 40, description: 'Encaisser, suivre et sécuriser les paiements Airtel Money / Moov Money et la caisse digitale.' },
    { id: 'MCP-GES-03', famille: 'gestion', titre: 'Contrôle de gestion & pilotage budgétaire', duree: '3 jours (18h)', niveau: 'Avancé', prix: 100000, mode: 'Présentiel', date: '1 - 3 Mars 2027', formateur: 'Clarisse Bivigou', formateurTitre: 'Expert-comptable Formatrice IC Métiers', places: 7, capacite: 20, description: 'Construire un budget, suivre les écarts et piloter la rentabilité par activité.' },

    // 5. Marketing, Communication & Vente
    { id: 'MCP-MKT-01', famille: 'marketing', titre: 'Marketing digital : Facebook, Instagram & TikTok Ads', duree: '3 jours (18h)', niveau: 'Débutant', prix: 60000, mode: 'En ligne', date: '20 - 22 Janvier 2027', formateur: 'Laetitia Mengue', formateurTitre: 'Formatrice Certifiée IC Métiers — Marketing', places: 17, capacite: 35, description: 'Définir sa cible, créer des visuels qui convertissent et lancer ses premières campagnes.' },
    { id: 'MCP-MKT-02', famille: 'marketing', titre: 'Techniques de vente & négociation commerciale', duree: '2 jours (14h)', niveau: 'Intermédiaire', prix: 55000, mode: 'Présentiel', date: '9 - 10 Février 2027', formateur: 'Serge Obiang', formateurTitre: 'Coach Commercial Certifié', places: 12, capacite: 25, description: 'Prospection, argumentaire, traitement des objections et closing en situation réelle.' },
    { id: 'MCP-MKT-03', famille: 'marketing', titre: 'Communication de crise & image de marque', duree: '2 jours (14h)', niveau: 'Expert', prix: 95000, mode: 'Hybride', date: '24 - 25 Février 2027', formateur: 'Mireille Nzé Obame', formateurTitre: 'Formatrice Certifiée PCE ICN — IA & Éthique', places: 6, capacite: 18, description: 'Anticiper un bad buzz, gérer une fuite de données et protéger sa réputation en ligne.' },

    // 6. Métiers Émergents
    { id: 'MCP-EME-01', famille: 'emergents', titre: 'Lancer sa boutique E-Commerce de A à Z', duree: '3 jours (18h)', niveau: 'Débutant', prix: 65000, mode: 'Hybride', date: '25 - 27 Janvier 2027', formateur: 'Kevin Ella', formateurTitre: 'Entrepreneur E-Commerce Certifié IC Métiers', places: 15, capacite: 30, description: 'Choisir ses produits, créer sa boutique, encaisser en Mobile Money et organiser la livraison.' },
    { id: 'MCP-EME-02', famille: 'emergents', titre: 'Community Manager professionnel', duree: '3 jours (18h)', niveau: 'Intermédiaire', prix: 60000, mode: 'En ligne', date: '10 - 12 Février 2027', formateur: 'Laetitia Mengue', formateurTitre: 'Formatrice Certifiée IC Métiers — Marketing', places: 10, capacite: 30, description: 'Ligne éditoriale, calendrier de publication, modération et reporting pour ses clients.' },
    { id: 'MCP-EME-03', famille: 'emergents', titre: 'Assistance Virtuelle & travail à distance', duree: '2 jours (14h)', niveau: 'Débutant', prix: 45000, mode: 'En ligne', date: '3 - 4 Mars 2027', formateur: 'Grâce Mavoungou', formateurTitre: 'Assistante Virtuelle Certifiée', places: 22, capacite: 40, description: 'Outils, organisation, tarification et recherche de clients internationaux en télétravail.' },

    // 7. Santé, Éducation & Services
    { id: 'MCP-SAN-01', famille: 'sante-edu', titre: 'Premiers secours & santé au travail', duree: '2 jours (14h)', niveau: 'Débutant', prix: 40000, mode: 'Présentiel', date: '16 - 17 Janvier 2027', formateur: 'Dr. Aline Nguema', formateurTitre: 'Médecin Formatrice Certifiée', places: 19, capacite: 24, description: 'Gestes qui sauvent, prévention des risques et trousse de secours en entreprise.' },
    { id: 'MCP-SAN-02', famille: 'sante-edu', titre: 'Pédagogie numérique : enseigner en ligne', duree: '3 jours (18h)', niveau: 'Intermédiaire', prix: 55000, mode: 'Hybride', date: '6 - 8 Février 2027', formateur: 'Prof. Rodrigue Ekomie', formateurTitre: 'Formateur de Formateurs Certifié PCE ICN', places: 14, capacite: 30, description: 'Concevoir un cours en ligne engageant, animer une classe virtuelle et évaluer à distance.' },
    { id: 'MCP-SAN-03', famille: 'sante-edu', titre: 'Accueil client & qualité de service', duree: '2 jours (14h)', niveau: 'Débutant', prix: 40000, mode: 'Présentiel', date: '27 - 28 Février 2027', formateur: 'Brigitte Oyane', formateurTitre: 'Consultante Qualité Certifiée', places: 21, capacite: 30, description: 'Accueil physique et téléphonique, gestion des réclamations et fidélisation.' }
  ];

  const modeDepuisFormat = (format) => {
    const f = String(format || '').toLowerCase();
    if (f.includes('hybride')) return 'Hybride';
    if (f.includes('ligne') || f.includes('visio')) return 'En ligne';
    return 'Présentiel';
  };

  // Masterclass existantes conservées (référentiel)
  const existantes = ((window.referentiel && window.referentiel.data && window.referentiel.data.masterclasses) || []).map((m) => ({
    id: m.id,
    famille: 'phares',
    titre: m.titre,
    duree: m.duree,
    niveau: m.niveau,
    prix: m.tarifPublic,
    prixEtudiant: m.tarifEtudiant,
    mode: modeDepuisFormat(m.format),
    format: m.format,
    date: m.date,
    formateur: m.formateurNom,
    formateurTitre: m.formateurTitre,
    places: m.placesRestantes,
    capacite: m.capaciteMax,
    description: m.description,
    pole: m.pole
  }));

  const masterclasses = existantes.concat(nouvelles);

  window.ERIAS_MASTERCLASS = {
    familles,
    masterclasses,
    getFamille: (id) => familles.find((f) => f.id === id),
    getMasterclass: (id) => masterclasses.find((m) => m.id === id),
    formatFcfa: (n) => new Intl.NumberFormat('fr-FR').format(n).replace(/ | /g, ' ') + ' FCFA'
  };
})();

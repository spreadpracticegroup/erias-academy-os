# ERIAS ACADEMY OS - V1

**SaaS de gestion de formation et portail officiel d'inscription** pour le programme certifiant international **"Cyber-Résilience & Éthique Numérique"**, déployé par **ERIAS SECURITY GABON** et accrédité par **PCE ICN Central**.

---

## 🏛️ Contexte & Référentiel Officiel

- **Programme :** Formation *"Cyber-Résilience & Éthique Numérique"*
- **Opérateur :** ERIAS SECURITY GABON (représentation PCE ICN Gabon SA)
- **Certification :** PCE ICN Central (Protection, Conformité, Excellence)
- **Durée :** 7 mois (du 15 Octobre 2026 au 15 Mai 2027)
- **Tarifs :** 25 000 FCFA à l'inscription + 37 000 FCFA x 7 mois
- **Capacité de la promotion :** 700 apprenants répartis en 14 groupes de 50 apprenants
- **3 Profils Métiers :** Moniteur, Formateur, Auditeur
- **3 Niveaux de Certification :** PCE ICN Start, PCE ICN Resilience, PCE ICN Sovereign
- **Écosystème partenaire :** ERA NETWORK PARTNERS, Elds Relay Africa, Spread Practice Technology Rwanda, EerlsZone Market

---

## 🚀 Fonctionnalités Implémentées dans la V1

### 1. Landing Page d'Élite (`index.html`)
- **Titre officiel :** `DEVENEZ EXPERT CYBERSÉCURITÉ CERTIFIÉ PCE IC`
- **Présentation des 3 Profils :**
  - **Moniteur** : Sensibilisateur opérationnel & garant de l'hygiène numérique.
  - **Formateur** : Pédagogue expert & animateur de la cyber-résilience.
  - **Auditeur** : Évaluateur certifié de maturité & conformité PCE ICN.
- **Transparence tarifaire :** Frais d'inscription de 25 000 FCFA (+ mensualités de 37 000 FCFA / mois pendant 7 mois).
- **Organisation pédagogique :** Jauges interactives des 700 places et des 14 groupes de 50.
- **Bouton d'action proéminent :** `JE RÉSERVE MA PLACE` avec redirection directe vers le formulaire.
- **Sections institutionnelles :** Les 3 piliers (Hygiène numérique, Cyber-résilience, Éthique numérique), les 3 badges de certification, les territoires (Afrique, Caraïbes, Diaspora), les partenaires accrédités et la FAQ interactive.

### 2. Page d'Inscription & Récépissé Officiel (`inscription.html`)
- Formulaire complet responsive avec validation en temps réel :
  - **Nom** et **Prénom**
  - **Téléphone WhatsApp** (alertes et groupe promo)
  - **Email** (accès plateforme et convocations)
  - **Profil choisi** (sélecteur interactif : Moniteur, Formateur, Auditeur)
  - **Ville & Pays de résidence**
- Calculateur de frais et récapitulatif dynamique des mensualités.
- Attribution automatique du groupe disponible (1 à 14).
- **Modal de succès instantané :** Génération du récépissé officiel avec identifiant unique (ex: `ERIAS-2026-013`), détails du dossier et bouton d'impression / export PDF.

### 3. Dashboard Administrateur Simple & Puissant (`admin.html`)
- **Indicateurs clés (KPIs) en temps réel :**
  - **Nombre total d'inscrits** et taux de remplissage sur 700 places.
  - **Montant total encaissé** calculé dynamiquement sur les inscriptions et mensualités réglées en FCFA.
  - **Volume potentiel engagé** (25 000 FCFA x nombre d'inscrits).
  - **Capacité restante** et disponibilité des cohortes.
- **Visualisations analytiques :**
  - Barres de répartition pour les 3 profils (Moniteurs, Formateurs, Auditeurs).
  - Grille de suivi en direct des 14 cohortes (capacité 50 apprenants chacune).
- **Tableau de gestion des apprenants :**
  - Moteur de recherche instantanée (par nom, prénom, email, téléphone, ville, groupe).
  - Filtres croisés par profil et par statut de paiement.
  - **Bascule de paiement en 1 clic :** Passer un apprenant de `Payé (25 000 FCFA)` à `En attente` met à jour automatiquement le montant total encaissé.
  - Fiche détaillée complète avec modal imprimable.
  - Bouton d'ajout rapide d'un apprenant.
  - **Export CSV certifié** (`ERIAS_ACADEMY_INSCRITS_YYYY-MM-DD.csv`).
  - Bouton de réinitialisation avec jeu de données démo réaliste.

---

## 🎨 Design System

- **Palette :** Bleu Nuit Impérial (`#050811`, `#090f1f`, `#0f1933`) rehaussé d'Or Lumineux (`#d4af37`, `#f7e08d`, gradient or), avec touches cyber cyan (`#00d2ff`).
- **Typographie :** *Outfit*, *Space Grotesk* et *Cinzel* (Google Fonts).
- **Ergonomie :** 100% responsive (mobile, tablette, desktop), effets de verre dépoli (*glassmorphism*), cartes interactives et boutons prestige.

---

## 🛠️ Stack Technique

- **Architecture :** Vanilla HTML5, CSS3, JavaScript ES6+.
- **Stockage & Persistance :** `localStorage` avec synchronisation instantanée d'événements entre la landing page, le formulaire d'inscription et le dashboard admin.
- **Zéro dépendance backend :** Prêt à l'emploi directement dans n'importe quel navigateur web moderne.

---

## 📂 Structure du Répertoire

```
erias-academy-os/
├── index.html              # Landing Page officielle
├── inscription.html        # Formulaire de réservation & récépissé
├── admin.html              # Dashboard d'administration & pilotage
├── css/
│   ├── style.css           # Design system global (variables, reset, boutons)
│   ├── landing.css         # Styles de la landing page
│   ├── inscription.css     # Styles du formulaire et du récépissé
│   └── admin.css           # Styles du tableau de bord d'administration
├── js/
│   ├── store.js            # Moteur de données (LocalStorage, KPIs, CSV, Démo)
│   ├── landing.js          # Interactions landing page (jauges en direct, FAQ)
│   ├── inscription.js      # Validation, attribution groupe, modal succès
│   └── admin.js            # KPIs, filtres, recherche, bascule paiements
└── README.md               # Documentation de la solution
```

---

*Développé pour ERIAS SECURITY GABON & le réseau international PCE ICN Central.*

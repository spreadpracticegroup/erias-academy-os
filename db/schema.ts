import { pgTable, serial, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

/** Professeurs IC LYCÉE (alimenté par le formulaire « recrutement-prof-ic-lycee ») */
export const icProfs = pgTable("ic_lycee_profs", {
  id: serial().primaryKey(),
  reference: text().notNull().unique(),
  nom: text().notNull(),
  whatsapp: text().notNull().default(""),
  email: text().notNull().default(""),
  ville: text().notNull().default(""),
  statutPro: text("statut_pro").notNull().default(""),
  etablissement: text().notNull().default(""),
  matieres: jsonb().$type<string[]>().notNull().default([]),
  niveaux: jsonb().$type<string[]>().notNull().default([]),
  experience: text().notNull().default(""),
  certification: text().notNull().default(""),
  mode: text().notNull().default(""),
  disponibilites: jsonb().$type<string[]>().notNull().default([]),
  tarifHoraire: text("tarif_horaire").notNull().default(""),
  cvUrl: text("cv_url").notNull().default(""),
  presentation: text().notNull().default(""),
  /** En attente | Certifié | Actif | Suspendu */
  statut: text().notNull().default("En attente"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Demandes de cours (alimenté par le formulaire « demande-cours-ic-lycee ») */
export const icDemandes = pgTable("ic_lycee_demandes", {
  id: serial().primaryKey(),
  reference: text().notNull().unique(),
  parentNom: text("parent_nom").notNull().default(""),
  eleveNom: text("eleve_nom").notNull(),
  whatsapp: text().notNull().default(""),
  ville: text().notNull().default(""),
  classe: text().notNull().default(""),
  matieres: jsonb().$type<string[]>().notNull().default([]),
  besoin: text().notNull().default(""),
  mode: text().notNull().default(""),
  forfait: text().notNull().default(""),
  montant: integer().notNull().default(0),
  facilitePaiement: boolean("facilite_paiement").notNull().default(false),
  dateDebut: text("date_debut").notNull().default(""),
  message: text().notNull().default(""),
  /** En attente | 1ère tranche | Payé | Retard */
  statutPaiement: text("statut_paiement").notNull().default("En attente"),
  profId: integer("prof_id").references(() => icProfs.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Planning des séances */
export const icPlanning = pgTable("ic_lycee_planning", {
  id: serial().primaryKey(),
  date: text().notNull(),
  heure: text().notNull().default(""),
  profId: integer("prof_id").references(() => icProfs.id, { onDelete: "set null" }),
  demandeId: integer("demande_id").references(() => icDemandes.id, { onDelete: "cascade" }),
  eleve: text().notNull().default(""),
  matiere: text().notNull().default(""),
  mode: text().notNull().default(""),
  /** Planifié | Effectué | Reporté | Annulé */
  statut: text().notNull().default("Planifié"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

CREATE TABLE "ic_lycee_demandes" (
	"id" serial PRIMARY KEY,
	"reference" text NOT NULL UNIQUE,
	"parent_nom" text DEFAULT '' NOT NULL,
	"eleve_nom" text NOT NULL,
	"whatsapp" text DEFAULT '' NOT NULL,
	"ville" text DEFAULT '' NOT NULL,
	"classe" text DEFAULT '' NOT NULL,
	"matieres" jsonb DEFAULT '[]' NOT NULL,
	"besoin" text DEFAULT '' NOT NULL,
	"mode" text DEFAULT '' NOT NULL,
	"forfait" text DEFAULT '' NOT NULL,
	"montant" integer DEFAULT 0 NOT NULL,
	"facilite_paiement" boolean DEFAULT false NOT NULL,
	"date_debut" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"statut_paiement" text DEFAULT 'En attente' NOT NULL,
	"prof_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ic_lycee_planning" (
	"id" serial PRIMARY KEY,
	"date" text NOT NULL,
	"heure" text DEFAULT '' NOT NULL,
	"prof_id" integer,
	"demande_id" integer,
	"eleve" text DEFAULT '' NOT NULL,
	"matiere" text DEFAULT '' NOT NULL,
	"mode" text DEFAULT '' NOT NULL,
	"statut" text DEFAULT 'Planifié' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ic_lycee_profs" (
	"id" serial PRIMARY KEY,
	"reference" text NOT NULL UNIQUE,
	"nom" text NOT NULL,
	"whatsapp" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"ville" text DEFAULT '' NOT NULL,
	"statut_pro" text DEFAULT '' NOT NULL,
	"etablissement" text DEFAULT '' NOT NULL,
	"matieres" jsonb DEFAULT '[]' NOT NULL,
	"niveaux" jsonb DEFAULT '[]' NOT NULL,
	"experience" text DEFAULT '' NOT NULL,
	"certification" text DEFAULT '' NOT NULL,
	"mode" text DEFAULT '' NOT NULL,
	"disponibilites" jsonb DEFAULT '[]' NOT NULL,
	"tarif_horaire" text DEFAULT '' NOT NULL,
	"cv_url" text DEFAULT '' NOT NULL,
	"presentation" text DEFAULT '' NOT NULL,
	"statut" text DEFAULT 'En attente' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ic_lycee_demandes" ADD CONSTRAINT "ic_lycee_demandes_prof_id_ic_lycee_profs_id_fkey" FOREIGN KEY ("prof_id") REFERENCES "ic_lycee_profs"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "ic_lycee_planning" ADD CONSTRAINT "ic_lycee_planning_prof_id_ic_lycee_profs_id_fkey" FOREIGN KEY ("prof_id") REFERENCES "ic_lycee_profs"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "ic_lycee_planning" ADD CONSTRAINT "ic_lycee_planning_demande_id_ic_lycee_demandes_id_fkey" FOREIGN KEY ("demande_id") REFERENCES "ic_lycee_demandes"("id") ON DELETE CASCADE;
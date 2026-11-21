/**
 * Logique métier IC LYCÉE partagée entre le gestionnaire de formulaires
 * (Netlify Function) et l'API de gestion (Netlify Server).
 */

export const FORFAITS: Record<string, { nom: string; montant: number }> = {
  essentiel: { nom: "Essentiel", montant: 25000 },
  performance: { nom: "Performance", montant: 45000 },
  excellence: { nom: "Excellence BAC/BEPC", montant: 75000 },
  stage: { nom: "Stage Vacances", montant: 60000 },
};

/** Retrouve le forfait à partir de la valeur envoyée par le formulaire. */
export function resolveForfait(value: string): { nom: string; montant: number } {
  const v = normalize(value);
  if (v.includes("excellence")) return FORFAITS.excellence;
  if (v.includes("performance")) return FORFAITS.performance;
  if (v.includes("stage")) return FORFAITS.stage;
  if (v.includes("essentiel")) return FORFAITS.essentiel;
  return { nom: value || "Non précisé", montant: 0 };
}

export const PROF_STATUTS = ["En attente", "Certifié", "Actif", "Suspendu"] as const;
export const PAIEMENT_STATUTS = ["En attente", "1ère tranche", "Payé", "Retard"] as const;
export const PLANNING_STATUTS = ["Planifié", "Effectué", "Reporté", "Annulé"] as const;

/** Minuscules, sans accents ni espaces superflus — pour comparer des libellés. */
export function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Les cases à cocher sont regroupées côté navigateur en « A · B · C ». */
export function splitList(value: unknown): string[] {
  return String(value ?? "")
    .split(/\s*[·,;|\n]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Valeur texte d'un champ (les fichiers peuvent arriver sous forme d'objet). */
export function fieldText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    if (typeof v.url === "string") return v.url;
  }
  return String(value).trim();
}

type ProfLike = {
  id: number;
  nom: string;
  ville: string;
  matieres: string[];
  niveaux: string[];
  mode: string;
  statut: string;
};

type DemandeLike = {
  classe: string;
  matieres: string[];
  ville: string;
  mode: string;
};

export type Match<P> = {
  prof: P;
  score: number;
  criteres: { matiere: boolean; niveau: boolean; mode: boolean; ville: boolean };
  matieresCommunes: string[];
};

function modeCompatible(profMode: string, demandeMode: string): boolean {
  const p = normalize(profMode);
  const d = normalize(demandeMode);
  if (!p || !d || p.includes("deux")) return true;
  const enLigne = d.includes("ligne") || d.includes("visio");
  return enLigne ? p.includes("ligne") : p.includes("presentiel");
}

/**
 * Matching automatique : parmi les profs Certifiés ou Actifs qui enseignent au
 * moins une des matières demandées, classe par niveau, mode puis ville.
 * Exemple : Maths · Terminale C · Libreville · En ligne → 3 profs correspondants.
 */
export function matchProfs<P extends ProfLike>(demande: DemandeLike, profs: P[], limit = 3): Match<P>[] {
  const matieresDemande = demande.matieres.map(normalize);
  const classe = normalize(demande.classe);
  const ville = normalize(demande.ville);
  const presentiel = normalize(demande.mode).includes("presentiel");

  return profs
    .filter((p) => p.statut === "Certifié" || p.statut === "Actif")
    .map((prof) => {
      const communes = prof.matieres.filter((m) => matieresDemande.includes(normalize(m)));
      const niveau = prof.niveaux.some((n) => normalize(n) === classe);
      const mode = modeCompatible(prof.mode, demande.mode);
      const memeVille = !!ville && normalize(prof.ville).includes(ville.split(/[ ,(-]/)[0]);
      const score =
        communes.length * 10 +
        (niveau ? 6 : 0) +
        (mode ? 4 : 0) +
        (memeVille ? (presentiel ? 5 : 2) : 0) +
        (prof.statut === "Actif" ? 1 : 0);
      return {
        prof,
        score,
        criteres: { matiere: communes.length > 0, niveau, mode, ville: memeVille },
        matieresCommunes: communes,
      };
    })
    .filter((m) => m.criteres.matiere && m.criteres.mode && (!presentiel || m.criteres.ville))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

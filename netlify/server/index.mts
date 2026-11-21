/**
 * API de gestion IC LYCÉE — /api/ic-lycee/*
 * Toutes les routes exigent l'en-tête « x-erias-admin » égal au code admin
 * ERIAS (variable d'environnement ERIAS_ADMIN_CODE).
 */
import { createHash, timingSafeEqual } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { icDemandes, icPlanning, icProfs } from "../../db/schema.ts";
import { matchProfs, PAIEMENT_STATUTS, PLANNING_STATUTS, PROF_STATUTS } from "../../lib/ic-lycee.ts";

export const config = {
  path: "/api/*",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const digest = (value: string) => createHash("sha256").update(value).digest();

function isAdmin(req: Request): boolean {
  const expected = process.env.ERIAS_ADMIN_CODE;
  const given = req.headers.get("x-erias-admin") ?? "";
  if (!expected || !given) return false;
  return timingSafeEqual(digest(given), digest(expected));
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

const str = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);
const toId = (v: unknown) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

type Handler = (req: Request, params: Record<string, string>) => Promise<Response>;
const routes: { method: string; regex: RegExp; keys: string[]; handler: Handler }[] = [];
const route = (method: string, pathname: string, handler: Handler) => {
  const keys: string[] = [];
  const source = pathname.replace(/:([a-zA-Z]+)/g, (_m, key) => {
    keys.push(key);
    return "([^/]+)";
  });
  routes.push({ method, regex: new RegExp(`^${source}/?$`), keys, handler });
};

/* ---------------------------------------------------------------- Accès */
route("GET", "/api/ic-lycee/session", async () => json({ ok: true }));

/* ---------------------------------------------------------- Professeurs */
route("GET", "/api/ic-lycee/profs", async () => {
  const profs = await db.select().from(icProfs).orderBy(desc(icProfs.createdAt));
  return json({ profs });
});

route("PATCH", "/api/ic-lycee/profs/:id", async (req, { id }) => {
  const profId = toId(id);
  const { statut } = await readJson(req);
  if (!profId || !PROF_STATUTS.includes(statut as never)) return json({ error: "Statut invalide" }, 400);
  const [prof] = await db
    .update(icProfs)
    .set({ statut: statut as string })
    .where(eq(icProfs.id, profId))
    .returning();
  return prof ? json({ prof }) : json({ error: "Professeur introuvable" }, 404);
});

/* ------------------------------------------------------------- Demandes */
route("GET", "/api/ic-lycee/demandes", async () => {
  const demandes = await db.select().from(icDemandes).orderBy(desc(icDemandes.createdAt));
  return json({ demandes });
});

route("PATCH", "/api/ic-lycee/demandes/:id", async (req, { id }) => {
  const demandeId = toId(id);
  const { statutPaiement } = await readJson(req);
  if (!demandeId || !PAIEMENT_STATUTS.includes(statutPaiement as never)) {
    return json({ error: "Statut de paiement invalide" }, 400);
  }
  const [demande] = await db
    .update(icDemandes)
    .set({ statutPaiement: statutPaiement as string })
    .where(eq(icDemandes.id, demandeId))
    .returning();
  return demande ? json({ demande }) : json({ error: "Demande introuvable" }, 404);
});

route("GET", "/api/ic-lycee/demandes/:id/matching", async (_req, { id }) => {
  const demandeId = toId(id);
  if (!demandeId) return json({ error: "Demande invalide" }, 400);
  const [demande] = await db.select().from(icDemandes).where(eq(icDemandes.id, demandeId));
  if (!demande) return json({ error: "Demande introuvable" }, 404);
  const profs = await db.select().from(icProfs);
  return json({ matches: matchProfs(demande, profs, 3) });
});

route("POST", "/api/ic-lycee/demandes/:id/assigner", async (req, { id }) => {
  const demandeId = toId(id);
  const body = await readJson(req);
  const profId = toId(body.profId);
  if (!demandeId || !profId) return json({ error: "Demande ou professeur invalide" }, 400);

  const [prof] = await db.select().from(icProfs).where(eq(icProfs.id, profId));
  if (!prof) return json({ error: "Professeur introuvable" }, 404);

  const [demande] = await db
    .update(icDemandes)
    .set({ profId })
    .where(eq(icDemandes.id, demandeId))
    .returning();
  if (!demande) return json({ error: "Demande introuvable" }, 404);

  // Première séance ajoutée au planning si une date est fournie
  const date = str(body.date, 10);
  let seance = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    [seance] = await db
      .insert(icPlanning)
      .values({
        date,
        heure: str(body.heure, 5),
        profId,
        demandeId,
        eleve: demande.eleveNom,
        matiere: str(body.matiere, 80) || demande.matieres[0] || "",
        mode: demande.mode,
      })
      .returning();
  }
  return json({ demande, seance });
});

/* ------------------------------------------------------------- Planning */
route("GET", "/api/ic-lycee/planning", async () => {
  const seances = await db
    .select({
      id: icPlanning.id,
      date: icPlanning.date,
      heure: icPlanning.heure,
      eleve: icPlanning.eleve,
      matiere: icPlanning.matiere,
      mode: icPlanning.mode,
      statut: icPlanning.statut,
      profId: icPlanning.profId,
      demandeId: icPlanning.demandeId,
      profNom: icProfs.nom,
      profWhatsapp: icProfs.whatsapp,
    })
    .from(icPlanning)
    .leftJoin(icProfs, eq(icPlanning.profId, icProfs.id))
    .orderBy(icPlanning.date, icPlanning.heure);
  return json({ seances });
});

route("POST", "/api/ic-lycee/planning", async (req) => {
  const body = await readJson(req);
  const date = str(body.date, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: "Date invalide" }, 400);
  const demandeId = toId(body.demandeId);
  let eleve = str(body.eleve, 120);
  let mode = str(body.mode, 60);
  let profId = toId(body.profId);
  if (demandeId) {
    const [demande] = await db.select().from(icDemandes).where(eq(icDemandes.id, demandeId));
    if (!demande) return json({ error: "Demande introuvable" }, 404);
    eleve = eleve || demande.eleveNom;
    mode = mode || demande.mode;
    profId = profId || demande.profId;
  }
  if (!eleve) return json({ error: "Élève manquant" }, 400);
  const [seance] = await db
    .insert(icPlanning)
    .values({ date, heure: str(body.heure, 5), profId, demandeId, eleve, matiere: str(body.matiere, 80), mode })
    .returning();
  return json({ seance }, 201);
});

route("PATCH", "/api/ic-lycee/planning/:id", async (req, { id }) => {
  const seanceId = toId(id);
  const { statut } = await readJson(req);
  if (!seanceId || !PLANNING_STATUTS.includes(statut as never)) return json({ error: "Statut invalide" }, 400);
  const [seance] = await db
    .update(icPlanning)
    .set({ statut: statut as string })
    .where(eq(icPlanning.id, seanceId))
    .returning();
  return seance ? json({ seance }) : json({ error: "Séance introuvable" }, 404);
});

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const matching = routes.filter((r) => r.regex.test(url.pathname));
    if (!matching.length) return json({ error: "Route inconnue" }, 404);

    const found = matching.find((r) => r.method === req.method);
    if (!found) return json({ error: "Méthode non autorisée" }, 405);

    if (!isAdmin(req)) {
      await new Promise((r) => setTimeout(r, 400)); // freine les essais de code
      return json({ error: "Code admin ERIAS invalide" }, 401);
    }

    try {
      const values = found.regex.exec(url.pathname)?.slice(1) ?? [];
      const params = Object.fromEntries(found.keys.map((k, i) => [k, decodeURIComponent(values[i] ?? "")]));
      return await found.handler(req, params);
    } catch (err) {
      console.error("API IC LYCÉE", err);
      return json({ error: "Erreur serveur" }, 500);
    }
  },
};

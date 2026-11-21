import type { FormSubmittedEvent } from "@netlify/functions";
import { db } from "../../db/index.ts";
import { icDemandes, icProfs } from "../../db/schema.ts";
import { fieldText, resolveForfait, splitList } from "../../lib/ic-lycee.ts";

/**
 * Enregistre en base les envois des formulaires IC LYCÉE (vérifiés par Netlify
 * Forms) pour alimenter la page de gestion /ic-lycee/gestion.
 * Les autres formulaires du site restent uniquement dans Netlify Forms.
 */
export default {
  async formSubmitted(event: FormSubmittedEvent) {
    const data = (event.data ?? {}) as Record<string, unknown>;
    const t = (key: string) => fieldText(data[key]);
    const formulaire = t("formulaire") || t("form-name") || t("form_name");
    const reference = t("reference_dossier") || `IC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (formulaire === "recrutement-prof-ic-lycee") {
      await db
        .insert(icProfs)
        .values({
          reference,
          nom: t("nom_prenom") || "Sans nom",
          whatsapp: t("whatsapp"),
          email: t("email"),
          ville: t("ville"),
          statutPro: t("statut"),
          etablissement: t("etablissement"),
          matieres: splitList(t("matieres")),
          niveaux: splitList(t("niveaux")),
          experience: t("experience"),
          certification: t("certification"),
          mode: t("mode"),
          disponibilites: splitList(t("disponibilites")),
          tarifHoraire: t("tarif_horaire"),
          cvUrl: t("cv_diplome"),
          presentation: t("presentation"),
        })
        .onConflictDoNothing({ target: icProfs.reference });
      return;
    }

    if (formulaire === "demande-cours-ic-lycee") {
      // Le montant est recalculé côté serveur à partir du forfait choisi
      const forfait = resolveForfait(t("forfait"));
      await db
        .insert(icDemandes)
        .values({
          reference,
          parentNom: t("nom_parent"),
          eleveNom: t("nom_eleve") || "Élève",
          whatsapp: t("whatsapp_parent"),
          ville: t("ville"),
          classe: t("classe"),
          matieres: splitList(t("matieres")),
          besoin: t("besoin"),
          mode: t("mode"),
          forfait: forfait.nom,
          montant: forfait.montant,
          facilitePaiement: /^oui/i.test(t("facilite_paiement")),
          dateDebut: t("date_debut"),
          message: t("message"),
        })
        .onConflictDoNothing({ target: icDemandes.reference });
    }
  },
};

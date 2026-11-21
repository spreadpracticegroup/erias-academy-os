/**
 * IC LYCÉE — formulaire « Demander un cours » & page de paiement
 * Paiement Mobile Money et preuves : 077 10 96 42 (wa.me/24177109642)
 */
(function () {
  const FORFAITS = {
    'Essentiel': { montant: 25000, matieres: 1, periode: 'mois' },
    'Performance': { montant: 45000, matieres: 2, periode: 'mois' },
    'Excellence BAC/BEPC': { montant: 75000, matieres: 3, periode: 'mois' },
    'Stage Vacances': { montant: 60000, matieres: 1, periode: 'stage' }
  };
  const PAY_NUMBER = '24177109642';

  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const split = (montant) => {
    const first = Math.ceil(montant / 2);
    return [first, montant - first];
  };
  const in15Days = () => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  /* ------------------------------------------------------ DEMANDE DE COURS */
  function initDemande() {
    const form = document.getElementById('formDemandeCours');
    if (!form) return;
    const montantField = form.querySelector('input[name="montant_fcfa"]');
    const note = document.getElementById('dcSplitNote');
    const recap = document.getElementById('dcRecap');
    const hint = document.getElementById('dcMatieresHint');
    const date = form.querySelector('#dcDate');

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    date.min = today.toISOString().slice(0, 10);

    function update() {
      const checked = form.querySelector('input[name="forfait"]:checked');
      const forfait = checked ? FORFAITS[checked.value] : null;
      const facilite = form.querySelector('input[name="facilite_paiement"]:checked');
      montantField.value = forfait ? String(forfait.montant) : '';

      recap.hidden = !forfait;
      if (forfait) {
        document.getElementById('dcRecapNom').textContent = `Forfait ${checked.value}`;
        document.getElementById('dcRecapMontant').textContent = `${fmt(forfait.montant)} F${forfait.periode === 'mois' ? ' / mois' : ''}`;
      }

      if (forfait && facilite && facilite.value === 'Oui') {
        const [a, b] = split(forfait.montant);
        note.textContent = `Tu paieras ${fmt(a)}F maintenant + ${fmt(b)}F dans 15 jours.`;
        note.hidden = false;
      } else {
        note.hidden = true;
      }

      const nb = form.querySelectorAll('[data-check-group="matieres"] input:checked').length;
      if (forfait && nb > forfait.matieres) {
        hint.textContent = `⚠️ Le forfait ${checked.value} inclut ${forfait.matieres} matière${forfait.matieres > 1 ? 's' : ''}. Tu en as choisi ${nb} : on te proposera la formule adaptée.`;
      } else if (forfait) {
        hint.textContent = `Le forfait ${checked.value} inclut ${forfait.matieres} matière${forfait.matieres > 1 ? 's' : ''}.`;
      } else {
        hint.textContent = '';
      }
    }

    form.addEventListener('change', update);
    update();
  }

  /* ------------------------------------------------------------- PAIEMENT */
  function initPaiement() {
    const card = document.getElementById('payCard');
    if (!card) return;
    const params = new URLSearchParams(window.location.search);
    const eleve = (params.get('eleve') || '').trim().slice(0, 80);
    const ref = (params.get('ref') || '').trim().slice(0, 40);
    let nom = params.get('forfait') || '';
    let enDeuxFois = /^oui$/i.test(params.get('facilite') || '');

    const chooser = document.getElementById('payChoose');
    const select = document.getElementById('payForfait');
    if (!FORFAITS[nom]) {
      chooser.hidden = false;
      nom = select.value;
    } else {
      select.value = nom;
    }
    select.addEventListener('change', () => { nom = select.value; render(); });

    if (ref) {
      const refEl = document.getElementById('payRef');
      refEl.textContent = `Dossier n° ${ref}`;
      refEl.hidden = false;
    }

    const motif = eleve ? `IC LYCÉE ${eleve}` : 'IC LYCÉE + Nom Élève';
    document.getElementById('payMotif').textContent = motif;

    const btn = document.getElementById('paySplitBtn');
    btn.addEventListener('click', () => { enDeuxFois = !enDeuxFois; render(); });

    function render() {
      const f = FORFAITS[nom];
      const [a, b] = split(f.montant);
      const aPayer = enDeuxFois ? a : f.montant;
      document.getElementById('payNom').textContent = nom;
      document.getElementById('payAmount').textContent = `${fmt(aPayer)} FCFA`;
      document.getElementById('payMontant').textContent = enDeuxFois
        ? `${fmt(a)} FCFA (1ère tranche)`
        : `${fmt(f.montant)} FCFA`;

      const info = document.getElementById('paySplitInfo');
      info.hidden = !enDeuxFois;
      info.textContent = `Tu paieras ${fmt(a)}F maintenant + ${fmt(b)}F dans 15 jours (le ${in15Days()}).`;
      btn.textContent = enDeuxFois ? 'Payer en une seule fois' : 'Payer en 2 fois';

      const text = `Bonjour IC LYCÉE, voici ma preuve de paiement de ${fmt(aPayer)} FCFA${enDeuxFois ? ' (1ère tranche sur 2)' : ''} pour le Forfait ${nom}. Motif : ${motif}.${ref ? ` Dossier ${ref}.` : ''} (capture jointe)`;
      document.getElementById('payProof').href = `https://wa.me/${PAY_NUMBER}?text=${encodeURIComponent(text)}`;
    }

    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDemande();
    initPaiement();
  });
})();

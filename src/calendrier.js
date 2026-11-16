/**
 * Toiles — calendrier mensuel.
 *
 * Une vue d'ensemble du mois : pour chaque jour, le nombre du jour (universel,
 * et personnel si un profil est choisi) et la phase de la Lune, avec les
 * quatre moments clés de la lunaison (nouvelle lune, premier quartier, pleine
 * lune, dernier quartier) placés sur le jour CIVIL où ils ont lieu.
 *
 * Calcul pur (pas de DOM) : src/app.js dessine la grille.
 * Dépend de : numerologie.js, astres.js.
 */
(function (T) {
  'use strict';

  const NOMS_MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
    'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const JOURS_SEMAINE = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];

  /** Les 4 moments clés : élongation Lune − Soleil visée (en degrés). */
  const LUNAISONS = [
    { cle: 'nouvelle', nom: 'Nouvelle lune', angle: 0, glyphe: '●' },
    { cle: 'premierQuartier', nom: 'Premier quartier', angle: 90, glyphe: '◐' },
    { cle: 'pleine', nom: 'Pleine lune', angle: 180, glyphe: '○' },
    { cle: 'dernierQuartier', nom: 'Dernier quartier', angle: 270, glyphe: '◑' },
  ];

  const deux = (n) => String(n).padStart(2, '0');
  const enChaine = (d) => `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;

  /**
   * Le moment clé de la lunaison qui tombe CE jour-là (entre 0 h et 24 h,
   * heure locale), ou null.
   * Méthode : l'élongation (écart Lune − Soleil) augmente d'environ 12° par jour.
   * On la mesure à minuit et au minuit suivant : si une valeur clé (0°, 90°,
   * 180°, 270°) est franchie entre les deux, l'événement a lieu ce jour-là.
   * Plus juste que « le jour où l'on est le plus près » : on ne peut ni en
   * manquer un, ni en compter deux.
   */
  function lunaisonDuJour(annee, mois, jour) {
    const A = T.astres;
    const debut = A.phaseLunaire(new Date(annee, mois, jour, 0, 0)).elongation;
    const fin = A.phaseLunaire(new Date(annee, mois, jour + 1, 0, 0)).elongation;
    // Avance (en degrés) entre les deux minuits ; +360 si l'on passe par 0°.
    const avance = ((fin - debut) % 360 + 360) % 360;
    for (const l of LUNAISONS) {
      const aParcourir = ((l.angle - debut) % 360 + 360) % 360;
      if (aParcourir > 0 && aParcourir <= avance) return l;
      if (aParcourir === 0) return l; // tombé pile à minuit : on le compte ce jour-là
    }
    return null;
  }

  /**
   * Le mois à afficher.
   * annee, mois : mois JavaScript (0 = janvier).
   * naissance : Date ou null ; datesJournal : Set de 'AAAA-MM-JJ' (facultatif).
   * Renvoie { titre, entetes, semaines: [[jour | null] × 7], lunaisons: [jour…] }
   * jour = { date, numero, jourUniversel, jourPersonnel, illumination, croissante, lunaison, journal }
   * Les semaines commencent le lundi (usage français, et cohérent avec la semaine ISO).
   */
  function mois(annee, moisJS, naissance = null, datesJournal = new Set()) {
    const N = T.numerologie, A = T.astres;
    const nbJours = new Date(annee, moisJS + 1, 0).getDate();
    // Décalage du 1er : lundi → 0 … dimanche → 6.
    const decalage = (new Date(annee, moisJS, 1).getDay() + 6) % 7;

    const jours = [];
    for (let j = 1; j <= nbJours; j++) {
      const date = new Date(annee, moisJS, j, 12); // midi : la lecture est « par jour »
      const lune = A.phaseLunaire(date);
      jours.push({
        date: enChaine(date),
        numero: j,
        jourUniversel: N.jourUniversel(date),
        jourPersonnel: naissance ? N.jourPersonnel(date, naissance) : null,
        illumination: lune.illumination,
        croissante: lune.croissante,
        lunaison: lunaisonDuJour(annee, moisJS, j),
        journal: datesJournal.has(enChaine(date)),
      });
    }

    const cases = [...Array(decalage).fill(null), ...jours];
    while (cases.length % 7) cases.push(null);
    const semaines = [];
    for (let i = 0; i < cases.length; i += 7) semaines.push(cases.slice(i, i + 7));

    return {
      titre: `${NOMS_MOIS[moisJS]} ${annee}`,
      annee, mois: moisJS,
      entetes: JOURS_SEMAINE,
      semaines,
      lunaisons: jours.filter((j) => j.lunaison),
    };
  }

  T.calendrier = { mois, lunaisonDuJour, LUNAISONS, NOMS_MOIS };
})(globalThis.Toiles = globalThis.Toiles || {});

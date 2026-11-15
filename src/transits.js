/**
 * Toiles — module Transits personnels
 *
 * Compare la position actuelle des planètes dans le ciel (astres en transit)
 * avec les positions planétaires de naissance d'un profil (thème natal).
 *
 * Principes et choix astronomiques / astrologiques :
 * 1. Distinction ciel collectif vs transits personnels :
 *    Le ciel collectif donne la « météo générale » commune à tous.
 *    Les transits personnels individualisent cette météo : ils identifient quels
 *    astres célestes viennent résonner directement avec les positions fixes du thème natal.
 *
 * 2. Orbes resserrés (1° à 3°) :
 *    Dans un thème natal isolé ou dans le ciel collectif, les orbes atteignent souvent 7° à 8°.
 *    Pour les transits quotidiens, un orbe aussi large saturerait la vue de dizaines
 *    d'aspects mineurs permanents. Toiles applique des orbes stricts (1° à 3°) pour isoler
 *    les configurations tangibles et actives.
 *
 * 3. Hiérarchie et priorité des planètes lentes :
 *    - La Lune met quelques heures pour traverser un aspect (transit fugace).
 *    - Le Soleil, Mercure et Vénus mettent 2 à 3 jours (déclencheurs ou humeurs passagères).
 *    - Mars met 1 à 2 semaines (période d'action ou de tension).
 *    - Les planètes lentes (Jupiter, Saturne, Uranus, Neptune) mettent plusieurs semaines,
 *      plusieurs mois voire plus d'un an (surtout lors de leurs rétrogradations).
 *      Elles marquent les tournants de vie, les restructurations et les leçons profondes.
 *    Toiles trie donc systématiquement les transits en affichant les planètes lentes en tête.
 */
(function (T) {
  'use strict';

  // Aspects majeurs retenus pour les transits, avec leurs orbes resserrés (1° à 3°)
  const ASPECTS = [
    { nom: 'Conjonction', angle: 0, orbe: 3.0, nature: 'fusion', glyphe: '☌' },
    { nom: 'Sextile', angle: 60, orbe: 2.0, nature: 'harmonie', glyphe: '⚹' },
    { nom: 'Carré', angle: 90, orbe: 2.5, nature: 'tension', glyphe: '□' },
    { nom: 'Trigone', angle: 120, orbe: 2.5, nature: 'harmonie', glyphe: '△' },
    { nom: 'Opposition', angle: 180, orbe: 3.0, nature: 'tension', glyphe: '☍' },
  ];

  // Échelle de lenteur (priorité d'affichage des astres célestes en transit)
  // Plus l'astre est lent, plus son cycle d'influence est durable et structurant.
  const LENTEUR = {
    neptune: 5,
    uranus:  5,
    saturne: 4,
    jupiter: 4,
    mars:    3,
    soleil:  2,
    venus:   2,
    mercure: 2,
    lune:    1,
  };

  const CATEGORIES = {
    neptune: { type: 'lente', libelle: 'Cycle long', duree: 'Plusieurs mois / années' },
    uranus:  { type: 'lente', libelle: 'Cycle long', duree: 'Plusieurs mois' },
    saturne: { type: 'lente', libelle: 'Cycle long', duree: 'Plusieurs semaines à mois' },
    jupiter: { type: 'lente', libelle: 'Cycle long', duree: 'Plusieurs semaines' },
    mars:    { type: 'intermediaire', libelle: 'Moyen', duree: '1 à 2 semaines' },
    soleil:  { type: 'rapide', libelle: 'Passager', duree: '2 à 3 jours' },
    venus:   { type: 'rapide', libelle: 'Passager', duree: '2 à 3 jours' },
    mercure: { type: 'rapide', libelle: 'Passager', duree: '1 à 2 jours' },
    lune:    { type: 'fugace', libelle: 'Fugace', duree: 'Quelques heures' },
  };

  /**
   * Calcule les transits actifs entre un ciel donné et un thème natal.
   *
   * @param {Date|Array} dateOuPositionsCiel - Date du ciel ou tableau de positions
   * @param {Date|string|Object} dateOuThemeNatal - Date/chaine de naissance ou objet thème natal
   * @param {Object} [options] - Options (ex. { orbeMax: 3 })
   * @returns {{ dateCiel: Date, themeNatal: Object, transits: Array }}
   */
  function calculer(dateOuPositionsCiel, dateOuThemeNatal, options = {}) {
    const A = T.astres;
    if (!A) throw new Error('Le module Astres doit être chargé avant Transits.');

    // 1. Positions du ciel étudié
    let dateCiel, posCiel;
    if (Array.isArray(dateOuPositionsCiel)) {
      posCiel = dateOuPositionsCiel;
      dateCiel = new Date();
    } else {
      dateCiel = dateOuPositionsCiel instanceof Date ? dateOuPositionsCiel : new Date(dateOuPositionsCiel);
      posCiel = A.positions(dateCiel);
    }

    // 2. Thème natal de référence
    let theme;
    if (dateOuThemeNatal && Array.isArray(dateOuThemeNatal.positions)) {
      theme = dateOuThemeNatal;
    } else {
      theme = A.themeNatal(dateOuThemeNatal);
    }
    const posNatal = theme.positions;

    // 3. Détection des aspects inter-cartes (ciel × natal)
    const liste = [];
    for (const c of posCiel) {
      for (const n of posNatal) {
        let brut = Math.abs(c.lon - n.lon);
        let sep = brut > 180 ? 360 - brut : brut;

        for (const asp of ASPECTS) {
          const ecart = Math.abs(sep - asp.angle);
          const orbeRetenu = options.orbeMax ? Math.min(asp.orbe, options.orbeMax) : asp.orbe;

          if (ecart <= orbeRetenu) {
            const force = 1 - ecart / orbeRetenu;
            liste.push({
              transitant: c.cle,
              natal: n.cle,
              nom: asp.nom,
              glyphe: asp.glyphe,
              angle: asp.angle,
              nature: asp.nature,
              orbe: orbeRetenu,
              ecart,
              force,
              exact: ecart <= 0.5,
              poidsLenteur: LENTEUR[c.cle] || 1,
              categorie: CATEGORIES[c.cle] || { type: 'rapide', libelle: 'Passager', duree: 'Quelques jours' },
              posTransitant: c,
              posNatal: n,
            });
          }
        }
      }
    }

    // 4. Tri par importance :
    // - En priorité : les planètes célestes les plus lentes (cycles structurants)
    // - En cas d'égalité de lenteur : l'importance de l'astre natal récepteur (Luminaires Soleil/Lune en tête)
    // - En cas d'égalité : l'exactitude de l'aspect (écart le plus faible / force maximale)
    liste.sort((a, b) => {
      if (b.poidsLenteur !== a.poidsLenteur) return b.poidsLenteur - a.poidsLenteur;
      const pNatalA = A.ASTRES[a.natal]?.poids || 1;
      const pNatalB = A.ASTRES[b.natal]?.poids || 1;
      if (pNatalB !== pNatalA) return pNatalB - pNatalA;
      return a.ecart - b.ecart;
    });

    return {
      dateCiel,
      themeNatal: theme,
      transits: liste,
    };
  }

  const f1 = (x) => x.toFixed(1).replace('.', ',');

  /**
   * Étapes détaillées du calcul d'un transit (pédagogie pas à pas).
   * Renvoie une liste de phrases pour « Voir le calcul ».
   */
  function expliquer(t) {
    const A = T.astres;
    const c = t.posTransitant, n = t.posNatal;
    const brut = Math.abs(c.lon - n.lon);
    const sep = brut > 180 ? 360 - brut : brut;

    return [
      `${A.ASTRES[c.cle].nom} céleste (dans le ciel aujourd’hui) est à ${f1(c.lon)}° (${f1(c.signe.degre)}° en ${c.signe.nom})${c.retrograde ? ' ℞ rétrograde' : ''}.`,
      `${A.ASTRES[n.cle].nom} natal (à ta naissance) est à ${f1(n.lon)}° (${f1(n.signe.degre)}° en ${n.signe.nom}).`,
      `Écart sur le zodiaque : |${f1(c.lon)} − ${f1(n.lon)}| = ${f1(brut)}°` +
        (brut > 180 ? ` ; plus court chemin : 360 − ${f1(brut)} = ${f1(sep)}°.` : '.'),
      `Aspect visé : ${t.nom.toLowerCase()} (${t.angle}°) → écart à l’exact : |${f1(sep)} − ${t.angle}| = ${f1(t.ecart)}°.`,
      `Orbe resserré des transits : ${f1(t.orbe)}° → écart ${f1(t.ecart)}° ≤ ${f1(t.orbe)}° : aspect retenu.`,
      `Force du transit : 1 − ${f1(t.ecart)} ÷ ${f1(t.orbe)} = ${Math.round(t.force * 100)} % (100 % = transit exact, au sommet de son action).`,
      `Rythme : ${t.categorie.libelle} (${t.categorie.duree}).`,
    ];
  }

  T.transits = {
    calculer,
    transits: calculer,
    expliquer,
    ASPECTS,
    LENTEUR,
    CATEGORIES,
  };
})(globalThis.Toiles = globalThis.Toiles || {});

/**
 * Toiles — points complémentaires du ciel : Pluton, Chiron, nœuds lunaires,
 * et comparaison avec le zodiaque sidéral.
 *
 * Pourquoi un module à part, et pas trois lignes de plus dans src/astres.js ?
 * Les 9 astres de Toiles (Soleil → Neptune) nourrissent TOUT le reste : teinte
 * du jour, équilibre des éléments, aspects, transits, lecture croisée, textes
 * « planète en signe ». Ajouter Pluton, Chiron ou les nœuds à cette liste
 * changerait toutes ces lectures d'un coup (et demanderait 36 textes de plus).
 * Convention Toiles : ces points sont CALCULÉS et AFFICHÉS (table, carte du ciel,
 * thème natal, maisons), mais ils ne votent pas dans la teinte ni les aspects.
 *
 * Précision (vérifiée dans tests/tests.js contre des dates publiées) :
 *   - Pluton : série de Paul Schlyter (même source que les autres planètes),
 *     < 0,1° entre 1900 et 2100 ;
 *   - Chiron : orbite képlérienne « figée » (éléments osculateurs de 1996),
 *     ~0,5° entre 1975 et 2030, l'erreur grandit hors de cette fenêtre ;
 *   - nœuds : nœud MOYEN de Meeus (chap. 47), à ±1,5° du nœud « vrai ».
 *
 * Dépend de : astres.js (longitude du Soleil, jour julien, signes).
 */
(function (T) {
  'use strict';

  const RAD = Math.PI / 180;
  const norm = (a) => ((a % 360) + 360) % 360;
  const sin = (d) => Math.sin(d * RAD);
  const cos = (d) => Math.cos(d * RAD);
  const atan2 = (y, x) => Math.atan2(y, x) / RAD;

  /** Jours depuis l'époque de Schlyter (31 déc. 1999, 0 h TU). */
  const jourSchlyter = (date) => T.astres.jourJulien(date) - 2451543.5;

  /** Les points complémentaires, dans l'ordre d'affichage. */
  const POINTS = {
    pluton:    { nom: 'Pluton', glyphe: '♇', theme: 'transformation, pouvoir' },
    chiron:    { nom: 'Chiron', glyphe: '⚷', theme: 'blessure, soin' },
    noeudNord: { nom: 'Nœud Nord', glyphe: '☊', theme: 'direction à développer' },
    noeudSud:  { nom: 'Nœud Sud', glyphe: '☋', theme: 'acquis, habitudes' },
  };

  /**
   * Passe d'une position héliocentrique (x, y, z en UA, plan de l'écliptique)
   * à la longitude GÉOCENTRIQUE : on ajoute le vecteur Terre → Soleil.
   * C'est le même changement de repère que pour les planètes de src/astres.js.
   */
  function versGeocentrique(h, date) {
    const d = jourSchlyter(date);
    const lonSoleil = T.astres.longitude('soleil', date);
    // Distance Terre-Soleil (UA) : 1 ± 0,017 selon la saison (orbite légèrement elliptique).
    const Ms = 356.047 + 0.9856002585 * d;
    const rSoleil = 1.00014 - 0.01671 * cos(Ms) - 0.00014 * cos(2 * Ms);
    return norm(atan2(h.y + rSoleil * sin(lonSoleil), h.x + rSoleil * cos(lonSoleil)));
  }

  // ---------- Pluton ----------
  /**
   * Pluton a une orbite si inclinée (17°) et si perturbée par Neptune qu'une
   * ellipse fixe dériverait vite. Schlyter fournit donc directement une SÉRIE :
   * la longitude, la latitude et la distance sont des sommes de sinus et cosinus
   * de deux angles qui tournent lentement (P pour Pluton, S pour Saturne).
   * Valable de 1800 à 2100 environ.
   */
  function plutonHeliocentrique(date) {
    const d = jourSchlyter(date);
    const S = 50.03 + 0.033459652 * d;
    const P = 238.95 + 0.003968789 * d;
    const lon = 238.9508 + 0.00400703 * d
      - 19.799 * sin(P) + 19.848 * cos(P) + 0.897 * sin(2 * P) - 4.956 * cos(2 * P)
      + 0.610 * sin(3 * P) + 1.211 * cos(3 * P) - 0.341 * sin(4 * P) - 0.190 * cos(4 * P)
      + 0.128 * sin(5 * P) - 0.034 * cos(5 * P) - 0.038 * sin(6 * P) + 0.031 * cos(6 * P)
      + 0.020 * sin(S - P) - 0.010 * cos(S - P);
    const lat = -3.9082
      - 5.453 * sin(P) - 14.975 * cos(P) + 3.527 * sin(2 * P) + 1.673 * cos(2 * P)
      - 1.051 * sin(3 * P) + 0.328 * cos(3 * P) + 0.179 * sin(4 * P) - 0.292 * cos(4 * P)
      + 0.019 * sin(5 * P) + 0.100 * cos(5 * P) - 0.031 * sin(6 * P) - 0.026 * cos(6 * P)
      + 0.011 * cos(S - P);
    const r = 40.72
      + 6.68 * sin(P) + 6.90 * cos(P) - 1.18 * sin(2 * P) - 0.03 * cos(2 * P)
      + 0.15 * sin(3 * P) - 0.14 * cos(3 * P);
    return { x: r * cos(lat) * cos(lon), y: r * cos(lat) * sin(lon), z: r * sin(lat) };
  }

  // ---------- Chiron ----------
  /**
   * Chiron (découvert en 1977) tourne entre Saturne et Uranus sur une orbite
   * très allongée (excentricité 0,38) : en 50 ans, il passe 7 ans dans certains
   * signes et 1 an et demi dans d'autres.
   * Aucune série compacte n'existe : on fige ses éléments orbitaux à son passage
   * au périhélie (14 février 1996) et on résout l'équation de Kepler, comme pour
   * les planètes. Saturne et Uranus déforment peu à peu cette orbite : la
   * précision se dégrade lentement loin de 1996 (voir les tests).
   */
  const CHIRON = {
    N: 209.38,          // longitude du nœud ascendant (°)
    i: 6.935,           // inclinaison (°)
    w: 339.43,          // argument du périhélie (°)
    a: 13.648,          // demi-grand axe (UA)
    e: 0.3801,          // excentricité
    jdPerihelie: 2450128.5, // 14/02/1996, 0 h TU
  };

  function chironHeliocentrique(date) {
    const { N, i, w, a, e, jdPerihelie } = CHIRON;
    // Mouvement moyen (°/jour) par la 3e loi de Kepler : n = 0,9856° / a^1,5.
    const n = 0.9856076686 / Math.pow(a, 1.5);
    const M = norm(n * (T.astres.jourJulien(date) - jdPerihelie));
    // Équation de Kepler par Newton-Raphson (E en degrés), voir positionOrbitale() de src/astres.js.
    let E = M + (e / RAD) * sin(M) * (1 + e * cos(M));
    for (let k = 0; k < 30; k++) {
      const dE = (E - (e / RAD) * sin(E) - M) / (1 - e * cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-7) break;
    }
    const xv = a * (cos(E) - e);
    const yv = a * Math.sqrt(1 - e * e) * sin(E);
    const v = atan2(yv, xv), r = Math.hypot(xv, yv);
    return {
      x: r * (cos(N) * cos(v + w) - sin(N) * sin(v + w) * cos(i)),
      y: r * (sin(N) * cos(v + w) + cos(N) * sin(v + w) * cos(i)),
      z: r * sin(v + w) * sin(i),
    };
  }

  // ---------- Nœuds lunaires ----------
  /**
   * Les nœuds sont les deux points où l'orbite de la Lune coupe l'écliptique.
   * Le Nœud Nord est celui où la Lune passe du sud au nord ; le Nœud Sud lui est
   * exactement opposé (+180°). Ce ne sont pas des corps : juste des croisements.
   * Ils RECULENT dans le zodiaque (≈ 19,3° par an, un tour en 18,6 ans), sous
   * l'effet du Soleil qui fait pivoter le plan de l'orbite lunaire.
   *
   * Formule : nœud moyen de Meeus (Astronomical Algorithms, éq. 47.7), avec T
   * en siècles juliens depuis J2000 :
   *   Ω = 125,0445479 − 1934,1362891 T + 0,0020754 T² + T³/467441 − T⁴/60616000
   * Le nœud « vrai » oscille autour de cette valeur de ±1,5° ; beaucoup de
   * logiciels proposent les deux. Toiles retient le nœud moyen (plus régulier,
   * et le plus utilisé dans les manuels d'initiation).
   */
  function noeudMoyen(date) {
    const t = (T.astres.jourJulien(date) - 2451545.0) / 36525;
    return norm(125.0445479 - 1934.1362891 * t + 0.0020754 * t * t + t ** 3 / 467441 - t ** 4 / 60616000);
  }

  /** Longitude géocentrique d'un point complémentaire à une date. */
  function longitude(cle, date) {
    if (cle === 'pluton') return versGeocentrique(plutonHeliocentrique(date), date);
    if (cle === 'chiron') return versGeocentrique(chironHeliocentrique(date), date);
    if (cle === 'noeudNord') return noeudMoyen(date);
    if (cle === 'noeudSud') return norm(noeudMoyen(date) + 180);
    throw new Error(`Point inconnu : ${cle}`);
  }

  /**
   * Positions des 4 points, au même format que Toiles.astres.positions().
   * Rétrograde : comme pour les planètes, la longitude diminue sur ±12 h.
   * Les nœuds moyens reculent toujours : ils sont donc toujours « ℞ »,
   * ce qui est normal (on le dit dans leur fiche).
   */
  function positions(date) {
    const DEMI_JOUR = 43200000;
    return Object.keys(POINTS).map((cle) => {
      const lon = longitude(cle, date);
      let delta = longitude(cle, new Date(date.getTime() + DEMI_JOUR)) - longitude(cle, new Date(date.getTime() - DEMI_JOUR));
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      return { cle, ...POINTS[cle], lon, retrograde: delta < 0, signe: T.astres.signe(lon), complement: true };
    });
  }

  // ---------- Zodiaque sidéral ----------
  /**
   * Le zodiaque TROPICAL (celui de Toiles) commence au point vernal : la position
   * du Soleil à l'équinoxe de printemps. Le zodiaque SIDÉRAL (astrologie indienne,
   * et certains astrologues occidentaux) commence par rapport aux étoiles fixes.
   * À cause de la précession des équinoxes (l'axe de la Terre tourne comme une
   * toupie, un tour en ~25 800 ans), le point vernal recule de 50,29″ par an
   * devant les étoiles : l'écart entre les deux zodiaques grandit lentement.
   * Cet écart s'appelle l'AYANAMSA. Il n'existe pas de point de départ « vrai » :
   * chaque école choisit le sien, d'où plusieurs ayanamsas.
   *
   * Valeurs au 1er janvier 2000 (J2000), puis dérive linéaire de 50,29″/an
   * (précision ~1′ sur un siècle, bien en dessous du degré affiché).
   */
  const AYANAMSAS = {
    lahiri: { nom: 'Lahiri', valeurJ2000: 23.853, ecole: 'officielle en Inde (Commission de réforme du calendrier, 1955)' },
    faganBradley: { nom: 'Fagan-Bradley', valeurJ2000: 24.740, ecole: 'la plus répandue chez les sidéralistes occidentaux' },
  };
  const PRECESSION_PAR_AN = 50.29 / 3600; // degrés par an

  /** Ayanamsa (en degrés) à une date, pour l'école choisie. */
  function ayanamsa(date, ecole = 'lahiri') {
    const A = AYANAMSAS[ecole];
    if (!A) throw new Error(`Ayanamsa inconnu : ${ecole}`);
    const annees = (T.astres.jourJulien(date) - 2451545.0) / 365.25;
    return A.valeurJ2000 + PRECESSION_PAR_AN * annees;
  }

  /** Longitude sidérale = longitude tropicale − ayanamsa. */
  const versSideral = (lonTropicale, date, ecole = 'lahiri') => norm(lonTropicale - ayanamsa(date, ecole));

  /**
   * Tableau de comparaison tropical / sidéral pour une liste de positions.
   * Renvoie [{ cle, nom, glyphe, tropical: signe, sideral: signe, change }].
   * change : vrai si l'astre n'est pas dans le même signe (c'est le cas
   * environ 4 fois sur 5, puisque l'écart dépasse 24° sur des signes de 30°).
   */
  function comparerSideral(pos, date, ecole = 'lahiri') {
    return pos.map((p) => {
      const sid = T.astres.signe(versSideral(p.lon, date, ecole));
      return { cle: p.cle, nom: p.nom, glyphe: p.glyphe, tropical: p.signe, sideral: sid, change: sid.index !== p.signe.index };
    });
  }

  T.complements = {
    POINTS, AYANAMSAS, CHIRON,
    longitude, positions, noeudMoyen,
    ayanamsa, versSideral, comparerSideral,
  };
})(globalThis.Toiles = globalThis.Toiles || {});

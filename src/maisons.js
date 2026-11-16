/**
 * Toiles — module Maisons : temps sidéral, Ascendant, Milieu du Ciel et domification.
 *
 * Calcul pur (sans DOM). Les textes des maisons sont dans src/glossaire.js
 * (entrées maison1 … maison12), le passage heure légale → TU dans src/villes.js.
 *
 * L'idée en trois phrases :
 *   - les planètes donnent le « quoi » (signe) ; les maisons donnent le « où » (domaine de vie) ;
 *   - les maisons découpent le ciel LOCAL, vu depuis le lieu de naissance : elles tournent
 *     d'un tour complet en 24 h, d'où le besoin de l'heure exacte (4 min ≈ 1°) ;
 *   - l'Ascendant est le degré du zodiaque qui se lève à l'horizon est à cet instant ;
 *     le Milieu du Ciel (MC) est celui qui culmine au méridien, plein sud.
 *
 * Système de maisons : Placidus (le plus utilisé en France et dans les logiciels courants).
 * Au-delà des cercles polaires, Placidus n'a plus de solution (certains degrés ne se
 * lèvent jamais) : Toiles bascule alors en maisons égales et le signale.
 */
(function (T) {
  'use strict';

  const RAD = Math.PI / 180;
  const norm = (a) => ((a % 360) + 360) % 360;
  const sin = (d) => Math.sin(d * RAD);
  const cos = (d) => Math.cos(d * RAD);
  const tan = (d) => Math.tan(d * RAD);
  const asin = (x) => Math.asin(x) / RAD;
  const atan2 = (y, x) => Math.atan2(y, x) / RAD;

  /** Jour julien d'une Date (TU). */
  const jourJulien = (date) => date.getTime() / 86400000 + 2440587.5;
  /** Siècles juliens depuis J2000.0 (1er janvier 2000, 12 h TU). */
  const siecles = (jj) => (jj - 2451545) / 36525;

  /**
   * Temps sidéral de Greenwich, en degrés (Meeus, « Astronomical Algorithms », formule 12.4).
   *
   * Pourquoi « sidéral » ? Notre horloge suit le Soleil : 24 h entre deux midis.
   * Mais pendant ce temps la Terre a avancé d'environ 1° sur son orbite autour du Soleil ;
   * par rapport aux étoiles (et donc au zodiaque), elle a fait un peu plus d'un tour :
   * 360,9856°. Le temps sidéral mesure cette rotation par rapport aux étoiles :
   * il dit quel point du ciel passe au méridien de Greenwich.
   */
  function tempsSideralGreenwich(date) {
    const jj = jourJulien(date);
    const t = siecles(jj);
    return norm(280.46061837 + 360.98564736629 * (jj - 2451545) + 0.000387933 * t * t - (t * t * t) / 38710000);
  }

  /** Obliquité de l'écliptique (inclinaison de l'axe terrestre), en degrés : ≈ 23,44°. */
  const obliquite = (date) => 23.4392911 - 0.0130042 * siecles(jourJulien(date));

  /**
   * Milieu du Ciel : le degré du zodiaque qui passe au méridien (culmine).
   * RAMC = ascension droite du méridien = temps sidéral local, en degrés.
   * On convertit cet angle mesuré sur l'équateur en longitude sur l'écliptique,
   * inclinée de ε : tan(MC) = tan(RAMC) / cos(ε). atan2 choisit le bon quadrant.
   */
  const milieuDuCiel = (ramc, eps) => norm(atan2(sin(ramc), cos(ramc) * cos(eps)));

  /**
   * Ascendant : le degré du zodiaque qui se lève à l'horizon est.
   * Formule classique : ASC = atan2(cos RAMC, −(sin RAMC · cos ε + tan φ · sin ε)),
   * où φ est la latitude. La latitude compte parce que l'horizon est d'autant plus
   * incliné sur l'écliptique que l'on va vers les pôles : c'est pourquoi certains signes
   * « se lèvent » en moins d'une heure à Paris, d'autres en près de trois heures.
   */
  const ascendant = (ramc, eps, lat) => norm(atan2(cos(ramc), -(sin(ramc) * cos(eps) + tan(lat) * sin(eps))));

  /** Longitude écliptique du point de l'écliptique d'ascension droite donnée. */
  const longitudeDepuisAscension = (ad, eps) => norm(atan2(sin(ad), cos(ad) * cos(eps)));

  /**
   * Une cuspide de Placidus (maisons 11, 12, 2 et 3), par itération.
   *
   * Principe de Placidus : chaque degré du zodiaque met un certain temps à aller de
   * l'horizon (lever) au méridien (culmination) : c'est son « arc semi-diurne » (ASD).
   * Les maisons découpent ce TEMPS en trois parts égales, pas l'espace :
   *   - cuspide 11 : le degré qui a parcouru 1/3 de son arc entre lever et culmination ;
   *   - cuspide 12 : 2/3 ;
   *   - cuspides 2 et 3 : même chose sous l'horizon, avec l'arc semi-nocturne (180° − ASD).
   *
   * Mais l'arc dépend de la déclinaison du degré cherché… qu'on ne connaît pas encore.
   * On part d'une estimation, on calcule le degré, sa déclinaison, son arc, puis on
   * recommence : en une dizaine de tours, le résultat ne bouge plus.
   *
   * fraction : 1/3 ou 2/3 ; dessous : false (maisons 11, 12) ou true (maisons 2, 3).
   * Renvoie la longitude, ou null si Placidus n'a pas de solution (latitude polaire).
   */
  function cuspidePlacidus(ramc, eps, lat, fraction, dessous) {
    // Estimation de départ : comme si chaque arc valait 90° (cas de l'équateur).
    let lon = longitudeDepuisAscension(dessous ? ramc + 180 - (1 - fraction) * 90 : ramc + fraction * 90, eps);
    for (let k = 0; k < 50; k++) {
      const declinaison = asin(sin(eps) * sin(lon));
      const produit = tan(lat) * tan(declinaison);
      if (Math.abs(produit) > 1) return null; // ce degré ne se lève ou ne se couche jamais
      const arcDiurne = 90 + asin(produit);      // arc semi-diurne, en degrés d'ascension droite
      const arcNocturne = 180 - arcDiurne;
      // Au-dessus de l'horizon : on avance depuis le méridien (RAMC) de 1/3 ou 2/3 de l'arc diurne.
      // Sous l'horizon : la cuspide II est à 1/3 de l'arc nocturne après l'Ascendant, la III à 2/3 ;
      // en partant du fond du ciel (RAMC + 180°), cela fait 2/3 et 1/3 de l'arc nocturne en arrière.
      const ascensionDroite = dessous
        ? ramc + 180 - (1 - fraction) * arcNocturne
        : ramc + fraction * arcDiurne;
      const nouvelle = longitudeDepuisAscension(ascensionDroite, eps);
      const ecart = Math.abs(norm(nouvelle - lon + 180) - 180);
      lon = nouvelle;
      if (ecart < 1e-8) break;
    }
    return lon;
  }

  /** Maisons égales : 12 parts de 30° à partir de l'Ascendant. */
  const cuspidesEgales = (asc) => Array.from({ length: 12 }, (_, i) => norm(asc + 30 * i));

  /**
   * Les 12 cuspides de Placidus (index 0 = maison I), ou null si latitude polaire.
   * Les maisons opposées sont à 180° : IV en face de X, VII en face de I, etc.
   */
  function cuspidesPlacidus(ramc, eps, lat) {
    const asc = ascendant(ramc, eps, lat), mc = milieuDuCiel(ramc, eps);
    const c11 = cuspidePlacidus(ramc, eps, lat, 1 / 3, false);
    const c12 = cuspidePlacidus(ramc, eps, lat, 2 / 3, false);
    const c2 = cuspidePlacidus(ramc, eps, lat, 1 / 3, true);
    const c3 = cuspidePlacidus(ramc, eps, lat, 2 / 3, true);
    if ([c11, c12, c2, c3].includes(null)) return null;
    const c = new Array(12);
    c[0] = asc; c[1] = c2; c[2] = c3; c[9] = mc; c[10] = c11; c[11] = c12;
    for (const i of [0, 1, 2, 9, 10, 11]) c[(i + 6) % 12] = norm(c[i] + 180);
    return c;
  }

  /** Numéro de maison (1 à 12) d'une longitude, d'après les cuspides. */
  function maisonDe(lon, cuspides) {
    for (let i = 0; i < 12; i++) {
      const debut = cuspides[i], fin = cuspides[(i + 1) % 12];
      const largeur = norm(fin - debut);
      if (norm(lon - debut) < largeur) return i + 1;
    }
    return 1; // n'arrive pas (les 12 maisons couvrent tout le cercle)
  }

  /**
   * Rattachement des 12 maisons aux 6 domaines de Toiles (convention Toiles).
   * Deux maisons par domaine, chacune dans un seul domaine, pour rester lisible :
   *   essence      : I (soi, élan, apparence) et IV (racines, foyer, intimité)
   *   amour        : V (amours, plaisir, créativité) et VII (couple, partenaires)
   *   travail      : X (carrière, vocation) et III (échanges, apprentissages)
   *   finances     : II (ressources propres) et VIII (ressources partagées, héritages)
   *   sante        : VI (hygiène de vie, quotidien) et XII (repos, épreuves cachées)
   *   spiritualite : IX (philosophie, quête de sens) et XI (idéaux, projets collectifs)
   * La tradition rattache aussi la XII à la spiritualité et la XI aux amitiés :
   * c'est un choix de lisibilité, assumé comme tel (voir la méthodologie).
   */
  const DOMAINES_MAISONS = {
    essence: [1, 4],
    amour: [5, 7],
    travail: [10, 3],
    finances: [2, 8],
    sante: [6, 12],
    spiritualite: [9, 11],
  };

  /** Domaine d'une maison (1 à 12). */
  const domaineDeLaMaison = (n) => Object.keys(DOMAINES_MAISONS).find((d) => DOMAINES_MAISONS[d].includes(n));

  /** Chiffres romains des maisons. */
  const ROMAINS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  /**
   * Les angles et maisons à un instant TU et un lieu.
   * lieu : { lat, lon } (lon + = est). Renvoie :
   *   { tsg, tsl, ramc, eps, asc, mc, cuspides[12], systeme: 'placidus' | 'egales' }
   */
  function angles(instant, lieu) {
    const tsg = tempsSideralGreenwich(instant);
    const ramc = norm(tsg + lieu.lon);           // temps sidéral local, en degrés
    const eps = obliquite(instant);
    const asc = ascendant(ramc, eps, lieu.lat);
    const mc = milieuDuCiel(ramc, eps);
    const placidus = cuspidesPlacidus(ramc, eps, lieu.lat);
    return {
      tsg, tsl: ramc, ramc, eps, asc, mc,
      cuspides: placidus || cuspidesEgales(asc),
      systeme: placidus ? 'placidus' : 'egales',
    };
  }

  /**
   * Thème natal complet d'un profil qui a une heure et un lieu de naissance.
   * profil : { naissance: 'AAAA-MM-JJ', heure: 'HH:MM', lieu: { nom, lat, lon, fuseau } }
   * Renvoie null si l'heure ou le lieu manque. Sinon, en plus de angles() :
   *   conversion : { date (instant TU), decalage, statut } (voir src/villes.js)
   *   theme      : objet au même format que Toiles.astres.themeNatal() (positions, aspects…),
   *                utilisable tel quel par Toiles.transits.calculer() ;
   *   maisons    : [{ numero, romain, cuspide, signe, domaine, astres: [clés] }]
   */
  function calculer(profil) {
    if (!profil || !profil.heure || !profil.lieu) return null;
    const A = T.astres, V = T.villes;
    const conversion = V.heureLegaleVersTU(profil.naissance, profil.heure, profil.lieu.fuseau);
    const instant = conversion.date;
    const ang = angles(instant, profil.lieu);
    const positions = A.positions(instant);

    const maisons = ang.cuspides.map((cuspide, i) => ({
      numero: i + 1,
      romain: ROMAINS[i],
      cuspide,
      signe: A.signe(cuspide),
      domaine: domaineDeLaMaison(i + 1),
      astres: positions.filter((p) => maisonDe(p.lon, ang.cuspides) === i + 1).map((p) => p.cle),
    }));
    for (const p of positions) p.maison = maisonDe(p.lon, ang.cuspides);

    const [a, m, j] = profil.naissance.split('-').map(Number);
    const theme = {
      date: instant, annee: a, mois: m, jour: j,
      positions, aspects: A.aspects(positions),
      heurePrecise: true, luneChangeDeSigne: false, avertissementLune: null,
      soleilChangeDeSigne: false, avertissementSoleil: null,
    };
    return { ...ang, conversion, theme, maisons };
  }

  // ---------- Calcul détaillé (pour apprendre) ----------

  const f2 = (x) => x.toFixed(2).replace('.', ',');
  const f1 = (x) => x.toFixed(1).replace('.', ',');
  /** 98,5° → « 6 h 34 min » (15° = 1 heure sidérale). */
  function enHeures(deg) {
    const minutes = Math.round(norm(deg) / 15 * 60) % 1440;
    return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')} min`;
  }
  const deux = (n) => String(n).padStart(2, '0');
  const heureTU = (d) => `${deux(d.getUTCHours())}:${deux(d.getUTCMinutes())}`;
  const dansSigne = (lon) => { const s = T.astres.signe(lon); return `${Math.floor(s.degre)}° ${s.nom}`; };

  /** Le chemin du calcul en phrases, de l'heure légale aux maisons. r : résultat de calculer(). */
  function expliquer(profil, r) {
    const V = T.villes, c = r.conversion;
    const etat = { normale: '', inexistante: ' (heure sautée au passage à l’heure d’été : on retient le décalage d’hiver)',
      ambigue: ' (heure vécue deux fois au retour à l’heure d’hiver : on retient la première)' }[c.statut];
    const jj = jourJulien(c.date);
    return [
      `Heure légale ${profil.heure} à ${profil.lieu.nom} (fuseau ${profil.lieu.fuseau}) : ce jour-là, ${V.texteDecalage(c.decalage)}${etat} → ${heureTU(c.date)} TU.`,
      `Jour julien (jours écoulés depuis −4712) : ${jj.toFixed(4).replace('.', ',')}.`,
      `Temps sidéral de Greenwich : 280,46° + 360,9856° × (jours depuis le 1/1/2000 à midi) = ${f2(r.tsg)}° (${enHeures(r.tsg)}).`,
      `Temps sidéral local : ${f2(r.tsg)}° ${profil.lieu.lon >= 0 ? '+' : '−'} ${f2(Math.abs(profil.lieu.lon))}° de longitude = ${f2(r.ramc)}° (${enHeures(r.ramc)}).`,
      `Obliquité de l’écliptique ε = ${f2(r.eps)}° ; latitude φ = ${f2(profil.lieu.lat)}°.`,
      `Milieu du Ciel = atan2(sin ${f1(r.ramc)}°, cos ${f1(r.ramc)}° × cos ε) = ${f2(r.mc)}° → ${dansSigne(r.mc)}.`,
      `Ascendant = atan2(cos ${f1(r.ramc)}°, −(sin ${f1(r.ramc)}° × cos ε + tan φ × sin ε)) = ${f2(r.asc)}° → ${dansSigne(r.asc)}.`,
      r.systeme === 'placidus'
        ? 'Maisons de Placidus : les cuspides XI et XII partagent en trois le temps de montée de chaque degré, de l’horizon au méridien ; II et III font de même sous l’horizon. Les six autres sont en face (+180°).'
        : 'Latitude polaire : Placidus n’a pas de solution, Toiles utilise les maisons égales (30° chacune depuis l’Ascendant).',
    ];
  }

  T.maisons = {
    tempsSideralGreenwich, obliquite, ascendant, milieuDuCiel,
    cuspidesPlacidus, cuspidesEgales, maisonDe, angles, calculer, expliquer,
    DOMAINES_MAISONS, domaineDeLaMaison, ROMAINS,
  };
})(globalThis.Toiles = globalThis.Toiles || {});

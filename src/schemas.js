/**
 * Toiles — géométrie des schémas du ciel (calcul pur, sans DOM).
 *
 * Ce module transforme des longitudes (en degrés) en coordonnées (x, y) en pixels
 * pour dessiner deux schémas en SVG :
 *   - la carte géocentrique : la Terre au centre, l'anneau des 12 signes autour ;
 *   - la carte héliocentrique : le Soleil au centre, les orbites des planètes.
 * Le dessin lui-même (les balises <svg>) est fait par src/app.js.
 *
 * Orientation (identique pour les deux schémas, comme un thème astral) :
 *   - 0° (début du Bélier) est à GAUCHE ;
 *   - les longitudes croissent dans le sens INVERSE des aiguilles d'une montre.
 * À l'écran, l'axe y descend : 90° (début du Cancer) se retrouve donc en BAS,
 * 180° (Balance) à droite, 270° (Capricorne) en haut.
 */
(function (T) {
  'use strict';

  const RAD = Math.PI / 180;

  /**
   * Point situé à la longitude `lon` sur un cercle de rayon `rayon` centré en (cx, cy).
   * x = cx − r·cos(lon) : 0° à gauche ; y = cy + r·sin(lon) : 90° en bas.
   * Arrondi au dixième de pixel : largement assez précis pour l'œil, et le SVG reste lisible.
   */
  function pointSurCercle(cx, cy, rayon, lon) {
    const arrondi = (v) => Math.round(v * 10) / 10;
    return { x: arrondi(cx - rayon * Math.cos(lon * RAD)), y: arrondi(cy + rayon * Math.sin(lon * RAD)) };
  }

  /** Écart entre deux longitudes, en tenant compte du tour complet (359° et 1° sont à 2°). */
  function ecartAngulaire(a, b) {
    const d = Math.abs((((a - b) % 360) + 360) % 360);
    return d > 180 ? 360 - d : d;
  }

  // Réglages de la carte géocentrique (en pixels, dans un carré de TAILLE_GEO de côté).
  const GEO = {
    taille: 340,
    rayonExterieur: 160,  // bord extérieur de l'anneau des signes
    rayonInterieur: 128,  // bord intérieur de l'anneau (début des astres)
    rayonAstres: 106,     // cercle où l'on pose les glyphes des astres
    recul: 28,            // décalage vers le centre quand deux astres se chevauchent
    seuilProximite: 12,   // en degrés : en dessous, deux astres se chevaucheraient
  };

  /**
   * Niveaux de recul pour éviter que les glyphes se chevauchent.
   * On parcourt les astres par longitude croissante ; chacun prend le premier
   * niveau (0 = cercle normal, 1 = 28px plus près du centre, 2 = 56px…) où
   * aucun astre déjà placé n'est à moins de `seuil` degrés.
   * Renvoie un objet { cle: niveau }.
   */
  function niveauxDeRecul(positions, seuil) {
    const tries = positions.slice().sort((a, b) => a.lon - b.lon);
    const places = []; // { lon, niveau }
    const niveaux = {};
    for (const p of tries) {
      let niveau = 0;
      while (places.some((q) => q.niveau === niveau && ecartAngulaire(q.lon, p.lon) < seuil)) niveau++;
      places.push({ lon: p.lon, niveau });
      niveaux[p.cle] = niveau;
    }
    return niveaux;
  }

  /**
   * Toute la géométrie de la carte géocentrique.
   * positions : [{ cle, lon }] (ex. le résultat de Toiles.astres.positions(date)).
   * Renvoie :
   *   - taille, centre, rayons de l'anneau ;
   *   - signes : 12 secteurs { index, debut (point du trait de séparation intérieur et extérieur), glyphe (point du milieu) } ;
   *   - astres : { cle, lon, niveau, point (où poser le glyphe), repere (point exact sur l'anneau) }.
   */
  function carteGeocentrique(positions) {
    const c = GEO.taille / 2;
    const rayonGlypheSigne = (GEO.rayonExterieur + GEO.rayonInterieur) / 2;
    const signes = [];
    for (let i = 0; i < 12; i++) {
      signes.push({
        index: i,
        traitInterieur: pointSurCercle(c, c, GEO.rayonInterieur, i * 30),
        traitExterieur: pointSurCercle(c, c, GEO.rayonExterieur, i * 30),
        glyphe: pointSurCercle(c, c, rayonGlypheSigne, i * 30 + 15), // milieu du signe
      });
    }
    const niveaux = niveauxDeRecul(positions, GEO.seuilProximite);
    const astres = positions.map((p) => ({
      cle: p.cle,
      lon: p.lon,
      niveau: niveaux[p.cle],
      point: pointSurCercle(c, c, GEO.rayonAstres - niveaux[p.cle] * GEO.recul, p.lon),
      repere: pointSurCercle(c, c, GEO.rayonInterieur, p.lon),
    }));
    return { taille: GEO.taille, centre: c, rayonExterieur: GEO.rayonExterieur, rayonInterieur: GEO.rayonInterieur, signes, astres };
  }

  // Réglages de la carte héliocentrique : orbites régulièrement espacées
  // (premier rayon 40px, puis +25px). Ce n'est PAS à l'échelle : Neptune est
  // en réalité 77 fois plus loin que Mercure, elle sortirait de l'écran.
  const HELIO = { premierRayon: 40, pas: 25, marge: 16 };

  /**
   * Géométrie de la carte héliocentrique.
   * planetes : [{ cle, lon }] dans l'ordre du Soleil vers l'extérieur
   *            (ex. Toiles.astres.positionsHeliocentriques(date)).
   * Renvoie { taille, centre, orbites: [{ cle, rayon, point }] }.
   */
  function carteHeliocentrique(planetes) {
    const rayonMax = HELIO.premierRayon + HELIO.pas * (planetes.length - 1);
    const taille = 2 * (rayonMax + HELIO.marge);
    const c = taille / 2;
    const orbites = planetes.map((p, i) => {
      const rayon = HELIO.premierRayon + HELIO.pas * i;
      return { cle: p.cle, lon: p.lon, rayon, point: pointSurCercle(c, c, rayon, p.lon) };
    });
    return { taille, centre: c, orbites };
  }

  T.schemas = { pointSurCercle, ecartAngulaire, niveauxDeRecul, carteGeocentrique, carteHeliocentrique, GEO, HELIO };
})(globalThis.Toiles = globalThis.Toiles || {});

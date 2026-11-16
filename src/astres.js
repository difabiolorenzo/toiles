/**
 * Toiles — module Astres
 * Positions géocentriques (zodiaque tropical) du Soleil, de la Lune et des planètes
 * Mercure → Neptune, phases lunaires, rétrogradations, aspects et équilibre des énergies.
 *
 * Méthode : éléments orbitaux de Paul Schlyter ("How to compute planetary positions"),
 * avec les principales perturbations Lune/Jupiter/Saturne.
 * Précision typique : < 0,1° (Soleil), ~0,2–0,5° (Lune), < 1° (planètes) — largement
 * suffisant pour signes, aspects et phases. Pas de dépendance.
 */
(function (T) {
  'use strict';

  const RAD = Math.PI / 180;
  const norm = (a) => ((a % 360) + 360) % 360;
  const sin = (d) => Math.sin(d * RAD);
  const cos = (d) => Math.cos(d * RAD);
  const atan2 = (y, x) => Math.atan2(y, x) / RAD;

  /** Jour julien d'une Date JS (UTC). */
  const jourJulien = (date) => date.getTime() / 86400000 + 2440587.5;
  /** Jours depuis l'époque de Schlyter (31 déc. 1999, 0h TU). */
  const jourSchlyter = (date) => jourJulien(date) - 2451543.5;

  // Éléments : N (nœud), i (inclinaison), w (périhélie), a (demi-grand axe), e, M (anomalie moyenne)
  const ELEMENTS = {
    soleil:  (d) => ({ N: 0, i: 0, w: 282.9404 + 4.70935e-5 * d, a: 1, e: 0.016709 - 1.151e-9 * d, M: 356.047 + 0.9856002585 * d }),
    lune:    (d) => ({ N: 125.1228 - 0.0529538083 * d, i: 5.1454, w: 318.0634 + 0.1643573223 * d, a: 60.2666, e: 0.0549, M: 115.3654 + 13.0649929509 * d }),
    mercure: (d) => ({ N: 48.3313 + 3.24587e-5 * d, i: 7.0047 + 5e-8 * d, w: 29.1241 + 1.01444e-5 * d, a: 0.387098, e: 0.205635 + 5.59e-10 * d, M: 168.6562 + 4.0923344368 * d }),
    venus:   (d) => ({ N: 76.6799 + 2.4659e-5 * d, i: 3.3946 + 2.75e-8 * d, w: 54.891 + 1.38374e-5 * d, a: 0.72333, e: 0.006773 - 1.302e-9 * d, M: 48.0052 + 1.6021302244 * d }),
    mars:    (d) => ({ N: 49.5574 + 2.11081e-5 * d, i: 1.8497 - 1.78e-8 * d, w: 286.5016 + 2.92961e-5 * d, a: 1.523688, e: 0.093405 + 2.516e-9 * d, M: 18.6021 + 0.5240207766 * d }),
    jupiter: (d) => ({ N: 100.4542 + 2.76854e-5 * d, i: 1.303 - 1.557e-7 * d, w: 273.8777 + 1.64505e-5 * d, a: 5.20256, e: 0.048498 + 4.469e-9 * d, M: 19.895 + 0.0830853001 * d }),
    saturne: (d) => ({ N: 113.6634 + 2.3898e-5 * d, i: 2.4886 - 1.081e-7 * d, w: 339.3939 + 2.97661e-5 * d, a: 9.55475, e: 0.055546 - 9.499e-9 * d, M: 316.967 + 0.0334442282 * d }),
    uranus:  (d) => ({ N: 74.0005 + 1.3978e-5 * d, i: 0.7733 + 1.9e-8 * d, w: 96.6612 + 3.0565e-5 * d, a: 19.18171 - 1.55e-8 * d, e: 0.047318 + 7.45e-9 * d, M: 142.5905 + 0.011725806 * d }),
    neptune: (d) => ({ N: 131.7806 + 3.0173e-5 * d, i: 1.77 - 2.55e-7 * d, w: 272.8461 - 6.027e-6 * d, a: 30.05826 + 3.313e-8 * d, e: 0.008606 + 2.15e-9 * d, M: 260.2471 + 0.005995147 * d }),
  };

  /**
   * Position dans le plan de l'orbite képlérienne 3D puis dans l'écliptique → { lon, lat, r }.
   *
   * Pourquoi cet algorithme (résolution de l'équation de Kepler par Newton-Raphson) ?
   * 1. La 2e loi de Kepler (loi des aires) établit qu'une planète accélère au périhélie
   *    (au plus près du Soleil) et ralentit à l'aphélie : sa vitesse angulaire n'est donc pas constante.
   * 2. L'anomalie moyenne M représente la position angulaire linéaire théorique d'un astre
   *    fictif parcourant un cercle parfait à vitesse uniforme. C'est elle que l'on calcule
   *    directement en fonction du temps écoulé (M = M0 + n * d).
   * 3. Pour obtenir la position géométrique réelle sur l'orbite elliptique, on doit trouver
   *    l'anomalie excentrique E, reliée à M par l'équation de Kepler :
   *       M = E - e * sin(E)  (avec E en radians, ou (e / RAD) * sin(E) en degrés).
   *    Cette équation est transcendante : il n'existe aucune formule algébrique directe
   *    permettant d'isoler E en fonction de M et e.
   * 4. On utilise donc la méthode itérative de Newton-Raphson pour trouver le zéro de :
   *       f(E) = E - (e / RAD) * sin(E) - M = 0.
   *    La dérivée par rapport à E est f'(E) = 1 - e * cos(E).
   *    À chaque itération, la correction dE = f(E) / f'(E) est retranchée à l'estimation E.
   *    Grâce à l'estimation de départ de Schlyter (E0 = M + e * sin(M) * (1 + e * cos(M))) et à
   *    la faible excentricité des planètes (e < 0,21), la convergence est quadratique :
   *    2 à 3 itérations suffisent pour atteindre une précision extrême (dE < 1e-6 degré).
   * 5. Une fois E résolu :
   *    - xv et yv sont les coordonnées cartésiennes dans le plan de l'ellipse orbitale ;
   *    - v (anomalie vraie) est l'angle polaire physique réel vu depuis le foyer (le Soleil) ;
   *    - r est la distance physique au foyer (en Unités Astronomiques, ou rayons terrestres pour la Lune).
   * 6. Rotation 3D vers le repère écliptique standard :
   *    L'orbite est inclinée d'un angle i et orientée par son nœud ascendant N et son périhélie w.
   *    L'angle polaire total dans le plan orbital est v + w.
   *    La projection trigonométrique fournit le vecteur (x, y, z) héliocentrique dans le plan
   *    de l'écliptique, d'où l'on extrait la longitude écliptique (lon), la latitude (lat) et le rayon (r).
   */
  function positionOrbitale({ N, i, w, a, e, M }) {
    M = norm(M);
    let E = M + (e / RAD) * sin(M) * (1 + e * cos(M));
    for (let k = 0; k < 10; k++) {
      const dE = (E - (e / RAD) * sin(E) - M) / (1 - e * cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-6) break;
    }
    const xv = a * (cos(E) - e);
    const yv = a * Math.sqrt(1 - e * e) * sin(E);
    const v = atan2(yv, xv);
    const r = Math.hypot(xv, yv);
    const x = r * (cos(N) * cos(v + w) - sin(N) * sin(v + w) * cos(i));
    const y = r * (sin(N) * cos(v + w) + cos(N) * sin(v + w) * cos(i));
    const z = r * sin(v + w) * sin(i);
    return { lon: norm(atan2(y, x)), lat: atan2(z, Math.hypot(x, y)), r };
  }

  /**
   * Correction de la « Grande Inégalité » Jupiter–Saturne (en degrés), à ajouter
   * à leur longitude héliocentrique. Vaut 0 pour les autres planètes.
   * (Explication détaillée : point 4 du commentaire de longitude() ci-dessous.)
   */
  function perturbationJupiterSaturne(nom, d) {
    if (nom !== 'jupiter' && nom !== 'saturne') return 0;
    const Mj = norm(ELEMENTS.jupiter(d).M), Msa = norm(ELEMENTS.saturne(d).M);
    return nom === 'jupiter'
      ? -0.332 * sin(2 * Mj - 5 * Msa - 67.6) - 0.056 * sin(2 * Mj - 2 * Msa + 21) + 0.042 * sin(3 * Mj - 5 * Msa + 21) -
        0.036 * sin(Mj - 2 * Msa) + 0.022 * cos(Mj - Msa) + 0.023 * sin(2 * Mj - 3 * Msa + 52) - 0.016 * sin(Mj - 5 * Msa - 69)
      : 0.812 * sin(2 * Mj - 5 * Msa - 67.6) - 0.229 * cos(2 * Mj - 4 * Msa - 2) + 0.119 * sin(Mj - 2 * Msa - 3) +
        0.046 * sin(2 * Mj - 6 * Msa - 69) + 0.014 * sin(Mj - 3 * Msa + 32);
  }

  /**
   * Position héliocentrique (vue depuis le Soleil) d'une planète → { lon, lat, r }.
   * Cas particulier : la Terre. Schlyter ne donne pas son orbite, mais celle
   * du Soleil vu de la Terre ; la Terre vue du Soleil est simplement à l'opposé (+180°).
   */
  function positionHeliocentrique(nom, d) {
    if (nom === 'terre') {
      const sol = positionOrbitale(ELEMENTS.soleil(d));
      return { lon: norm(sol.lon + 180), lat: 0, r: sol.r };
    }
    const h = positionOrbitale(ELEMENTS[nom](d));
    h.lon = norm(h.lon + perturbationJupiterSaturne(nom, d));
    return h;
  }

  /**
   * Longitude écliptique géocentrique (en degrés, 0° à 360°) d'un astre à l'instant d.
   *
   * Pourquoi la méthode de Paul Schlyter et ces perturbations ?
   * 1. Pourquoi la méthode analytique de Schlyter ?
   *    Les éphémérides professionnelles de haute précision (telles que DE405 de la NASA/JPL
   *    ou les séries VSOP87) reposent sur des tables de milliers de termes de plusieurs mégaoctets.
   *    Pour que Toiles s'exécute sans aucune dépendance, instantanément et par simple double-clic
   *    sur index.html (file://), Paul Schlyter a calibré des équations polynomiales compactes
   *    des éléments orbitaux moyens, comptés depuis sa propre époque : le 31 décembre 1999 à 0h TU
   *    (jour julien 2451543.5). Attention : ce n'est PAS l'époque standard J2000.0 des astronomes,
   *    qui est le 1er janvier 2000 à 12h TT (jour julien 2451545.0), 1,5 jour plus tard.
   *
   * 2. Soleil :
   *    En astrologie géocentrique, le mouvement apparent du Soleil vu de la Terre est l'exact reflet
   *    (à 180° près) du mouvement orbital de la Terre vue du Soleil. Schlyter modélise directement
   *    les éléments de cette orbite relative : sol.lon est donc immédiatement la longitude géocentrique.
   *
   * 3. Lune et perturbations gravitationnelles majeures :
   *    La Lune tourne autour de la Terre, mais le Soleil exerce une attraction gravitationnelle
   *    différentielle puissante sur le système Terre-Lune (problème des trois corps).
   *    Une orbite képlérienne pure accumulerait jusqu'à plus de 5° d'erreur !
   *    On applique donc les 12 termes périodiques majeurs de la théorie lunaire simplifiée de Schlyter :
   *    - D = Lm - Ls : élongation moyenne de la Lune par rapport au Soleil ;
   *    - F = Lm - N  : distance angulaire moyenne au nœud ascendant (argument de latitude) ;
   *    - -1.274° * sin(Mm - 2*D) : l'évection (découverte dès l'Antiquité par Ptolémée). L'attraction
   *      solaire modifie périodiquement l'excentricité de l'orbite lunaire selon l'orientation de ses apsides ;
   *    - +0.658° * sin(2*D) : la variation (découverte par Tycho Brahe). La Lune accélère lorsqu'elle
   *      s'approche des syzygies (nouvelle et pleine lune) et ralentit vers les quartiers ;
   *    - -0.186° * sin(Ms) : l'équation annuelle, causée par la variation de distance Terre-Soleil (la Terre
   *      étant plus proche du Soleil en janvier qu'en juillet) ;
   *    - Les 9 autres termes harmoniques affinent la trajectoire pour garantir une précision de ~0,2° à 0,5°,
   *      largement suffisante pour déterminer le signe zodiacal et la phase lunaire.
   *
   * 4. Planètes et résonance Jupiter-Saturne (« La Grande Inégalité ») :
   *    Jupiter et Saturne renferment à elles deux la quasi-totalité de la masse planétaire du système.
   *    Leurs périodes orbitales sont en quasi-résonance 5:2 (5 tours de Jupiter ≈ 59,3 ans pour 2 tours
   *    de Saturne ≈ 58,9 ans). Cette configuration gravitationnelle mutuelle produit des dérives
   *    périodiques majeures :
   *    - Terme principal en sin(2*Mj - 5*Msa - 67.6°) atteignant +0,812° sur Saturne et -0,332° sur Jupiter.
   *    Sans cette correction, les positions planétaires dérivent de près de 1°, ce qui fausserait
   *    les dates exactes de changement de signe ou les orbes d'aspects.
   *
   * 5. Conversion héliocentrique → géocentrique :
   *    Les coordonnées hélio-centriques h.(x,y,z) calculées par positionOrbitale() décrivent la position
   *    de la planète autour du Soleil.
   *    L'astrologie observant le ciel depuis la Terre, on opère une translation d'origine :
   *       R(planète / Terre) = R(planète / Soleil) + R(Soleil / Terre).
   *    Les coordonnées géocentriques (xg, yg) additionnent la position de la planète et celle du Soleil
   *    vu de la Terre (sol.r * cos(sol.lon), sol.r * sin(sol.lon)).
   *    L'angle atan2(yg, xg) donne la longitude géocentrique tropicale finale.
   *    C'est ce changement de repère géométrique qui produit naturellement le phénomène de rétrogradation (℞) :
   *    lorsque la Terre double une planète extérieure plus lente (ou est doublée par une planète intérieure),
   *    celle-ci semble temporairement reculer sur l'écliptique.
   */
  function longitude(nom, d) {
    const s = ELEMENTS.soleil(d);
    const sol = positionOrbitale(s);

    if (nom === 'soleil') return sol.lon;

    if (nom === 'lune') {
      const l = ELEMENTS.lune(d);
      const p = positionOrbitale(l);
      const Ms = norm(s.M), Mm = norm(l.M);
      const Ls = Ms + s.w, Lm = Mm + l.w + l.N;
      const D = Lm - Ls, F = Lm - l.N;
      const pert =
        -1.274 * sin(Mm - 2 * D) + 0.658 * sin(2 * D) - 0.186 * sin(Ms) -
        0.059 * sin(2 * Mm - 2 * D) - 0.057 * sin(Mm - 2 * D + Ms) + 0.053 * sin(Mm + 2 * D) +
        0.046 * sin(2 * D - Ms) + 0.041 * sin(Mm - Ms) - 0.035 * sin(D) -
        0.031 * sin(Mm + Ms) - 0.015 * sin(2 * F - 2 * D) + 0.011 * sin(Mm - 4 * D);
      return norm(p.lon + pert);
    }

    const h = positionHeliocentrique(nom, d);
    // héliocentrique → géocentrique (on ajoute la position du Soleil vue de la Terre)
    const xg = h.r * cos(h.lat) * cos(h.lon) + sol.r * cos(sol.lon);
    const yg = h.r * cos(h.lat) * sin(h.lon) + sol.r * sin(sol.lon);
    return norm(atan2(yg, xg));
  }

  // ---------- Zodiaque ----------
  const SIGNES = [
    { nom: 'Bélier', glyphe: '♈', element: 'feu', mode: 'cardinal' },
    { nom: 'Taureau', glyphe: '♉', element: 'terre', mode: 'fixe' },
    { nom: 'Gémeaux', glyphe: '♊', element: 'air', mode: 'mutable' },
    { nom: 'Cancer', glyphe: '♋', element: 'eau', mode: 'cardinal' },
    { nom: 'Lion', glyphe: '♌', element: 'feu', mode: 'fixe' },
    { nom: 'Vierge', glyphe: '♍', element: 'terre', mode: 'mutable' },
    { nom: 'Balance', glyphe: '♎', element: 'air', mode: 'cardinal' },
    { nom: 'Scorpion', glyphe: '♏', element: 'eau', mode: 'fixe' },
    { nom: 'Sagittaire', glyphe: '♐', element: 'feu', mode: 'mutable' },
    { nom: 'Capricorne', glyphe: '♑', element: 'terre', mode: 'cardinal' },
    { nom: 'Verseau', glyphe: '♒', element: 'air', mode: 'fixe' },
    { nom: 'Poissons', glyphe: '♓', element: 'eau', mode: 'mutable' },
  ];

  const ASTRES = {
    soleil:  { nom: 'Soleil', glyphe: '☉', theme: 'identité, vitalité', poids: 3 },
    lune:    { nom: 'Lune', glyphe: '☽', theme: 'émotions, besoins', poids: 3 },
    mercure: { nom: 'Mercure', glyphe: '☿', theme: 'pensée, échanges', poids: 2 },
    venus:   { nom: 'Vénus', glyphe: '♀', theme: 'amour, valeurs', poids: 2 },
    mars:    { nom: 'Mars', glyphe: '♂', theme: 'action, désir', poids: 2 },
    jupiter: { nom: 'Jupiter', glyphe: '♃', theme: 'expansion, chance', poids: 1 },
    saturne: { nom: 'Saturne', glyphe: '♄', theme: 'structure, limites', poids: 1 },
    uranus:  { nom: 'Uranus', glyphe: '♅', theme: 'rupture, innovation', poids: 1 },
    neptune: { nom: 'Neptune', glyphe: '♆', theme: 'rêve, dissolution', poids: 1 },
  };

  function signe(lon) {
    const idx = Math.floor(norm(lon) / 30);
    return { ...SIGNES[idx], index: idx, degre: norm(lon) - idx * 30 };
  }

  // ---------- Positions ----------
  function positions(date) {
    const d = jourSchlyter(date);
    return Object.keys(ASTRES).map((cle) => {
      const lon = longitude(cle, d);
      // rétrograde si la longitude diminue sur ±12 h (Soleil/Lune jamais rétrogrades)
      let retro = false;
      if (cle !== 'soleil' && cle !== 'lune') {
        let delta = longitude(cle, d + 0.5) - longitude(cle, d - 0.5);
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        retro = delta < 0;
      }
      return { cle, ...ASTRES[cle], lon, retrograde: retro, signe: signe(lon) };
    });
  }

  // ---------- Lune ----------
  const PHASES = ['Nouvelle lune', 'Premier croissant', 'Premier quartier', 'Gibbeuse croissante',
                  'Pleine lune', 'Gibbeuse décroissante', 'Dernier quartier', 'Dernier croissant'];

  function phaseLunaire(date) {
    const d = jourSchlyter(date);
    const elong = norm(longitude('lune', d) - longitude('soleil', d));
    return {
      elongation: elong,
      illumination: (1 - cos(elong)) / 2,
      nom: PHASES[Math.floor(norm(elong + 22.5) / 45) % 8],
      croissante: elong < 180,
    };
  }

  // ---------- Prochaines phases principales ----------
  /**
   * Les 4 phases principales sont des instants précis, définis par l'élongation
   * (écart en longitude Lune − Soleil) : nouvelle lune 0°, premier quartier 90°,
   * pleine lune 180°, dernier quartier 270°.
   */
  const PHASES_PRINCIPALES = [
    { nom: 'Nouvelle lune', angle: 0 },
    { nom: 'Premier quartier', angle: 90 },
    { nom: 'Pleine lune', angle: 180 },
    { nom: 'Dernier quartier', angle: 270 },
  ];

  /** Élongation de la Lune (0–360°) au jour Schlyter d. */
  const elongation = (d) => norm(longitude('lune', d) - longitude('soleil', d));

  /**
   * Instant (Date) où l'élongation atteint « angle » pour la première fois après « date ».
   *
   * Comment : l'élongation augmente toujours (≈ 12,2° par jour), sans jamais reculer.
   * On mesure donc le chemin qui reste à parcourir jusqu'à l'angle visé (0 à 360°),
   * puis on avance par pas de 6 h jusqu'à le franchir, et on resserre par dichotomie
   * (on coupe l'intervalle en deux 30 fois → précision bien inférieure à la minute).
   */
  function prochaineElongation(date, angle) {
    const depart = jourSchlyter(date);
    const reste = (d) => norm(angle - elongation(d));   // degrés restant à parcourir
    let avant = depart, apres = depart + 0.25;
    // franchi quand le « reste » saute de petit (proche de 0) à grand (proche de 360)
    while (reste(apres) <= reste(avant)) { avant = apres; apres += 0.25; }
    for (let k = 0; k < 30; k++) {
      const milieu = (avant + apres) / 2;
      if (reste(milieu) <= reste(avant)) avant = milieu; else apres = milieu;
    }
    return new Date((apres + 2451543.5 - 2440587.5) * 86400000);
  }

  /** Les 4 prochaines phases principales après « date », triées dans le temps. */
  function prochainesPhases(date) {
    return PHASES_PRINCIPALES
      .map((p) => ({ nom: p.nom, angle: p.angle, date: prochaineElongation(date, p.angle) }))
      .sort((a, b) => a.date - b.date);
  }

  // ---------- Aspects ----------
  const ASPECTS = [
    { nom: 'Conjonction', angle: 0, orbe: 8, nature: 'fusion', glyphe: '☌' },
    { nom: 'Sextile', angle: 60, orbe: 5, nature: 'harmonie', glyphe: '⚹' },
    { nom: 'Carré', angle: 90, orbe: 7, nature: 'tension', glyphe: '□' },
    { nom: 'Trigone', angle: 120, orbe: 7, nature: 'harmonie', glyphe: '△' },
    { nom: 'Opposition', angle: 180, orbe: 8, nature: 'tension', glyphe: '☍' },
  ];

  function aspects(pos) {
    const out = [];
    for (let a = 0; a < pos.length; a++) {
      for (let b = a + 1; b < pos.length; b++) {
        let sep = Math.abs(pos[a].lon - pos[b].lon);
        if (sep > 180) sep = 360 - sep;
        for (const asp of ASPECTS) {
          const ecart = Math.abs(sep - asp.angle);
          if (ecart <= asp.orbe) {
            out.push({ a: pos[a].cle, b: pos[b].cle, ...asp, ecart, force: 1 - ecart / asp.orbe });
          }
        }
      }
    }
    return out.sort((x, y) => y.force - x.force);
  }

  // ---------- Dynamique des énergies ----------
  /**
   * Synthèse : répartition des éléments et modes (pondérée par astre),
   * ratio harmonie/tension des aspects, phase lunaire.
   */
  function dynamique(date) {
    const pos = positions(date);
    const elements = { feu: 0, terre: 0, air: 0, eau: 0 };
    const modes = { cardinal: 0, fixe: 0, mutable: 0 };
    let total = 0;
    for (const p of pos) {
      elements[p.signe.element] += p.poids;
      modes[p.signe.mode] += p.poids;
      total += p.poids;
    }
    for (const k in elements) elements[k] /= total;
    for (const k in modes) modes[k] /= total;

    const asp = aspects(pos);
    let harmonie = 0, tension = 0, fusion = 0;
    for (const x of asp) {
      if (x.nature === 'harmonie') harmonie += x.force;
      else if (x.nature === 'tension') tension += x.force;
      else fusion += x.force;
    }
    const dominant = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])[0][0];

    return {
      date: date.toISOString(),
      positions: pos,
      lune: phaseLunaire(date),
      aspects: asp,
      elements, modes,
      elementDominant: dominant(elements),
      modeDominant: dominant(modes),
      climat: { harmonie, tension, fusion, indice: (harmonie - tension) / ((harmonie + tension) || 1) },
      retrogrades: pos.filter((p) => p.retrograde).map((p) => p.cle),
    };
  }

  // ---------- Teinte du jour ----------
  /**
   * La « teinte » du jour = l'élément (feu, terre, air, eau) où se trouvent
   * le PLUS d'astres. Contrairement à dynamique().elements, chaque astre compte
   * pour 1 (pas de poids) : c'est un simple décompte, facile à vérifier
   * en regardant la table des positions.
   * En cas d'égalité, on départage avec la répartition pondérée (Soleil et Lune
   * comptent plus), puis par l'ordre du zodiaque (feu, terre, air, eau).
   * Renvoie { element, nombre, total, proportion }.
   */
  function teinteDuJour(pos) {
    const ORDRE = ['feu', 'terre', 'air', 'eau'];
    const compte = { feu: 0, terre: 0, air: 0, eau: 0 };
    const poids = { feu: 0, terre: 0, air: 0, eau: 0 };
    for (const p of pos) {
      compte[p.signe.element] += 1;
      poids[p.signe.element] += p.poids || 1;
    }
    const element = ORDRE.slice().sort((a, b) =>
      (compte[b] - compte[a]) || (poids[b] - poids[a]) || (ORDRE.indexOf(a) - ORDRE.indexOf(b)))[0];
    return { element, nombre: compte[element], total: pos.length, proportion: compte[element] / pos.length };
  }

  // ---------- Vue héliocentrique ----------
  /** Les planètes du schéma héliocentrique, du Soleil vers l'extérieur. */
  const PLANETES_HELIO = ['mercure', 'venus', 'terre', 'mars', 'jupiter', 'saturne', 'uranus', 'neptune'];

  /**
   * Longitudes héliocentriques du jour (vues du Soleil), pour le schéma
   * du système solaire. Renvoie [{ cle, lon, r }] dans l'ordre de PLANETES_HELIO.
   */
  function positionsHeliocentriques(date) {
    const d = jourSchlyter(date);
    return PLANETES_HELIO.map((cle) => {
      const h = positionHeliocentrique(cle, d);
      return { cle, lon: h.lon, r: h.r };
    });
  }

  // ---------- Calcul détaillé (pour apprendre) ----------
  //
  // Même principe que expliquer() en numérologie : refaire le chemin du résultat
  // en phrases, pour pouvoir le vérifier à la main.

  const f1 = (x) => x.toFixed(1).replace('.', ','); // 136.84 → "136,8"

  /**
   * Étapes : longitude → signe → degré dans le signe (→ rétrogradation).
   * Renvoie une liste de phrases.
   */
  function expliquerPosition(cle, date) {
    const d = jourSchlyter(date);
    const lon = longitude(cle, d);
    const idx = Math.floor(lon / 30);
    const S = SIGNES[idx];
    const avant = SIGNES.slice(0, idx).map((s) => s.nom);
    const etapes = [
      `Longitude de ${ASTRES[cle].nom} sur le zodiaque : ${f1(lon)}° (0° = équinoxe de printemps, début du Bélier).`,
      `Chaque signe fait 30° : ${f1(lon)} ÷ 30 = ${(lon / 30).toFixed(2).replace('.', ',')} → ` +
        (idx === 0 ? 'aucun signe complet avant : 1er signe, le Bélier.'
          : `${idx} signe${idx > 1 ? 's' : ''} complet${idx > 1 ? 's' : ''} avant (${avant.join(', ')}) → ${idx + 1}e signe : ${S.nom}.`),
      `Degré dans le signe : ${f1(lon)} − ${idx} × 30 = ${f1(lon - idx * 30)}° en ${S.nom}.`,
    ];
    if (cle !== 'soleil' && cle !== 'lune') {
      const veille = longitude(cle, d - 0.5), lendemain = longitude(cle, d + 0.5);
      let delta = lendemain - veille;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      etapes.push(
        `Mouvement sur 24 h : ${f1(veille)}° → ${f1(lendemain)}° (${delta >= 0 ? '+' : '−'}${Math.abs(delta).toFixed(3).replace('.', ',')}°) : ` +
        (delta < 0 ? 'la longitude diminue → rétrograde.' : 'la longitude augmente → mouvement direct.'));
    }
    return etapes;
  }

  /**
   * Étapes d'un aspect : écart entre les deux longitudes → angle visé → orbe → force.
   * x : un élément renvoyé par aspects() ; pos : le tableau de positions() correspondant.
   */
  function expliquerAspect(x, pos) {
    const a = pos.find((p) => p.cle === x.a), b = pos.find((p) => p.cle === x.b);
    const brut = Math.abs(a.lon - b.lon);
    const sep = brut > 180 ? 360 - brut : brut;
    return [
      `${a.nom} à ${f1(a.lon)}°, ${b.nom} à ${f1(b.lon)}°.`,
      `Écart : |${f1(a.lon)} − ${f1(b.lon)}| = ${f1(brut)}°` +
        (brut > 180 ? ` ; plus de 180°, on prend le plus court chemin : 360 − ${f1(brut)} = ${f1(sep)}°.` : '.'),
      `Angle le plus proche : ${x.nom.toLowerCase()} (${x.angle}°) → écart à l’exact : |${f1(sep)} − ${x.angle}| = ${f1(x.ecart)}°.`,
      `Orbe toléré pour un${x.nom === 'Opposition' || x.nom === 'Conjonction' ? 'e' : ''} ${x.nom.toLowerCase()} : ${x.orbe}° → ${f1(x.ecart)} ≤ ${x.orbe} : aspect retenu.`,
      `Force : 1 − ${f1(x.ecart)} ÷ ${x.orbe} = ${Math.round(x.force * 100)} % (100 % = aspect exact).`,
    ];
  }

  /**
   * Thème natal d'un profil à partir de sa date de naissance.
   *
   * Pourquoi midi TU ?
   * En l'absence de l'heure légale et du lieu de naissance précis, calculer
   * les positions planétaires à 12h00 Temps Universel (midi TU) est la convention
   * astronomique standard : elle minimise l'incertitude temporelle sur la journée à ±12 heures.
   * Pour le Soleil et les planètes (Mercure à Neptune), le déplacement angulaire en 12 heures
   * reste faible : jusqu'à ~1° pour Mercure (la plus rapide), ~0,6° pour Vénus, quasi nul
   * pour les lentes. Le signe n'est en doute que si l'astre est tout près d'une frontière ;
   * on surveille donc aussi le Soleil, qui change de signe vers le 20 de chaque mois.
   *
   * Limite : la « journée » surveillée va de 0h à 24h TU, pas de 0h à 24h heure locale
   * (en France, une naissance à 0h30 tombe la veille en TU).
   *
   * Pourquoi surveiller le changement de signe de la Lune ?
   * La Lune est le corps céleste le plus rapide : elle parcourt environ 13° par jour
   * (environ 0,55° par heure). Puisque chaque signe mesure 30°, elle change de signe
   * tous les 2 jours et demi en moyenne. Il y a donc environ 40 % de probabilité qu'elle
   * traverse une frontière de signe au cours des 24 heures du jour de naissance.
   * Toiles compare donc la longitude de la Lune à 0h00 TU et à 24h00 TU : si les signes
   * diffèrent, un avertissement clair prévient l'utilisateur que son signe lunaire natal
   * dépend de son heure exacte de naissance.
   */
  function themeNatal(dateOuChaine) {
    let annee, mois, jour;
    if (typeof dateOuChaine === 'string') {
      const parts = dateOuChaine.trim().split('-');
      annee = Number(parts[0]);
      mois = Number(parts[1]);
      jour = Number(parts[2]);
    } else if (dateOuChaine instanceof Date) {
      annee = dateOuChaine.getFullYear();
      mois = dateOuChaine.getMonth() + 1;
      jour = dateOuChaine.getDate();
    } else {
      throw new Error('Date de naissance invalide pour le thème natal.');
    }

    if (isNaN(annee) || isNaN(mois) || isNaN(jour)) {
      throw new Error('Date de naissance invalide pour le thème natal.');
    }

    // Référence astronomique : midi TU (12:00:00 UTC)
    const dateMidiTU = new Date(Date.UTC(annee, mois - 1, jour, 12, 0, 0));
    const pos = positions(dateMidiTU);

    // Détection du passage de signe lunaire entre 0h00 TU et 24h00 TU
    const d0 = jourSchlyter(new Date(Date.UTC(annee, mois - 1, jour, 0, 0, 0)));
    const d24 = jourSchlyter(new Date(Date.UTC(annee, mois - 1, jour, 24, 0, 0)));
    const s0 = signe(longitude('lune', d0));
    const s24 = signe(longitude('lune', d24));
    const luneChangeDeSigne = s0.index !== s24.index;

    // Même contrôle pour le Soleil (jour de changement de signe, vers le 20 du mois).
    const sol0 = signe(longitude('soleil', d0));
    const sol24 = signe(longitude('soleil', d24));
    const soleilChangeDeSigne = sol0.index !== sol24.index;
    const avertissementSoleil = soleilChangeDeSigne
      ? `Le Soleil a changé de signe ce jour-là (du ${sol0.nom} au ${sol24.nom}). Sans heure précise de naissance, ton signe solaire reste incertain.`
      : null;

    let avertissementLune = null;
    if (luneChangeDeSigne) {
      avertissementLune = `La Lune a changé de signe ce jour-là (du ${s0.nom} au ${s24.nom}). Sans heure précise de naissance, son signe natal reste incertain.`;
    }

    return {
      date: dateMidiTU,
      annee,
      mois,
      jour,
      positions: pos,
      aspects: aspects(pos),
      luneChangeDeSigne,
      avertissementLune,
      soleilChangeDeSigne,
      avertissementSoleil,
      signeLuneDebut: s0,
      signeLuneFin: s24,
    };
  }

  T.astres = {
    expliquerPosition, expliquerAspect,
    jourJulien, longitude: (nom, date) => longitude(nom, jourSchlyter(date)),
    signe, positions, phaseLunaire, prochainesPhases, aspects, dynamique,
    teinteDuJour, positionsHeliocentriques, PLANETES_HELIO,
    themeNatal,
    SIGNES, ASTRES, ASPECTS, PHASES,
  };
})(globalThis.Toiles = globalThis.Toiles || {});

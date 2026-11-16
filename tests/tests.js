/**
 * Toiles — tests permanents.
 *
 * À relancer après chaque modification des calculs ou des textes :
 *   - dans le navigateur : double-clic sur tests/index.html
 *   - en ligne de commande : node tests/tout.js
 *
 * Ce fichier ne fait que DÉCRIRE les tests ; les deux lanceurs les exécutent.
 * Pas de bibliothèque : un test est une fonction qui lève une erreur si quelque chose est faux.
 *
 * Ajouter un test : test('groupe', 'ce qui est vérifié', () => { ... });
 */
(function (T) {
  'use strict';

  const tests = [];
  const test = (groupe, nom, fn) => tests.push({ groupe, nom, fn });

  // ---------- Outils de vérification ----------
  function egal(obtenu, attendu, quoi = '') {
    if (obtenu !== attendu) throw new Error(`${quoi} attendu ${JSON.stringify(attendu)}, obtenu ${JSON.stringify(obtenu)}`);
  }
  function vrai(condition, message) {
    if (!condition) throw new Error(message);
  }
  /** Écart entre deux angles en degrés, en tenant compte du tour complet (359° et 1° sont à 2°). */
  function ecartAngle(a, b) {
    const d = Math.abs(((a - b) % 360 + 360) % 360);
    return d > 180 ? 360 - d : d;
  }
  function proche(obtenu, attendu, tolerance, quoi = '') {
    const e = ecartAngle(obtenu, attendu);
    if (e > tolerance) throw new Error(`${quoi} attendu ${attendu}° ± ${tolerance}, obtenu ${obtenu.toFixed(2)}° (écart ${e.toFixed(2)}°)`);
  }
  /** Date à midi (heure locale) : la lecture de Toiles est « par jour ». */
  const jour = (a, m, j) => new Date(a, m - 1, j, 12);
  /** Instant précis en temps universel, pour les événements astronomiques. */
  const tu = (a, m, j, h = 0, min = 0) => new Date(Date.UTC(a, m - 1, j, h, min));

  // =====================================================================
  //  NUMÉROLOGIE
  // =====================================================================

  test('Numérologie', 'Réduction simple et maîtres-nombres', () => {
    const N = T.numerologie;
    egal(N.reduire(2026), 1, '2026 →');
    egal(N.reduire(29), 11, '29 → 11 (maître) :');
    egal(N.reduire(29, false), 2, '29 sans maîtres :');
    egal(N.reduire(1993), 22, '1993 → 22 (maître) :');
    egal(N.reduire(7), 7, '7 →');
  });

  test('Numérologie', 'Nombres universels du 28/10/2026 (calculés à la main)', () => {
    const N = T.numerologie, d = jour(2026, 10, 28);
    egal(N.anneeUniverselle(d), 1, 'année');
    egal(N.moisUniversel(d), 11, 'mois (1 + 10 = 11, maître)');
    egal(N.jourUniversel(d), 3, 'jour (11 + 28 = 39 → 12 → 3)');
  });

  test('Numérologie', 'Nombres personnels (naissance 15/05/1990, le 28/10/2026)', () => {
    const N = T.numerologie, d = jour(2026, 10, 28), n = jour(1990, 5, 15);
    egal(N.anneePersonnelle(d, n), 3, 'année (6 + 5 + 1 = 12 → 3)');
    egal(N.moisPersonnel(d, n), 4, 'mois (3 + 10 = 13 → 4)');
    egal(N.jourPersonnel(d, n), 5, 'jour (4 + 28 = 32 → 5)');
    egal(N.cheminDeVie(n), 3, 'chemin de vie');
  });

  test('Numérologie', 'Semaine ISO sur les cas pièges', () => {
    const N = T.numerologie;
    egal(N.semaineISO(jour(2021, 1, 1)), 53, '1er janv. 2021 (vendredi) → semaine 53 de 2020 :');
    egal(N.semaineISO(jour(2026, 1, 1)), 1, '1er janv. 2026 (jeudi) :');
    egal(N.semaineISO(jour(2024, 12, 30)), 1, '30 déc. 2024 (lundi) → semaine 1 de 2025 :');
    egal(N.semaineISO(jour(2026, 10, 28)), 44, '28 oct. 2026 :');
  });

  test('Numérologie', 'Calcul détaillé = calcul rapide (1990 → 2040, un jour sur trois)', () => {
    const N = T.numerologie, n = jour(1990, 5, 15);
    const rapides = {
      annee: [N.anneeUniverselle, N.anneePersonnelle], mois: [N.moisUniversel, N.moisPersonnel],
      semaine: [N.semaineUniverselle, N.semainePersonnelle], jour: [N.jourUniversel, N.jourPersonnel],
    };
    for (let d = jour(1990, 1, 1); d < jour(2040, 1, 1); d = new Date(d.getTime() + 3 * 86400000)) {
      for (const type in rapides) {
        egal(N.expliquer(type, d, n, false).valeur, rapides[type][0](d), `${type} universel du ${d.toLocaleDateString('fr-FR')} :`);
        egal(N.expliquer(type, d, n, true).valeur, rapides[type][1](d, n), `${type} personnel du ${d.toLocaleDateString('fr-FR')} :`);
      }
    }
  });

  // =====================================================================
  //  CIEL — comparé à des événements astronomiques publiés
  // =====================================================================

  test('Ciel', 'Équinoxes et solstices 2024 (Soleil à 0°, 90°, 180°, 270°)', () => {
    const lon = (d) => T.astres.longitude('soleil', d);
    proche(lon(tu(2024, 3, 20, 3, 6)), 0, 0.1, 'équinoxe de mars :');
    proche(lon(tu(2024, 6, 20, 20, 51)), 90, 0.1, 'solstice de juin :');
    proche(lon(tu(2024, 9, 22, 12, 44)), 180, 0.1, 'équinoxe de septembre :');
    proche(lon(tu(2024, 12, 21, 9, 21)), 270, 0.1, 'solstice de décembre :');
  });

  test('Ciel', 'Nouvelles et pleines lunes (écart Lune–Soleil à 0° ou 180°)', () => {
    const el = (d) => T.astres.phaseLunaire(d).elongation;
    proche(el(tu(2024, 4, 8, 18, 21)), 0, 1.5, 'nouvelle lune 8/04/2024 (éclipse) :');
    proche(el(tu(2024, 4, 23, 23, 49)), 180, 1.5, 'pleine lune 23/04/2024 :');
    proche(el(tu(2025, 3, 14, 6, 55)), 180, 1.5, 'pleine lune 14/03/2025 (éclipse) :');
    proche(el(tu(2025, 9, 21, 19, 54)), 0, 1.5, 'nouvelle lune 21/09/2025 :');
    egal(T.astres.phaseLunaire(tu(2024, 4, 23, 23, 49)).nom, 'Pleine lune', 'nom de la phase :');
  });

  test('Ciel', 'Rétrogradations connues', () => {
    const retro = (cle, d) => T.astres.positions(d).find((p) => p.cle === cle).retrograde;
    // Mercure rétrograde du 1er au 25 avril 2024
    egal(retro('mercure', tu(2024, 4, 10, 12)), true, 'Mercure le 10/04/2024 :');
    egal(retro('mercure', tu(2024, 3, 20, 12)), false, 'Mercure le 20/03/2024 :');
    egal(retro('mercure', tu(2024, 5, 5, 12)), false, 'Mercure le 05/05/2024 :');
    // Vénus rétrograde du 1er mars au 12 avril 2025
    egal(retro('venus', tu(2025, 3, 20, 12)), true, 'Vénus le 20/03/2025 :');
    // Mars rétrograde du 6 décembre 2024 au 23 février 2025
    egal(retro('mars', tu(2025, 1, 15, 12)), true, 'Mars le 15/01/2025 :');
    egal(retro('mars', tu(2025, 4, 1, 12)), false, 'Mars le 01/04/2025 :');
  });

  test('Ciel', 'Entrées dans un signe (Jupiter en Cancer, Saturne en Bélier, 2025)', () => {
    const signe = (cle, d) => T.astres.positions(d).find((p) => p.cle === cle).signe.nom;
    egal(signe('jupiter', tu(2025, 6, 1, 12)), 'Gémeaux', 'Jupiter le 01/06/2025 :');
    egal(signe('jupiter', tu(2025, 6, 20, 12)), 'Cancer', 'Jupiter le 20/06/2025 (entré le 9) :');
    egal(signe('saturne', tu(2025, 5, 10, 12)), 'Poissons', 'Saturne le 10/05/2025 :');
    egal(signe('saturne', tu(2025, 6, 15, 12)), 'Bélier', 'Saturne le 15/06/2025 (entré le 24/05) :');
  });

  test('Ciel', 'Calcul détaillé = valeurs affichées', () => {
    const A = T.astres, d = jour(2026, 10, 28);
    const pos = A.positions(d);
    for (const p of pos) {
      const etapes = A.expliquerPosition(p.cle, d).join(' ');
      const degre = p.signe.degre.toFixed(1).replace('.', ',');
      vrai(etapes.includes(`${degre}° en ${p.signe.nom}`), `${p.nom} : les étapes ne retrouvent pas « ${degre}° en ${p.signe.nom} »`);
      if (p.retrograde) vrai(etapes.includes('→ rétrograde'), `${p.nom} : rétrograde mais les étapes ne le disent pas`);
    }
    for (const x of A.aspects(pos)) {
      const etapes = A.expliquerAspect(x, pos).join(' ');
      vrai(etapes.includes(`${x.ecart.toFixed(1).replace('.', ',')}°`), `${x.a}–${x.b} : écart absent des étapes`);
    }
  });

  // =====================================================================
  //  TEXTES — rien ne doit manquer
  // =====================================================================

  test('Textes', 'Chaque astre, signe et aspect a son entrée dans le glossaire', () => {
    const G = T.glossaire, cle = T.cleGlossaire, A = T.astres;
    for (const k in A.ASTRES) vrai(G[k], `astre « ${k} » absent du glossaire`);
    for (const s of A.SIGNES) vrai(G[cle(s.nom)], `signe « ${s.nom} » absent du glossaire`);
    for (const a of A.ASPECTS) vrai(G[cle(a.nom)], `aspect « ${a.nom} » absent du glossaire`);
    for (const k of ['feu', 'terre', 'air', 'eau', 'cardinal', 'fixe', 'mutable', 'retrograde', 'degre', 'orbe', 'phase', 'cheminDeVie'])
      vrai(G[k], `terme « ${k} » absent du glossaire`);
  });

  test('Textes', 'Les 108 « planète en signe » sont rédigées', () => {
    const P = T.positions;
    let manquants = [];
    for (const astre in T.astres.ASTRES) for (const signe of P.ORDRE)
      if (P.lire(astre, signe).assemble) manquants.push(`${astre} en ${signe}`);
    vrai(manquants.length === 0, `non rédigés : ${manquants.join(', ')}`);
  });

  test('Textes', 'Dignités classiques', () => {
    const d = (a, s) => T.positions.dignite(a, s).etats.join('+');
    egal(d('mars', 'belier'), 'domicile', 'Mars en Bélier :');
    egal(d('mars', 'balance'), 'exil', 'Mars en Balance :');
    egal(d('mars', 'capricorne'), 'exaltation', 'Mars en Capricorne :');
    egal(d('mars', 'cancer'), 'chute', 'Mars en Cancer :');
    egal(d('mercure', 'vierge'), 'domicile+exaltation', 'Mercure en Vierge :');
    egal(d('soleil', 'lion'), 'domicile', 'Soleil en Lion :');
    egal(d('lune', 'scorpion'), 'chute', 'Lune en Scorpion :');
    egal(d('mars', 'lion'), 'neutre', 'Mars en Lion :');
  });

  test('Textes', 'Chaque nombre a son sens dans les 6 domaines', () => {
    const N = T.numerologie;
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33])
      for (const dom of N.DOMAINES) vrai(N.interpreter(n, dom).texte, `nombre ${n}, domaine ${dom} : texte manquant`);
    // Le sens vient bien du glossaire (migration v0.3) et le mot-clé n'a pas changé
    egal(N.interpreter(7, 'travail').texte, T.glossaire.nombre7.domaines.travail, 'source du sens :');
    egal(N.interpreter(22).mot, 'Bâtisseur', 'mot du 22 :');
    egal(N.interpreter(10), null, '10 n’est pas un nombre réduit :');
  });

  test('Textes', 'Relecture des 108 « planète en signe » : forme homogène', () => {
    const P = T.positions, problemes = [];
    for (const astre in P.TEXTES) for (const signe in P.TEXTES[astre]) {
      const [texte, revers, mots] = P.TEXTES[astre][signe];
      const motsCles = mots.split(',').map((m) => m.trim());
      const ici = `${astre} en ${signe}`;
      if (!texte.endsWith('.')) problemes.push(`${ici} : le texte ne finit pas par un point`);
      if (!texte.includes(' : ')) problemes.push(`${ici} : forme « … : … » attendue`);
      if (texte.length > 110) problemes.push(`${ici} : texte trop long (${texte.length})`);
      if (motsCles.length !== 3) problemes.push(`${ici} : ${motsCles.length} mots-clés au lieu de 3`);
      if (!revers) problemes.push(`${ici} : revers vide`);
      const doublons = revers.split(',').map((r) => r.trim()).filter((r) => motsCles.includes(r));
      if (doublons.length) problemes.push(`${ici} : « ${doublons} » à la fois revers et mot-clé`);
      if ((texte + revers + mots).includes("'")) problemes.push(`${ici} : apostrophe droite`);
    }
    vrai(problemes.length === 0, problemes.join(' ; '));
  });

  // =====================================================================
  //  FICHES GLOSSAIRE
  // =====================================================================

  /** Toutes les clés que la vue Aujourd'hui rend cliquables (data-glossaire). */
  function termesCliquables() {
    const A = T.astres, cle = T.cleGlossaire;
    return [
      ...Object.keys(A.ASTRES),
      ...A.SIGNES.map((s) => cle(s.nom)),
      ...A.ASPECTS.map((a) => cle(a.nom)),
      'feu', 'terre', 'air', 'eau', 'cardinal', 'fixe', 'mutable',
      'retrograde', 'degre', 'phase', 'cheminDeVie',
      // v0.7 : points complémentaires, sidéral, cycles longs, nom
      ...Object.keys(T.complements.POINTS), 'sideral', 'ayanamsa',
      'cycleNeufAns', 'cycleDeVie', 'pinacle', 'defi', 'expression', 'elanSpirituel', 'moiIntime',
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map(T.cleNombre),
    ];
  }

  test('Fiches', 'Complétude : aucun terme cliquable n’a de fiche vide', () => {
    const F = T.fiches, G = T.glossaire, problemes = [];
    for (const cle of termesCliquables()) {
      const f = F.construire(cle);
      if (!f) { problemes.push(`« ${cle} » sans fiche`); continue; }
      if (!f.titre || !f.court) problemes.push(`« ${cle} » : titre ou définition vide`);
      if (!f.blocs.length) problemes.push(`« ${cle} » : fiche sans contenu détaillé`);
      for (const b of f.blocs) {
        if (!b.titre) problemes.push(`« ${cle} » : bloc sans titre`);
        if (!b.texte && !b.liens && !b.domaines) problemes.push(`« ${cle} » : bloc « ${b.titre} » vide`);
        for (const l of b.liens || []) if (!G[l.cle]) problemes.push(`« ${cle} » : lien vers « ${l.cle} » inexistant`);
        for (const d of b.domaines || []) if (!d.texte) problemes.push(`« ${cle} » : domaine « ${d.domaine} » vide`);
      }
    }
    vrai(problemes.length === 0, problemes.join(' ; '));
  });

  test('Fiches', 'Nombres, signes, planètes et aspects : lumière, ombre et 6 domaines', () => {
    const G = T.glossaire, F = T.fiches, problemes = [];
    const ids = F.CATEGORIES.map((c) => c.id);
    for (const cle in G) {
      const e = G[cle];
      if (!ids.includes(e.categorie)) problemes.push(`« ${cle} » : catégorie « ${e.categorie} » inconnue`);
      if (!e.titre || !e.court) problemes.push(`« ${cle} » : titre ou définition vide`);
      if (['nombre', 'signe', 'astre', 'aspect'].includes(e.categorie)) {
        if (!e.lumiere || !e.ombre) problemes.push(`« ${cle} » : lumière ou ombre manquante`);
        for (const d of T.numerologie.DOMAINES)
          if (!e.domaines || !e.domaines[d]) problemes.push(`« ${cle} » : domaine « ${d} » manquant`);
      }
    }
    // Chaque catégorie a ses fiches : 12 nombres, 12 signes, 9 planètes, 5 aspects
    egal(F.lister('nombre').length, 12, 'nombres :');
    egal(F.lister('signe').length, 12, 'signes :');
    egal(F.lister('astre').length, 9, 'planètes :');
    egal(F.lister('aspect').length, 5, 'aspects :');
    vrai(problemes.length === 0, problemes.join(' ; '));
  });

  test('Fiches', 'Maîtres des signes = domiciles des planètes (src/positions.js)', () => {
    const G = T.glossaire, D = T.positions.DIGNITES;
    for (const signe of T.positions.ORDRE) {
      const attendus = Object.keys(D).filter((astre) => D[astre].domicile.includes(signe));
      egal(G[signe].maitres.slice().sort().join('+'), attendus.sort().join('+'), `maîtres de ${signe} :`);
    }
  });

  test('Fiches', 'Liens transversaux (signe ↔ planète ↔ élément, maître-nombre)', () => {
    const F = T.fiches;
    const liens = (cle, titre) => (F.construire(cle).blocs.find((b) => b.titre.startsWith(titre)) || { liens: [] })
      .liens.map((l) => l.cle).join(',');
    egal(liens('verseau', 'Planètes maîtresses'), 'saturne,uranus', 'maîtres du Verseau :');
    egal(liens('verseau', 'Élément'), 'air,fixe', 'élément et mode du Verseau :');
    egal(liens('mars', 'Domicile'), 'belier,scorpion', 'domiciles de Mars :');
    egal(liens('mars', 'Exaltation'), 'capricorne', 'exaltation de Mars :');
    egal(liens('cancer', 'Planètes exaltées'), 'jupiter,neptune', 'exaltés en Cancer :');
    egal(liens('eau', 'Signes'), 'cancer,scorpion,poissons', 'signes d’eau :');
    egal(liens('nombre11', 'Vibre aussi'), 'nombre2', '11 vibre en 2 :');
    egal(F.construire('inconnu'), null, 'clé inconnue :');
  });

  test('Fiches', 'Recherche sans accents ni majuscules', () => {
    const F = T.fiches, cle = T.cleGlossaire;
    const chercher = (mot) => F.lister().filter((c) => F.texteRecherche(c).includes(cle(mot)));
    vrai(chercher('Bâtisseur').includes('nombre22'), '« Bâtisseur » devrait trouver le 22');
    vrai(chercher('batisseur').includes('nombre22'), '« batisseur » (sans accent) devrait trouver le 22');
    vrai(chercher('SATURNE').includes('saturne'), '« SATURNE » devrait trouver Saturne');
  });

  // =====================================================================
  //  PROFILS
  // =====================================================================

  test('Profils', 'Ajouter, modifier, supprimer', () => {
    const P = T.profils;
    const avant = P.lister().length;
    const p = P.ajouter({ nom: '  Test  ', naissance: '2000-01-02' });
    egal(p.nom, 'Test', 'nom nettoyé :');
    egal(P.lister().length, avant + 1, 'nombre de profils :');
    P.modifier(p.id, { nom: 'Test 2' });
    egal(P.obtenir(p.id).nom, 'Test 2', 'après modification :');
    P.supprimer(p.id);
    egal(P.obtenir(p.id), null, 'après suppression :');
  });

  test('Profils', 'Refuse un profil sans nom ou sans date', () => {
    const P = T.profils;
    let refus = 0;
    try { P.ajouter({ nom: '', naissance: '2000-01-02' }); } catch { refus++; }
    try { P.ajouter({ nom: 'X', naissance: '' }); } catch { refus++; }
    egal(refus, 2, 'nombre de refus :');
  });

  // =====================================================================
  //  THÈME NATAL & TRANSITS
  // =====================================================================

  test('Transits', 'Thème natal du 01/01/2000 (midi TU) = positions de référence J2000', () => {
    // Valeurs publiées pour l'instant J2000.0 (1er janvier 2000, 12h TU), arrondies au dixième.
    const reference = {
      soleil: 280.4, lune: 223.3, mercure: 271.9, venus: 241.6, mars: 328.0,
      jupiter: 25.3, saturne: 40.4, uranus: 314.8, neptune: 303.2,
    };
    const theme = T.astres.themeNatal('2000-01-01');
    egal(theme.date.toISOString(), '2000-01-01T12:00:00.000Z', 'instant du thème :');
    for (const p of theme.positions) proche(p.lon, reference[p.cle], 1, p.nom);
    // Une Date JS donne le même thème que la chaîne "AAAA-MM-JJ"
    const viaDate = T.astres.themeNatal(jour(2000, 1, 1));
    egal(viaDate.date.toISOString(), theme.date.toISOString(), 'thème via Date :');
  });

  test('Transits', 'Avertissement quand la Lune change de signe le jour de naissance', () => {
    const A = T.astres;
    let joursAvecChangement = 0;
    for (let j = 1; j <= 30; j++) {
      const theme = A.themeNatal(`2024-04-${String(j).padStart(2, '0')}`);
      // L'avertissement doit exister si et seulement si les signes de 0h et 24h TU diffèrent
      egal(theme.luneChangeDeSigne, theme.signeLuneDebut.index !== theme.signeLuneFin.index, `cohérence le ${j}/04 :`);
      egal(theme.avertissementLune !== null, theme.luneChangeDeSigne, `message le ${j}/04 :`);
      if (theme.luneChangeDeSigne) joursAvecChangement++;
    }
    // La Lune change de signe toutes les ~2,3 jours → 12 à 15 jours concernés sur 30.
    vrai(joursAvecChangement >= 11 && joursAvecChangement <= 15,
      `jours avec changement de signe lunaire en avril 2024 : ${joursAvecChangement} (attendu 11 à 15)`);
  });

  /** Fabrique une position factice (comme celles de positions()) pour tester les transits. */
  function positionFactice(cle, lon) {
    return { cle, ...T.astres.ASTRES[cle], lon, retrograde: false, signe: T.astres.signe(lon) };
  }

  test('Transits', 'Orbes resserrés : limites acceptées et refusées', () => {
    const TR = T.transits;
    const natal = { positions: [positionFactice('soleil', 10)] };
    const trouve = (lonSaturne) =>
      TR.calculer([positionFactice('saturne', lonSaturne)], natal).transits;

    // Carré (orbe 2,5°) : 10 + 90 = 100°
    egal(trouve(102.4).length, 1, 'carré à 2,4° :');
    egal(trouve(102.4)[0].nom, 'Carré', 'nom :');
    egal(trouve(102.6).length, 0, 'carré à 2,6° (hors orbe) :');
    // Sextile (orbe 2°) : 10 + 60 = 70°
    egal(trouve(71.9).length, 1, 'sextile à 1,9° :');
    egal(trouve(72.1).length, 0, 'sextile à 2,1° (hors orbe) :');
    // Conjonction (orbe 3°) en traversant 0° : 10° natal, 7,2° céleste → 2,8°
    egal(trouve(7.2)[0].nom, 'Conjonction', 'conjonction :');
    // Opposition par le plus court chemin : 10° et 187° → écart 177°, soit 3° de l'opposition exacte
    egal(trouve(187).length, 1, 'opposition à 3° :');
    egal(trouve(186.9).length, 0, 'opposition à 3,1° (hors orbe) :');
    // Option orbeMax : l'orbe est plafonné
    egal(TR.calculer([positionFactice('saturne', 102.4)], natal, { orbeMax: 1 }).transits.length, 0, 'orbeMax 1° :');
    // Force : 100 % à l'exact, 0 % à la limite
    proche(trouve(100)[0].force * 100, 100, 0.001, 'force à l’exact (%)');
    vrai(trouve(100)[0].exact, 'un aspect à 0° doit être marqué exact');
  });

  test('Transits', 'Tri : planètes lentes d’abord, puis luminaires natals, puis exactitude', () => {
    const TR = T.transits;
    const natal = { positions: [positionFactice('soleil', 0), positionFactice('mercure', 200)] };
    const ciel = [
      positionFactice('lune', 1),       // Lune ☌ Soleil natal (fugace)
      positionFactice('mars', 91),      // Mars □ Soleil natal (moyen)
      positionFactice('neptune', 202),  // Neptune ☌ Mercure natal (lent)
      positionFactice('uranus', 0.5),   // Uranus ☌ Soleil natal (lent, luminaire, plus exact)
    ];
    const ordre = TR.calculer(ciel, natal).transits.map((t) => `${t.transitant}-${t.natal}`);
    egal(ordre.join(' '), 'uranus-soleil neptune-mercure mars-soleil lune-soleil', 'ordre :');
  });

  test('Transits', 'Ciel comparé à lui-même : chaque astre en conjonction exacte avec sa position natale', () => {
    const TR = T.transits, date = tu(2000, 1, 1, 12);
    const res = TR.calculer(date, '2000-01-01');
    for (const cle of Object.keys(T.astres.ASTRES)) {
      const t = res.transits.find((x) => x.transitant === cle && x.natal === cle);
      vrai(t && t.nom === 'Conjonction' && t.ecart < 1e-9, `${cle} devrait être en conjonction exacte avec lui-même`);
    }
  });

  test('Transits', 'Calcul détaillé = valeurs du transit', () => {
    const TR = T.transits;
    const natal = { positions: [positionFactice('lune', 350)] };
    const t = TR.calculer([positionFactice('jupiter', 111.2)], natal).transits[0];
    // 350 − 111,2 = 238,8° → plus court chemin 121,2° → trigone à 1,2°
    egal(t.nom, 'Trigone', 'aspect :');
    const etapes = TR.expliquer(t);
    vrai(etapes.some((e) => e.includes('360 − 238,8 = 121,2°')), 'étape du plus court chemin absente');
    vrai(etapes.some((e) => e.includes('|121,2 − 120| = 1,2°')), 'étape de l’écart à l’exact absente');
    vrai(etapes.some((e) => e.includes(`${Math.round(t.force * 100)} %`)), 'force absente');
  });

  // =====================================================================
  //  SYNTHÈSE DU JOUR & SCHÉMAS
  // =====================================================================

  test('Synthèse', 'Addition du jour : même cascade que le jour universel', () => {
    const N = T.numerologie;
    const r = N.additionDuJour(jour(2026, 11, 15));
    egal(r.texte, '2+0+2+6 = 10 → 1 · 1 + 11 = 12 → 3 · 3 + 15 = 18 → 9', 'texte :');
    egal(r.valeur, 9, 'valeur :');
    // 1990 → 2040, un jour sur trois : la valeur affichée = jourUniversel().
    for (let t = jour(1990, 1, 1).getTime(); t < jour(2040, 1, 1).getTime(); t += 3 * 86400000) {
      const d = new Date(t);
      egal(N.additionDuJour(d).valeur, N.jourUniversel(d), d.toDateString() + ' :');
    }
  });

  test('Synthèse', 'Teinte du jour : décompte des astres par élément', () => {
    const A = T.astres;
    const astre = (cle, lon, poids = 1) => ({ cle, poids, signe: A.signe(lon) });
    // 3 en feu (Bélier, Lion, Sagittaire), 2 en eau, 1 en terre → feu, 3/6.
    const t = A.teinteDuJour([astre('a', 5), astre('b', 125), astre('c', 245), astre('d', 95), astre('e', 215), astre('f', 35)]);
    egal(t.element, 'feu', 'élément :');
    egal(t.nombre, 3, 'nombre :');
    egal(t.total, 6, 'total :');
    // Égalité 1–1 : le poids départage (la Lune, poids 3, en eau).
    egal(A.teinteDuJour([astre('a', 5, 1), astre('lune', 95, 3)]).element, 'eau', 'départage par le poids :');
    // Sur une vraie date : la proportion reste entre 1/9 et 9/9.
    const v = A.teinteDuJour(A.positions(jour(2026, 11, 15)));
    vrai(v.nombre >= 3 && v.total === 9, 'au moins 3 astres sur 9 dans l’élément dominant (pigeonnier)');
  });

  test('Ciel', 'Longitudes héliocentriques : oppositions publiées (Terre et planète alignées)', () => {
    const A = T.astres;
    const helio = (d) => Object.fromEntries(A.positionsHeliocentriques(d).map((x) => [x.cle, x.lon]));
    // À l'opposition, la planète et la Terre sont du même côté du Soleil : même longitude.
    let h = helio(tu(2025, 1, 16)); proche(h.mars, h.terre, 1.5, 'Mars, opposition du 16/01/2025 :');
    h = helio(tu(2026, 1, 10));     proche(h.jupiter, h.terre, 1.5, 'Jupiter, opposition du 10/01/2026 :');
    h = helio(tu(2025, 9, 21));     proche(h.saturne, h.terre, 1.5, 'Saturne, opposition du 21/09/2025 :');
    // La Terre vue du Soleil est à l'opposé du Soleil vu de la Terre.
    const d = tu(2024, 3, 20, 3, 6);
    proche(helio(d).terre, A.longitude('soleil', d) + 180, 0.001, 'Terre = Soleil + 180° :');
  });

  test('Schémas', 'Orientation : Bélier à gauche, sens inverse des aiguilles d’une montre', () => {
    const S = T.schemas;
    const p0 = S.pointSurCercle(100, 100, 50, 0), p90 = S.pointSurCercle(100, 100, 50, 90);
    const p180 = S.pointSurCercle(100, 100, 50, 180), p270 = S.pointSurCercle(100, 100, 50, 270);
    egal(p0.x, 50, '0° à gauche :');
    egal(p90.y, 150, '90° en bas :');
    egal(p180.x, 150, '180° à droite :');
    egal(p270.y, 50, '270° en haut :');
  });

  test('Schémas', 'Carte géocentrique : 12 signes, astres proches décalés vers le centre', () => {
    const S = T.schemas;
    const c = S.carteGeocentrique([{ cle: 'a', lon: 10 }, { cle: 'b', lon: 15 }, { cle: 'c', lon: 20 }, { cle: 'd', lon: 200 }, { cle: 'e', lon: 359 }]);
    egal(c.signes.length, 12, 'signes :');
    const n = Object.fromEntries(c.astres.map((x) => [x.cle, x.niveau]));
    egal(n.e, 1, 'niveau de e (359°, à 11° de a par-delà 0°) :');
    egal(n.a, 0, 'niveau de a :');
    egal(n.b, 1, 'niveau de b (à 5° de a) :');
    egal(n.c, 2, 'niveau de c (à 5° de b, à 10° de a) :');
    egal(n.d, 0, 'niveau de d (isolé) :');
    // Aucun chevauchement sur un même niveau.
    for (const x of c.astres) for (const y of c.astres) {
      if (x !== y && x.niveau === y.niveau) vrai(S.ecartAngulaire(x.lon, y.lon) >= S.GEO.seuilProximite, `${x.cle} et ${y.cle} se chevauchent`);
    }
    const b = c.astres.find((x) => x.cle === 'b');
    const rayon = Math.hypot(b.point.x - c.centre, b.point.y - c.centre);
    vrai(Math.abs(rayon - (S.GEO.rayonAstres - S.GEO.recul)) < 0.2, 'b doit reculer de 28px');
  });

  test('Schémas', 'Carte héliocentrique : orbites régulières de 40px puis +25px', () => {
    const S = T.schemas;
    const h = S.carteHeliocentrique(T.astres.positionsHeliocentriques(jour(2026, 11, 15)));
    egal(h.orbites.length, 8, 'orbites :');
    egal(h.orbites[0].rayon, 40, 'Mercure :');
    egal(h.orbites[7].rayon, 215, 'Neptune :');
    egal(h.orbites[2].cle, 'terre', 'troisième orbite :');
  });

  // =====================================================================
  //  MÉTHODOLOGIE
  // =====================================================================

  test('Méthodologie', 'Toutes les sections attendues sont présentes et rédigées', () => {
    const M = T.methodologie;
    vrai(M && M.donnees, 'module méthodologie manquant');

    const attendusNumero = ['pythagoricienne', 'reduction', 'cascade', 'semaineISO'];
    const attendusCiel = ['zodiaqueTropical', 'schlyter', 'kepler', 'perturbations', 'phases', 'dignites', 'transits'];
    for (const id of ['correspondances', 'leconDuJour'])
      vrai(M.donnees.croisee.sections[id] && M.donnees.croisee.sections[id].paragraphes.length, `section croisée « ${id} » manquante`);

    for (const id of attendusNumero) {
      const s = M.donnees.numerologie.sections[id];
      vrai(s, `section numérologie « ${id} » manquante`);
      vrai(typeof s.titre === 'string' && s.titre.length > 0, `titre manquant pour « ${id} »`);
      vrai(typeof s.resume === 'string' && s.resume.length > 0, `résumé manquant pour « ${id} »`);
      vrai(Array.isArray(s.paragraphes) && s.paragraphes.length > 0, `paragraphes manquants pour « ${id} »`);
    }

    for (const id of attendusCiel) {
      const s = M.donnees.ciel.sections[id];
      vrai(s, `section ciel « ${id} » manquante`);
      vrai(typeof s.titre === 'string' && s.titre.length > 0, `titre manquant pour « ${id} »`);
      vrai(typeof s.resume === 'string' && s.resume.length > 0, `résumé manquant pour « ${id} »`);
      vrai(Array.isArray(s.paragraphes) && s.paragraphes.length > 0, `paragraphes manquants pour « ${id} »`);
    }
  });

  test('Méthodologie', 'Recherche et navigation par mot-clé (trouver)', () => {
    const M = T.methodologie;
    egal(M.trouver('numerologie').type, 'domaine', 'domaine numérologie :');
    egal(M.trouver('ciel').type, 'domaine', 'domaine ciel :');
    egal(M.trouver('cascade').id, 'cascade', 'section cascade :');
    egal(M.trouver('cascade').domaine, 'numerologie', 'domaine de cascade :');
    egal(M.trouver('kepler').id, 'kepler', 'section kepler :');
    egal(M.trouver('kepler').domaine, 'ciel', 'domaine de kepler :');
    egal(M.trouver('dynamique').id, 'dignites', 'alias dynamique → dignités :');
    egal(M.trouver('aspects').id, 'ciel', 'alias aspects → ciel :');
  });

  test('Méthodologie', 'Les infobulles pointent vers des sections valides de la méthodologie', () => {
    const M = T.methodologie, TXT = T.textes;
    for (const cle in TXT.infobulles) {
      const info = TXT.infobulles[cle];
      vrai(info.sectionMethodologie, `infobulle « ${cle} » sans sectionMethodologie`);
      vrai(M.trouver(info.sectionMethodologie) !== null, `cible « ${info.sectionMethodologie} » de l'infobulle « ${cle} » introuvable dans la méthodologie`);
    }
  });

  // =====================================================================
  //  LECTURE CROISÉE & LEÇON DU JOUR (src/croisee.js)
  // =====================================================================

  test('Lecture croisée', 'Table de correspondances complète et cohérente avec les domiciles', () => {
    const C = T.croisee, A = T.astres;
    for (let n = 1; n <= 9; n++) {
      const c = C.CORRESPONDANCES[n];
      vrai(c, `nombre ${n} sans correspondance`);
      vrai(A.ASTRES[c.planete], `planète « ${c.planete} » du ${n} inconnue`);
      const signe = A.SIGNES.find((s) => s.nom === c.domicile);
      vrai(signe, `domicile « ${c.domicile} » du ${n} inconnu`);
      egal(signe.element, c.element, `élément du ${n} (domicile ${c.domicile}) :`);
      vrai(T.glossaire[T.cleGlossaire(c.domicile)].maitres.includes(c.planete), `${c.planete} n'est pas maître de ${c.domicile}`);
    }
    egal(C.correspondance(11).planete, 'lune', '11 → racine 2 → Lune :');
    egal(C.correspondance(22).planete, 'uranus', '22 → racine 4 → Uranus :');
    egal(C.correspondance(33).planete, 'venus', '33 → racine 6 → Vénus :');
  });

  test('Lecture croisée', 'Relations entre éléments (écho, complices, contraste)', () => {
    const r = T.croisee.relationElements;
    egal(r('feu', 'feu'), 'echo', 'feu/feu');
    egal(r('feu', 'air'), 'complices', 'feu/air');
    egal(r('terre', 'eau'), 'complices', 'terre/eau');
    egal(r('feu', 'eau'), 'contraste', 'feu/eau');
    egal(r('air', 'terre'), 'contraste', 'air/terre');
  });

  test('Lecture croisée', '15/11/2026 : jour 9 ↔ Mars en Lion, teinte Feu, conjonction Jupiter', () => {
    const L = T.croisee.lire(jour(2026, 11, 15), null, 'amour');
    egal(L.nombre, 9, 'jour universel');
    egal(L.source, 'universel', 'source');
    egal(L.astre.signe.nom, 'Lion', 'Mars en');
    egal(L.teinte.element, 'feu', 'teinte');
    egal(L.correspondances.find((c) => c.type === 'teinte').relation, 'echo', 'relation nombre/teinte');
    vrai(L.correspondances.some((c) => c.type === 'aspect' && c.texte.includes('conjonction avec Jupiter')), 'conjonction Mars–Jupiter absente');
  });

  test('Lecture croisée', 'Avec un profil, on croise le jour personnel', () => {
    const d = jour(2026, 10, 28), n = jour(1990, 5, 15);
    const L = T.croisee.lire(d, n, 'travail');
    egal(L.source, 'personnel', 'source');
    egal(L.nombre, T.numerologie.jourPersonnel(d, n), 'nombre');
  });

  test('Lecture croisée', 'Sur un an et 6 domaines : textes remplis et jamais répétés', () => {
    const C = T.croisee;
    for (let i = 0; i < 365; i += 5) {
      const d = new Date(2026, 0, 1 + i, 12);
      for (const dom of T.numerologie.DOMAINES) {
        const L = C.lire(d, i % 2 ? jour(1990, 5, 15) : null, dom);
        const phrases = [...L.correspondances.map((c) => c.texte), L.domaine.coteNombre, L.domaine.coteCiel, L.domaine.liaison];
        for (const p of phrases) vrai(typeof p === 'string' && p.length > 10 && !p.includes('undefined'), `${d.toDateString()} ${dom} : phrase vide ou incomplète « ${p} »`);
        egal(new Set(phrases).size, phrases.length, `${d.toDateString()} ${dom} : phrase répétée`);
      }
    }
  });

  test('Leçon du jour', 'Dates connues : lunaisons, station, maître-nombre (novembre 2026)', () => {
    const C = T.croisee;
    // Nouvelle lune 9 nov. 2026 07:02 TU, pleine lune 24 nov. 2026 14:53 TU.
    egal(C.lecon(jour(2026, 11, 9)).type, 'lunaison', '9/11 (nouvelle lune) :');
    vrai(C.lecon(jour(2026, 11, 9)).pourquoi.includes('nouvelle lune'), '9/11 : nouvelle lune attendue');
    vrai(C.lecon(jour(2026, 11, 24)).pourquoi.includes('pleine lune'), '24/11 : pleine lune attendue');
    // Mercure redevient direct le 13 nov. 2026.
    const st = C.lecon(jour(2026, 11, 13));
    egal(st.type, 'station', '13/11 (station de Mercure) :');
    egal(st.propre.astre, 'mercure', 'astre de la station :');
    // 19/11/2026 : 1 + 11 = 12 → 3 ; 3 + 19 = 22 (maître-nombre).
    egal(C.lecon(jour(2026, 11, 19)).type, 'maitreNombre', '19/11 (jour 22) :');
  });

  test('Leçon du jour', 'Sur deux ans : une seule journée par lunaison, fiches et méthodes valides', () => {
    const C = T.croisee, M = T.methodologie;
    let lunaisons = 0, precedente = false;
    for (let i = 0; i < 730; i++) {
      const l = C.lecon(new Date(2026, 0, 1 + i, 12));
      vrai(T.glossaire[l.cle], `jour ${i} : fiche « ${l.cle} » inconnue`);
      vrai(M.trouver(l.methode), `jour ${i} : méthode « ${l.methode} » introuvable`);
      vrai(l.texte && l.pourquoi, `jour ${i} : leçon vide`);
      const estLunaison = l.type === 'lunaison';
      vrai(!(estLunaison && precedente), `jour ${i} : deux jours de lunaison d'affilée`);
      if (estLunaison) lunaisons++;
      precedente = estLunaison;
    }
    // Environ 24,7 nouvelles + pleines lunes par an (lunaison de 29,53 j) → 49 en deux ans.
    vrai(lunaisons >= 48 && lunaisons <= 50, `${lunaisons} lunaisons sur deux ans (attendu ≈ 49)`);
  });

  // =====================================================================
  //  ASCENDANT & MAISONS (v0.6)
  // =====================================================================

  test('Villes', 'Heure légale → TU : hiver, été, avant 1976, guerre, avant 1911', () => {
    const V = T.villes;
    const tuDe = (j, h) => V.heureLegaleVersTU(j, h, 'Europe/Paris');
    egal(tuDe('1977-12-21', '10:40').date.toISOString(), '1977-12-21T09:40:00.000Z', 'hiver 1977 (TU+1) :');
    egal(tuDe('1990-07-14', '12:00').date.toISOString(), '1990-07-14T10:00:00.000Z', 'été 1990 (TU+2) :');
    egal(tuDe('1972-06-19', '04:50').date.toISOString(), '1972-06-19T03:50:00.000Z', 'été 1972, sans heure d’été (TU+1) :');
    egal(tuDe('1943-07-01', '12:00').decalage, 120, 'été 1943, heure allemande :');
    egal(V.texteDecalage(tuDe('1900-01-01', '12:00').decalage), 'TU+0 h 09 min 21 s', 'heure de Paris avant 1911 :');
  });

  test('Villes', 'Heure inexistante (passage à l’été) et ambiguë (retour à l’hiver)', () => {
    const V = T.villes;
    const printemps = V.heureLegaleVersTU('2021-03-28', '02:30', 'Europe/Paris');
    egal(printemps.statut, 'inexistante', '28/03/2021 2 h 30 :');
    egal(printemps.decalage, 60, 'décalage retenu (hiver) :');
    const automne = V.heureLegaleVersTU('2021-10-31', '02:30', 'Europe/Paris');
    egal(automne.statut, 'ambigue', '31/10/2021 2 h 30 :');
    egal(automne.date.toISOString(), '2021-10-31T00:30:00.000Z', 'première occurrence (heure d’été) :');
    egal(V.heureLegaleVersTU('2021-10-31', '12:00', 'Europe/Paris').statut, 'normale', 'midi le même jour :');
  });

  test('Villes', 'Table des villes : fuseaux reconnus, coordonnées plausibles, recherche sans accents', () => {
    const V = T.villes, problemes = [], noms = new Set();
    for (const v of V.VILLES) {
      try { new Intl.DateTimeFormat('fr', { timeZone: v.fuseau }); } catch { problemes.push(`${v.nom} : fuseau « ${v.fuseau} » inconnu`); }
      if (!(Math.abs(v.lat) <= 90 && Math.abs(v.lon) <= 180)) problemes.push(`${v.nom} : coordonnées hors limites`);
      if (v.pays === 'France' && !(v.lat > 41 && v.lat < 51.2 && v.lon > -5 && v.lon < 9.6)) problemes.push(`${v.nom} : hors de la métropole`);
      if (noms.has(V.libelle(v))) problemes.push(`${v.nom} : en double`);
      noms.add(V.libelle(v));
    }
    vrai(problemes.length === 0, problemes.join(' ; '));
    egal(V.trouver('saint etienne').nom, 'Saint-Étienne', 'recherche sans accents ni tiret :');
    egal(V.trouver('Amiens (France)').nom, 'Amiens', 'recherche par libellé :');
    egal(V.trouver('Atlantis'), null, 'ville inconnue :');
  });

  test('Maisons', 'Temps sidéral de Greenwich (Meeus, exemples 12.a et 12.b)', () => {
    const MS = T.maisons;
    // 10 avril 1987, 0 h TU → 13 h 10 min 46,3668 s = 197,693195°
    proche(MS.tempsSideralGreenwich(tu(1987, 4, 10)), 197.693195, 0.0001, '12.a :');
    // 10 avril 1987, 19 h 21 min TU → 8 h 34 min 57,0896 s = 128,737873°
    proche(MS.tempsSideralGreenwich(tu(1987, 4, 10, 19, 21)), 128.737873, 0.0001, '12.b :');
  });

  /** « 28°48' Capricorne » → longitude écliptique. */
  function lonSigne(degre, minute, nomSigne) {
    return T.astres.SIGNES.findIndex((s) => s.nom === nomSigne) * 30 + degre + minute / 60;
  }

  test('Maisons', 'Thème de référence d’hiver : 21/12/1977 10 h 40, Amiens (AA)', () => {
    // Valeurs publiées (Astrotheme, Placidus, acte de naissance). Tolérance 0,1° = 6'.
    const r = T.maisons.calculer({ naissance: '1977-12-21', heure: '10:40', lieu: T.villes.trouver('Amiens') });
    egal(r.systeme, 'placidus', 'système :');
    proche(r.asc, lonSigne(28, 48, 'Capricorne'), 0.1, 'Ascendant :');
    proche(r.mc, lonSigne(29, 21, 'Scorpion'), 0.1, 'Milieu du Ciel :');
    proche(r.cuspides[1], lonSigne(25, 16, 'Poissons'), 0.1, 'cuspide II :');
    proche(r.cuspides[2], lonSigne(4, 47, 'Taureau'), 0.1, 'cuspide III :');
    proche(r.cuspides[10], lonSigne(18, 8, 'Sagittaire'), 0.1, 'cuspide XI :');
    proche(r.cuspides[11], lonSigne(6, 6, 'Capricorne'), 0.1, 'cuspide XII :');
    // Le Soleil (29° Sagittaire) est juste sous le Milieu du Ciel… côté maison XI.
    egal(r.theme.positions.find((p) => p.cle === 'soleil').maison, 11, 'maison du Soleil :');
  });

  test('Maisons', 'Thèmes de référence d’été : 19/06/1972 Rueil-Malmaison, 23/06/1972 Marseille (AA)', () => {
    const MS = T.maisons, V = T.villes;
    const a = MS.calculer({ naissance: '1972-06-19', heure: '04:50', lieu: V.trouver('Rueil-Malmaison') });
    proche(a.asc, lonSigne(27, 10, 'Gémeaux'), 0.1, 'Rueil, Ascendant :');
    proche(a.mc, lonSigne(24, 53, 'Verseau'), 0.1, 'Rueil, Milieu du Ciel :');
    const b = MS.calculer({ naissance: '1972-06-23', heure: '03:00', lieu: V.trouver('Marseille') });
    proche(b.asc, lonSigne(28, 54, 'Taureau'), 0.1, 'Marseille, Ascendant :');
    proche(b.mc, lonSigne(4, 22, 'Verseau'), 0.1, 'Marseille, Milieu du Ciel :');
  });

  test('Maisons', 'Géométrie : AS à l’horizon est, MC au méridien, cuspides dans l’ordre (500 cas)', () => {
    const MS = T.maisons, RAD = Math.PI / 180;
    for (let k = 0; k < 500; k++) {
      const ramc = (k * 37.3) % 360, lat = -60 + (k * 13.7) % 120, eps = 23.44;
      const asc = MS.ascendant(ramc, eps, lat), mc = MS.milieuDuCiel(ramc, eps);
      // Coordonnées équatoriales d'un point de l'écliptique, puis hauteur sur l'horizon.
      const versEquateur = (l) => ({
        ad: Math.atan2(Math.sin(l * RAD) * Math.cos(eps * RAD), Math.cos(l * RAD)) / RAD,
        dec: Math.asin(Math.sin(eps * RAD) * Math.sin(l * RAD)) / RAD,
      });
      const e = versEquateur(asc), H = (ramc - e.ad) * RAD;
      const hauteur = Math.asin(Math.sin(lat * RAD) * Math.sin(e.dec * RAD) + Math.cos(lat * RAD) * Math.cos(e.dec * RAD) * Math.cos(H)) / RAD;
      vrai(Math.abs(hauteur) < 1e-6, `cas ${k} : Ascendant à ${hauteur.toFixed(4)}° de l’horizon`);
      vrai(Math.sin(H) < 0, `cas ${k} : Ascendant à l’ouest (il doit se lever à l’est)`);
      proche(versEquateur(mc).ad, ramc, 1e-6, `cas ${k} : MC hors du méridien :`);
      const c = MS.cuspidesPlacidus(ramc, eps, lat);
      if (!c) continue;
      // Chaque maison fait entre 0° et 180°, et le tour complet fait 360°.
      let tour = 0;
      for (let i = 0; i < 12; i++) {
        const largeur = ((c[(i + 1) % 12] - c[i]) % 360 + 360) % 360;
        vrai(largeur > 0 && largeur < 180, `cas ${k} : maison ${i + 1} de ${largeur.toFixed(1)}°`);
        tour += largeur;
      }
      vrai(Math.abs(tour - 360) < 1e-6, `cas ${k} : tour de ${tour}°`);
    }
  });

  test('Maisons', 'Latitude polaire : bascule en maisons égales', () => {
    const MS = T.maisons;
    let egales = 0;
    for (let ramc = 0; ramc < 360; ramc += 10) {
      if (!MS.cuspidesPlacidus(ramc, 23.44, 70)) egales++;
    }
    vrai(egales > 0, 'à 70° de latitude, Placidus devrait échouer pour certaines heures');
    const r = MS.angles(tu(2000, 6, 21, 12), { lat: 70, lon: 19 });
    if (r.systeme === 'egales') proche(r.cuspides[3], r.asc + 90, 1e-9, 'maison IV égale :');
    vrai(MS.cuspidesPlacidus(0, 23.44, 48.86), 'à Paris, Placidus doit toujours fonctionner');
  });

  test('Maisons', 'Rattachement aux 6 domaines : deux maisons chacun, chaque maison une fois, fiches présentes', () => {
    const MS = T.maisons, G = T.glossaire, vues = [];
    for (const d of T.numerologie.DOMAINES) {
      egal(MS.DOMAINES_MAISONS[d].length, 2, `domaine ${d} :`);
      vues.push(...MS.DOMAINES_MAISONS[d]);
    }
    egal(vues.sort((a, b) => a - b).join(','), '1,2,3,4,5,6,7,8,9,10,11,12', 'maisons couvertes :');
    egal(MS.domaineDeLaMaison(7), 'amour', 'maison VII :');
    egal(MS.domaineDeLaMaison(10), 'travail', 'maison X :');
    for (let n = 1; n <= 12; n++) {
      vrai(G['maison' + n] && G['maison' + n].categorie === 'maison', `fiche maison${n} manquante`);
      vrai(T.fiches.construire('maison' + n).blocs.some((b) => b.titre === 'Dans Toiles'), `fiche maison${n} : bloc « Dans Toiles » manquant`);
    }
    for (const cle of ['ascendant', 'milieuDuCiel', 'domification', 'cuspide']) vrai(G[cle], `notion « ${cle} » manquante`);
    vrai(T.methodologie.trouver('maisons') && T.methodologie.trouver('tempsSideral'), 'méthodologie des maisons manquante');
  });

  test('Maisons', 'Profil avec heure et lieu : enregistrement, refus d’une heure invalide, transits à l’heure exacte', () => {
    const P = T.profils, MS = T.maisons, lieu = { ...T.villes.trouver('Amiens') };
    const p = P.ajouter({ nom: 'Test maisons', naissance: '1977-12-21', heure: '10:40', lieu });
    try {
      egal(P.obtenir(p.id).heure, '10:40', 'heure enregistrée :');
      egal(P.obtenir(p.id).lieu.fuseau, 'Europe/Paris', 'fuseau enregistré :');
      let refus = null;
      try { P.modifier(p.id, { heure: '25:00' }); } catch (e) { refus = e.message; }
      vrai(refus && refus.includes('HH:MM'), 'une heure 25:00 aurait dû être refusée');
      egal(P.modifier(p.id, { heure: '' }).heure, null, 'heure vidée :');
      egal(MS.calculer(P.obtenir(p.id)), null, 'sans heure, pas de maisons :');
      const r = MS.calculer({ naissance: '1977-12-21', heure: '10:40', lieu });
      const res = T.transits.calculer(jour(2026, 11, 15), r.theme);
      egal(res.themeNatal.heurePrecise, true, 'les transits utilisent le thème à l’heure exacte :');
      egal(r.maisons.reduce((n, m) => n + m.astres.length, 0), 9, 'les 9 astres sont rangés dans une maison :');
    } finally {
      P.supprimer(p.id);
    }
  });

  // =====================================================================
  //  v0.7 — CONSOLIDATION & ÉVOLUTIONS
  // =====================================================================

  test('Profils', 'Import : ajout, doublons (nom sans accents ni majuscules + date), invalides, format', () => {
    const P = T.profils;
    const avant = P.lister().length;
    const temoin = P.ajouter({ nom: 'Témoin Import', naissance: '1990-05-15' });
    const crees = [];
    try {
      const fichier = JSON.stringify({ application: 'Toiles', version: 1, profils: [
        { id: 'x1', nom: '  temoin import ', naissance: '1990-05-15' },            // doublon du témoin
        { id: temoin.id, nom: 'Autre Import', naissance: '1985-01-02', nomComplet: 'Anne Autre' }, // id déjà pris → nouvel id
        { nom: 'Sans date' },                                                      // invalide
        { nom: 'Heure fausse', naissance: '2000-01-01', heure: '25:00' },           // invalide
        { nom: 'Autre Import', naissance: '1985-01-02' },                           // doublon interne au fichier
      ] });
      const r = P.importer(fichier);
      crees.push(...r.ajoutes.map((p) => p.id));
      egal(r.ajoutes.length, 1, 'ajoutés :');
      vrai(r.ajoutes[0].id !== temoin.id, 'un id déjà utilisé doit être remplacé');
      egal(r.ajoutes[0].nomComplet, 'Anne Autre', 'nom complet conservé :');
      egal(r.doublons.length, 2, 'doublons :');
      egal(r.invalides.length, 2, 'invalides :');
      egal(P.lister().length, avant + 2, 'profils enregistrés :');
      // Une simple liste est acceptée ; un fichier illisible ou étranger est refusé.
      egal(P.importer('[]').ajoutes.length, 0, 'liste vide :');
      for (const [texte, motif] of [['pas du json', 'JSON'], ['{"a":1}', 'liste'], ['{"application":"Autre","profils":[]}', 'Autre']]) {
        let msg = '';
        try { P.importer(texte); } catch (e) { msg = e.message; }
        vrai(msg.includes(motif), `« ${texte} » aurait dû être refusé (${motif})`);
      }
      // Aller-retour : réimporter son propre export ne crée rien.
      egal(P.importer(P.exporter()).ajoutes.length, 0, 'réimport de l’export :');
    } finally {
      P.supprimer(temoin.id);
      crees.forEach(P.supprimer);
    }
  });

  test('Numérologie', 'Cycles longs (15/05/1990, le 16/11/2026) : pinacles, défis, cycles de vie, cycle de 9 ans', () => {
    const N = T.numerologie;
    const c = N.cyclesLongs(jour(1990, 5, 15), jour(2026, 11, 16));
    egal(c.pinacles.map((p) => p.valeur).join(' '), '11 7 9 6', 'pinacles (5+6=11 gardé, 6+1, 11+7=18→9, 5+1) :');
    egal(c.defis.map((p) => p.valeur).join(' '), '1 5 4 4', 'défis :');
    egal(c.pinacles.map((p) => p.ageFin ?? 'fin').join(' '), '33 42 51 fin', 'âges de fin (36 − 3, +9, +9) :');
    egal(c.cyclesDeVie.map((p) => p.valeur).join(' '), '5 6 1', 'cycles de vie (mois, jour, année) :');
    egal(c.age, 36, 'âge :');
    egal(c.pinacles.findIndex((p) => p.actif), 1, '2e pinacle en cours à 36 ans :');
    egal(c.cyclesDeVie.findIndex((p) => p.actif), 1, 'cycle de maturité en cours :');
    egal(c.cycleNeufAns.rang, N.reduire(N.anneePersonnelle(jour(2026, 11, 16), jour(1990, 5, 15)), false), 'rang = année personnelle :');
    egal(c.cycleNeufAns.anneeDebut, 2024, 'année 1 du cycle :');
    // Chemin de vie maître-nombre : 11 compte pour 2 dans « 36 − chemin ».
    const m = N.cyclesLongs(jour(1984, 11, 5)); // 5 + 11 + 22 = 38 → 11
    egal(N.cheminDeVie(jour(1984, 11, 5)), 11, 'chemin de vie 05/11/1984 :');
    egal(m.pinacles[0].ageFin, 34, 'chemin 11 → 1er pinacle jusqu’à 34 ans :');
    // Défis toujours entre 0 et 8, âges croissants, sur 30 ans de naissances.
    for (let a = 1950; a < 1980; a++) {
      const x = N.cyclesLongs(jour(a, (a % 12) + 1, (a % 28) + 1));
      vrai(x.defis.every((d) => d.valeur >= 0 && d.valeur <= 8), `défi hors 0–8 en ${a}`);
      vrai(x.pinacles[0].ageFin >= 27 && x.pinacles[0].ageFin <= 35, `1er pinacle anormal en ${a}`);
    }
  });

  test('Numérologie', 'Âge révolu : la veille et le jour de l’anniversaire', () => {
    const N = T.numerologie;
    egal(N.ageRevolu(jour(1990, 5, 15), jour(2026, 5, 14)), 35, 'veille :');
    egal(N.ageRevolu(jour(1990, 5, 15), jour(2026, 5, 15)), 36, 'jour même :');
  });

  test('Numérologie', 'Nombres du nom : table pythagoricienne, accents, ligatures, maîtres-nombres', () => {
    const N = T.numerologie;
    egal('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(N.valeurLettre).join(''), '12345678912345678912345678', 'table A–Z :');
    egal(N.motsDuNom("Hélène-Ève d'Aÿ Cœur").join(' '), 'HELENE EVE D AY COEUR', 'nettoyage :');
    const n = N.nombresDuNom('Jean Dupont');
    // JEAN = 1+5+1+5 = 12 → 3 ; DUPONT = 4+3+7+6+5+2 = 27 → 9 ; 3 + 9 = 12 → 3
    egal(n.expression.valeur, 3, 'expression Jean Dupont :');
    egal(n.elanSpirituel.valeur, 6, 'élan spirituel (E A + U O = 6 + 9 = 15 → 6) :');
    egal(n.moiIntime.valeur, 6, 'moi intime (J N = 6 ; D P N T = 18 → 9 ; 6 + 9 = 15 → 6) :');
    // Maîtres-nombres gardés à chaque marche : MARIO = 4+1+9+9+6 = 29 → 11 ; 11 + 11 = 22.
    const m = N.nombreDuNom('Mario Mario');
    egal(m.valeur, 22, 'Mario Mario :');
    vrai(m.etapes[0].endsWith('29 → 11'), 'MARIO réduit à 11, pas à 2');
    egal(N.nombreDuNom('---').valeur, null, 'aucune lettre :');
  });

  test('Ciel', 'Pluton : entrées en Capricorne (26/01/2008) et en Verseau (19/11/2024), J2000', () => {
    const CP = T.complements;
    proche(CP.longitude('pluton', tu(2008, 1, 26, 12)), 270, 0.15, 'Pluton 26/01/2008');
    proche(CP.longitude('pluton', tu(2024, 11, 19, 12)), 300, 0.15, 'Pluton 19/11/2024');
    proche(CP.longitude('pluton', tu(2000, 1, 1, 12)), 251.45, 0.15, 'Pluton 1/1/2000 (11°27′ Sagittaire)');
  });

  test('Ciel', 'Chiron : entrées en Bélier (17/04/2018), Poissons (20/04/2010), Taureau (19/06/2026)', () => {
    const CP = T.complements;
    proche(CP.longitude('chiron', tu(2018, 4, 17, 12)), 0, 0.5, 'Chiron 17/04/2018');
    proche(CP.longitude('chiron', tu(2010, 4, 20, 12)), 330, 0.5, 'Chiron 20/04/2010');
    proche(CP.longitude('chiron', tu(2026, 6, 19, 12)), 30, 0.5, 'Chiron 19/06/2026');
    proche(CP.longitude('chiron', tu(2001, 12, 11, 12)), 270, 0.5, 'Chiron 11/12/2001 (entrée en Capricorne)');
  });

  test('Ciel', 'Nœuds lunaires : nœud moyen de Meeus (exemple 47.a), Sud opposé, recul ≈ 19,3°/an', () => {
    const CP = T.complements;
    // Meeus, exemple 47.a : 12 avril 1992 à 0 h TD → Ω = 274,400656° (TD ≈ TU à 1 min près).
    proche(CP.noeudMoyen(tu(1992, 4, 12)), 274.400656, 0.01, 'Nœud Nord 12/04/1992');
    proche(CP.longitude('noeudSud', tu(1992, 4, 12)), 94.400656, 0.01, 'Nœud Sud 12/04/1992');
    let recul = CP.noeudMoyen(tu(2026, 1, 1)) - CP.noeudMoyen(tu(2027, 1, 1));
    recul = ((recul % 360) + 360) % 360;
    vrai(Math.abs(recul - 19.34) < 0.05, `recul annuel ${recul.toFixed(2)}° (attendu ≈ 19,34°)`);
    const pos = CP.positions(jour(2026, 11, 16));
    vrai(pos.find((p) => p.cle === 'noeudNord').retrograde, 'le nœud moyen recule toujours (℞)');
    egal(pos.length, 4, 'points complémentaires :');
    vrai(pos.every((p) => p.complement && T.glossaire[p.cle]), 'chaque point a sa fiche');
  });

  test('Ciel', 'Sidéral : ayanamsas Lahiri et Fagan-Bradley, conversion des longitudes', () => {
    const CP = T.complements;
    // Lahiri publié : 23°51′ au 1/1/2000, ≈ 24°13′ en 2026.
    vrai(Math.abs(CP.ayanamsa(tu(2000, 1, 1, 12), 'lahiri') - 23.853) < 0.01, 'Lahiri 2000');
    vrai(Math.abs(CP.ayanamsa(tu(2026, 7, 1), 'lahiri') - 24.22) < 0.02, `Lahiri 2026 : ${CP.ayanamsa(tu(2026, 7, 1), 'lahiri')}`);
    const ecart = CP.ayanamsa(tu(2026, 7, 1), 'faganBradley') - CP.ayanamsa(tu(2026, 7, 1), 'lahiri');
    vrai(Math.abs(ecart - 0.887) < 0.01, 'Fagan-Bradley − Lahiri ≈ 0°53′');
    proche(CP.versSideral(10, tu(2000, 1, 1, 12), 'lahiri'), 346.147, 0.01, '10° Bélier tropical → Poissons sidéral');
    const comp = CP.comparerSideral(T.astres.positions(jour(2026, 11, 16)), jour(2026, 11, 16));
    egal(comp.length, 9, 'comparaison des 9 astres :');
    vrai(comp.every((x) => x.change === (x.tropical.index !== x.sideral.index)), 'drapeau « change » cohérent');
  });

  test('Calendrier', 'Lunaisons de novembre 2026 et janvier 2026 (dates publiées, heure de Paris)', () => {
    const CAL = T.calendrier;
    const lun = (a, m) => CAL.mois(a, m).lunaisons.map((j) => `${j.date.slice(8)} ${j.lunaison.cle}`).join(', ');
    egal(lun(2026, 10), '01 dernierQuartier, 09 nouvelle, 17 premierQuartier, 24 pleine', 'novembre 2026 :');
    egal(lun(2026, 0), '03 pleine, 10 dernierQuartier, 18 nouvelle, 26 premierQuartier', 'janvier 2026 :');
  });

  test('Calendrier', 'Grille : semaines du lundi au dimanche, nombres = cascade du jour', () => {
    const CAL = T.calendrier, N = T.numerologie;
    const m = CAL.mois(2026, 10, jour(1990, 5, 15), new Set(['2026-11-16']));
    egal(m.semaines[0].findIndex(Boolean), 6, 'le 1er novembre 2026 est un dimanche :');
    vrai(m.semaines.every((s) => s.length === 7), 'semaines de 7 cases');
    const j16 = m.semaines.flat().find((j) => j && j.numero === 16);
    egal(j16.jourUniversel, N.jourUniversel(jour(2026, 11, 16)), 'jour universel du 16 :');
    egal(j16.jourPersonnel, N.jourPersonnel(jour(2026, 11, 16), jour(1990, 5, 15)), 'jour personnel du 16 :');
    egal(j16.journal, true, 'note au journal marquée :');
    // Sur deux ans : 4 moments clés par lunaison, jamais deux le même jour.
    let total = 0;
    for (let a = 2025; a <= 2026; a++) for (let mo = 0; mo < 12; mo++) total += CAL.mois(a, mo).lunaisons.length;
    vrai(total >= 97 && total <= 100, `≈ 99 moments clés sur deux ans (obtenu ${total})`);
  });

  test('Journal', 'Écrire, relire, remplacer, effacer, exporter', () => {
    const J = T.journal, profil = 'test-journal';
    try {
      const ctx = J.contexteDuJour(jour(2026, 11, 16), jour(1990, 5, 15));
      egal(ctx.jourUniversel, T.numerologie.jourUniversel(jour(2026, 11, 16)), 'contexte, jour universel :');
      J.ecrire({ date: '2026-11-16', profil, texte: '  Belle journée  ', humeur: 4, contexte: ctx });
      egal(J.lire('2026-11-16', profil).texte, 'Belle journée', 'texte relu (espaces retirés) :');
      egal(J.lire('2026-11-16', ''), null, 'une autre personne n’a pas de note :');
      J.ecrire({ date: '2026-11-16', profil, texte: 'Corrigé' });
      egal(J.lister(profil).length, 1, 'une seule note par jour et par profil :');
      J.ecrire({ date: '2026-11-17', profil, texte: 'Le lendemain' });
      egal(J.lister(profil)[0].date, '2026-11-17', 'la plus récente en tête :');
      vrai(J.datesRemplies(profil).has('2026-11-16'), 'dates remplies');
      vrai(J.exporterTexte().includes('## 16/11/2026'), 'export texte');
      egal(JSON.parse(J.exporter()).type, 'journal', 'export JSON :');
      let refus = '';
      try { J.ecrire({ date: '2026-11-16', profil, texte: 'x', humeur: 9 }); } catch (e) { refus = e.message; }
      vrai(refus.includes('1 à 5'), 'humeur hors 1–5 refusée');
      egal(J.ecrire({ date: '2026-11-16', profil, texte: '   ' }), null, 'texte vide = effacement :');
      egal(J.lire('2026-11-16', profil), null, 'note effacée :');
    } finally {
      J.effacer('2026-11-16', profil);
      J.effacer('2026-11-17', profil);
    }
  });

  test('Quiz', '2 000 questions : 4 choix distincts, une seule bonne réponse, nom masqué', () => {
    const Q = T.quiz, G = T.glossaire;
    // Hasard fixe (suite à graine) : le test donne toujours les mêmes questions.
    let graine = 42;
    const hasard = () => { graine = (graine * 16807) % 2147483647; return (graine - 1) / 2147483646; };
    const sortes = new Set();
    for (const categorie of ['tout', ...T.fiches.CATEGORIES.map((c) => c.id)]) {
      for (let i = 0; i < 2000 / 7; i++) {
        const q = Q.question(categorie, hasard);
        sortes.add(q.type);
        egal(q.choix.length, Q.NB_CHOIX, `${q.cle} (${q.type}) : nombre de choix :`);
        egal(new Set(q.choix.map((c) => c.libelle)).size, Q.NB_CHOIX, `${q.cle} : choix en double :`);
        vrai(q.bonne >= 0 && Q.verifier(q, q.bonne), `${q.cle} : bonne réponse absente`);
        vrai(q.enonce && q.explication, `${q.cle} : énoncé vide`);
        if (q.type === 'definition' || q.type === 'motsCles') {
          const nom = Q.nomNu(G[q.cle].titre);
          vrai(nom.length <= 3 || !q.enonce.toLowerCase().includes(nom.toLowerCase()), `${q.cle} : le nom « ${nom} » apparaît dans l’énoncé`);
          if (categorie !== 'tout') egal(G[q.choix[0].cle].categorie, categorie, `${q.cle} : catégorie des choix :`);
        }
      }
    }
    egal([...sortes].sort().join(' '), 'definition element maitre motsCles', 'les 4 sortes de questions :');
  });

  test('Méthodologie', 'Sections et infobulles de la v0.7', () => {
    const M = T.methodologie, I = T.textes.infobulles;
    for (const s of ['cyclesLongs', 'nomComplet', 'complements', 'sideral', 'calendrier', 'journal', 'quiz', 'sauvegardes'])
      vrai(M.trouver(s), `section « ${s} » manquante`);
    for (const cle of ['cycles', 'nom', 'complements', 'sideral', 'calendrier', 'journal']) {
      vrai(I[cle] && I[cle].principe && I[cle].base && I[cle].limites, `infobulle « ${cle} » incomplète`);
      vrai(M.trouver(I[cle].sectionMethodologie), `infobulle « ${cle} » : section « ${I[cle].sectionMethodologie} » introuvable`);
    }
  });

  T.tests = { liste: tests };
})(globalThis.Toiles = globalThis.Toiles || {});

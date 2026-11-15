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
  //  MÉTHODOLOGIE
  // =====================================================================

  test('Méthodologie', 'Toutes les sections attendues sont présentes et rédigées', () => {
    const M = T.methodologie;
    vrai(M && M.donnees, 'module méthodologie manquant');

    const attendusNumero = ['pythagoricienne', 'reduction', 'cascade', 'semaineISO'];
    const attendusCiel = ['zodiaqueTropical', 'schlyter', 'kepler', 'perturbations', 'phases', 'dignites', 'transits'];

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

  T.tests = { liste: tests };
})(globalThis.Toiles = globalThis.Toiles || {});

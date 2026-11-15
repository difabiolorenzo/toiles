/**
 * Toiles — Lecture croisée & Leçon du jour.
 *
 * Calculs purs (aucun DOM) : ce fichier relie les deux langages de Toiles.
 *
 *   1. CORRESPONDANCES : la table nombre ↔ planète ↔ élément.
 *   2. lire()          : la lecture croisée d'une date, pour un domaine de vie.
 *                        Elle n'invente pas de note globale : elle liste des
 *                        correspondances, chacune expliquée en une phrase.
 *   3. lecon()         : la « leçon du jour », un concept marquant de la date
 *                        (pleine lune, maître-nombre, aspect exact…) expliqué
 *                        à partir des fiches du glossaire.
 *
 * Dépend de : numerologie.js, astres.js, glossaire.js, positions.js.
 * Ces modules sont lus AU MOMENT DE L'APPEL (pas au chargement), comme
 * numerologie.interpreter() : l'ordre des <script> ne pose donc pas de souci.
 */
(function (T) {
  'use strict';

  // ===================== 1. Table de correspondances =====================
  //
  // Il n'existe pas UNE table officielle : chaque école associe les nombres aux
  // astres un peu différemment. Toiles retient la table la plus répandue dans la
  // numérologie occidentale moderne en français (héritée de Cheiro et reprise par
  // la plupart des manuels), adaptée aux 9 astres que Toiles calcule :
  //
  //   1 Soleil · 2 Lune · 3 Jupiter · 4 Uranus · 5 Mercure
  //   6 Vénus  · 7 Neptune · 8 Saturne · 9 Mars
  //
  // Maîtres-nombres : 11, 22 et 33 gardent la planète de leur racine (2, 4, 6),
  // car ils en sont « l'octave supérieure » (voir la fiche Maître-nombre).
  //
  // L'élément d'un nombre est celui du DOMICILE de sa planète (convention Toiles) :
  // Soleil → Lion (feu), Lune → Cancer (eau), Jupiter → Sagittaire (feu),
  // Uranus → Verseau (air), Mercure → Gémeaux (air), Vénus → Taureau (terre),
  // Neptune → Poissons (eau), Saturne → Capricorne (terre), Mars → Bélier (feu).
  // Mercure et Vénus ont deux domiciles : on garde le premier dans l'ordre du zodiaque.
  // Tu peux modifier cette table : les tests vérifient seulement qu'elle est complète.
  const CORRESPONDANCES = {
    1: { planete: 'soleil',  element: 'feu',   domicile: 'Lion' },
    2: { planete: 'lune',    element: 'eau',   domicile: 'Cancer' },
    3: { planete: 'jupiter', element: 'feu',   domicile: 'Sagittaire' },
    4: { planete: 'uranus',  element: 'air',   domicile: 'Verseau' },
    5: { planete: 'mercure', element: 'air',   domicile: 'Gémeaux' },
    6: { planete: 'venus',   element: 'terre', domicile: 'Taureau' },
    7: { planete: 'neptune', element: 'eau',   domicile: 'Poissons' },
    8: { planete: 'saturne', element: 'terre', domicile: 'Capricorne' },
    9: { planete: 'mars',    element: 'feu',   domicile: 'Bélier' },
  };

  /** « du Feu », « de la Terre », « de l'Air », « de l'Eau ». */
  const deLElement = (el) => ({ feu: 'du Feu', terre: 'de la Terre', air: 'de l’Air', eau: 'de l’Eau' })[el];

  /** Correspondance d'un nombre (maîtres-nombres → leur racine). */
  function correspondance(n) {
    const racine = n > 9 ? T.numerologie.reduire(n, false) : n;
    return { nombre: n, racine, ...CORRESPONDANCES[racine] };
  }

  /**
   * Relation entre deux éléments, selon la règle astrologique classique :
   *   - même élément           → « écho »      (les deux disent la même chose) ;
   *   - Feu/Air ou Terre/Eau   → « complices » (actifs entre eux, réceptifs entre eux :
   *                               l'air attise le feu, l'eau nourrit la terre) ;
   *   - sinon                  → « contraste » (deux manières d'être à concilier).
   */
  function relationElements(a, b) {
    if (a === b) return 'echo';
    const actifs = ['feu', 'air'];
    return actifs.includes(a) === actifs.includes(b) ? 'complices' : 'contraste';
  }

  // ===================== 2. Lecture croisée =====================

  /** Article devant un astre : « le Soleil », « la Lune », « Mars ». */
  const leAstre = (cle) => ({ soleil: 'le ', lune: 'la ' }[cle] || '') + T.astres.ASTRES[cle].nom;
  const LeAstre = (cle) => { const s = leAstre(cle); return s[0].toUpperCase() + s.slice(1); };

  /**
   * Lecture croisée d'une date.
   *   date      : Date (lecture « par jour »)
   *   naissance : Date ou null — si présente, on croise le JOUR PERSONNEL, sinon le jour universel
   *   domaine   : une des 6 clés de domaine ('essence', 'amour'…)
   *
   * Renvoie {
   *   nombre, source ('personnel' | 'universel'), correspondance,
   *   astre        : position du jour de la planète associée,
   *   dignite      : sa dignité dans son signe du jour (src/positions.js),
   *   teinte       : élément dominant du ciel (astres.teinteDuJour),
   *   correspondances : [{ type, relation?, texte }]  ← les liens expliqués,
   *   domaine      : { cote_nombre, cote_ciel, liaison } ← trois phrases distinctes
   * }
   */
  function lire(date, naissance, domaine = 'essence') {
    const N = T.numerologie, A = T.astres, G = T.glossaire;
    const nombre = naissance ? N.jourPersonnel(date, naissance) : N.jourUniversel(date);
    const corr = correspondance(nombre);
    const pos = A.positions(date);
    const astre = pos.find((p) => p.cle === corr.planete);
    const cleSigne = T.cleGlossaire(astre.signe.nom);
    const dignite = T.positions.dignite(astre.cle, cleSigne);
    const teinte = A.teinteDuJour(pos);

    const correspondances = [];

    // a) Le nombre et sa planète : où est-elle aujourd'hui ?
    correspondances.push({
      type: 'planete',
      texte: `Le ${nombre} est associé à ${leAstre(corr.planete)}${nombre > 9 ? ` (par sa racine ${corr.racine})` : ''}. ` +
        `Aujourd’hui, ${leAstre(corr.planete)} est en ${astre.signe.nom}${astre.retrograde ? ', rétrograde' : ''} : ${dignite.libelle}.`,
    });

    // b) L'élément du nombre face au signe actuel de sa planète.
    const relSigne = relationElements(corr.element, astre.signe.element);
    const phrasesSigne = {
      echo: `${LeAstre(corr.planete)} traverse un signe ${deLElement(corr.element)}, l’élément du ${nombre} : la planète joue dans son registre.`,
      complices: `${LeAstre(corr.planete)} est dans un signe ${deLElement(astre.signe.element)}, élément complice ${deLElement(corr.element)} du ${nombre} : le registre change, l’élan reste compatible.`,
      contraste: `${LeAstre(corr.planete)} est dans un signe ${deLElement(astre.signe.element)}, loin ${deLElement(corr.element)} du ${nombre} : la planète s’exprime dans un registre inhabituel pour ce nombre.`,
    };
    correspondances.push({ type: 'signe', relation: relSigne, texte: phrasesSigne[relSigne] });

    // c) L'élément du nombre face à la teinte du ciel (élément dominant).
    const relTeinte = relationElements(corr.element, teinte.element);
    const phrasesTeinte = {
      echo: `La teinte du jour est elle aussi ${deLElement(teinte.element)} : nombre et ciel parlent le même langage.`,
      complices: `La teinte du jour est ${deLElement(teinte.element)}, élément complice ${deLElement(corr.element)} du ${nombre} : les deux lectures se soutiennent.`,
      contraste: `La teinte du jour est ${deLElement(teinte.element)}, en contraste avec l’élément ${deLElement(corr.element)} du ${nombre} : deux manières d’avancer à concilier.`,
    };
    correspondances.push({ type: 'teinte', relation: relTeinte, texte: phrasesTeinte[relTeinte] });

    // d) Les aspects serrés (≤ 3°) que reçoit la planète du nombre.
    for (const x of A.aspects(pos).filter((x) => (x.a === corr.planete || x.b === corr.planete) && x.ecart <= 3).slice(0, 2)) {
      const autre = x.a === corr.planete ? x.b : x.a;
      correspondances.push({
        type: 'aspect',
        relation: x.nature,
        texte: `${LeAstre(corr.planete)} forme ${unAspect(x.nom)} avec ${leAstre(autre)} (écart ${x.ecart.toFixed(1).replace('.', ',')}°) : ` +
          ({ harmonie: 'le thème du nombre trouve un appui.', tension: 'le thème du nombre rencontre une résistance.', fusion: 'le thème du nombre se mêle à celui de cet astre.' })[x.nature],
      });
    }

    // e) Le domaine choisi : une phrase côté nombre, une côté ciel, une pour les relier.
    //    Trois sources différentes (glossaire du nombre, glossaire de la planète,
    //    relation des éléments) : la même idée n'est jamais dite deux fois.
    const sens = G[T.cleNombre(nombre)];
    const liaisons = {
      echo: 'Les deux se renforcent : c’est le moment d’aller dans ce sens.',
      complices: 'Les deux se complètent : l’un donne la direction, l’autre le moyen.',
      contraste: 'Les deux tirent dans des sens différents : chercher le point de rencontre plutôt que choisir.',
    };
    return {
      nombre,
      source: naissance ? 'personnel' : 'universel',
      correspondance: corr,
      astre,
      dignite,
      teinte,
      correspondances,
      domaine: {
        cle: domaine,
        coteNombre: `${sens.mot} — ${sens.domaines[domaine]}`,
        coteCiel: `${A.ASTRES[corr.planete].nom} en ${astre.signe.nom} — ${G[corr.planete].domaines[domaine]}`,
        liaison: liaisons[relTeinte],
      },
    };
  }

  // ===================== 3. Leçon du jour =====================
  //
  // Chaque jour, UN concept à apprendre, choisi parce qu'il se voit dans le ciel
  // ou les nombres de la date. Priorité (du plus rare au plus courant) :
  //   1. lunaison       : nouvelle ou pleine lune à moins de 6,5° de l'exact
  //                       (la Lune gagne ~12° par jour sur le Soleil : c'est « le jour J ») ;
  //   2. station        : une planète change de sens (rétrograde ↔ directe) ;
  //   3. maître-nombre  : le jour universel vaut 11, 22 ou 33 ;
  //   4. aspect exact   : écart < 0,5° entre deux planètes (Lune exclue, trop rapide) ;
  //   5. rétrogradation : Mercure, Vénus ou Mars rétrograde (ressenties au quotidien) ;
  //   6. sinon          : une notion de base, qui tourne avec le jour de l'année.
  // Le texte vient des fiches du glossaire : la leçon ne réécrit rien, elle choisit.

  const UN_JOUR = 86400000;
  const NOTIONS_DE_BASE = ['reduction', 'cascade', 'orbe', 'degre', 'phase', 'cheminDeVie', 'maitreNombre', 'transit'];

  /** Écart entre deux angles en degrés, sur le cercle (359° et 1° sont à 2°). */
  function ecartAngulaire(a, b) {
    const d = Math.abs(((a - b) % 360 + 360) % 360);
    return d > 180 ? 360 - d : d;
  }

  /** « un carré », « une conjonction » : les aspects féminins prennent « une ». */
  const unAspect = (nom) => (['Conjonction', 'Opposition'].includes(nom) ? 'une ' : 'un ') + nom.toLowerCase();

  /** Jour de l'année (1 à 366), pour faire tourner les notions de base. */
  function jourDeLAnnee(date) {
    return Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - new Date(date.getFullYear(), 0, 0)) / UN_JOUR);
  }

  /** Assemble une leçon à partir d'une fiche du glossaire. */
  function depuisFiche(type, cle, pourquoi, methode, astre) {
    const f = T.glossaire[cle];
    return {
      type, cle, titre: f.titre, pourquoi,
      texte: [f.court, f.detail].filter(Boolean).join(' '),
      effet: f.effet || null,
      propre: astre && f.parAstre && f.parAstre[astre] ? { astre, texte: f.parAstre[astre] } : null,
      methode,
    };
  }

  function lecon(date) {
    const A = T.astres, N = T.numerologie;

    // 1. Lunaison : on garde le jour civil où la Lune est la plus proche de l'exact
    //    (comparaison avec la veille et le lendemain), pour ne jamais en signaler deux.
    const veille = new Date(date.getTime() - UN_JOUR), lendemain = new Date(date.getTime() + UN_JOUR);
    for (const [cible, pourquoi] of [
      [180, 'C’est la pleine lune : le Soleil et la Lune sont face à face, à 180°.'],
      [0, 'C’est la nouvelle lune : la Lune passe entre la Terre et le Soleil, invisible.'],
    ]) {
      const ecartJour = (d) => ecartAngulaire(A.phaseLunaire(d).elongation, cible);
      const aujourdhui = ecartJour(date);
      if (aujourdhui <= 6.5 && aujourdhui <= ecartJour(veille) && aujourdhui < ecartJour(lendemain))
        return depuisFiche('lunaison', 'phase', pourquoi, 'phases');
    }

    // 2. Station : le sens de marche change entre aujourd'hui et demain
    //    (comparer aujourd'hui à demain, et non hier à demain, désigne un seul jour).
    const auj = A.positions(date);
    const demain = A.positions(lendemain);
    for (let i = 0; i < auj.length; i++) {
      if (auj[i].retrograde !== demain[i].retrograde) {
        const sens = demain[i].retrograde ? 'entre en rétrogradation' : 'reprend sa marche directe';
        return depuisFiche('station', 'retrograde', `${LeAstre(auj[i].cle)} ${sens} : vue de la Terre, la planète semble s’arrêter avant de changer de sens.`, 'ciel', auj[i].cle);
      }
    }

    // 3. Maître-nombre du jour
    const ju = N.jourUniversel(date);
    if (ju > 9)
      return depuisFiche('maitreNombre', 'maitreNombre', `Le jour universel vaut ${ju}, un maître-nombre : on ne le réduit pas en ${N.reduire(ju, false)}.`, 'reduction');

    // 4. Aspect exact
    const pos = A.positions(date);
    const exact = A.aspects(pos).find((x) => x.a !== 'lune' && x.b !== 'lune' && x.ecart < 0.5);
    if (exact)
      return depuisFiche('aspect', T.cleGlossaire(exact.nom),
        `${LeAstre(exact.a)} et ${leAstre(exact.b)} forment ${unAspect(exact.nom)} presque ${['Conjonction', 'Opposition'].includes(exact.nom) ? 'exacte' : 'exact'} (écart ${exact.ecart.toFixed(1).replace('.', ',')}°).`, 'ciel');

    // 5. Rétrogradation d'une planète personnelle
    const retro = pos.find((p) => p.retrograde && ['mercure', 'venus', 'mars'].includes(p.cle));
    if (retro)
      return depuisFiche('retrogradation', 'retrograde', `${LeAstre(retro.cle)} est rétrograde en ce moment.`, 'ciel', retro.cle);

    // 6. Notion de base, qui change chaque jour
    const cle = NOTIONS_DE_BASE[jourDeLAnnee(date) % NOTIONS_DE_BASE.length];
    return depuisFiche('notion', cle, 'Rien de rare dans le ciel aujourd’hui : une notion de base à revoir.', cle === 'phase' ? 'phases' : cle === 'orbe' || cle === 'degre' ? 'ciel' : cle === 'transit' ? 'transits' : cle === 'maitreNombre' ? 'reduction' : 'cascade');
  }

  T.croisee = { CORRESPONDANCES, correspondance, relationElements, lire, lecon };
})(globalThis.Toiles = globalThis.Toiles || {});

/**
 * Toiles — quiz d'apprentissage.
 *
 * Fabrique des questions à choix multiples à partir des fiches du glossaire
 * (src/glossaire.js) : on n'écrit AUCUNE question à la main. Ajouter une fiche
 * ajoute donc automatiquement des questions possibles.
 *
 * Quatre sortes de questions :
 *   - definition : on lit une définition, on retrouve la notion ;
 *   - motsCles   : on lit trois mots-clés, on retrouve la notion ;
 *   - element    : l'élément (Feu, Terre, Air, Eau) d'un signe ;
 *   - maitre     : la planète qui gouverne un signe.
 * Les mauvaises réponses viennent de la MÊME catégorie (un signe contre trois
 * signes) : sinon on devinerait la réponse à sa forme, sans rien savoir.
 *
 * Le hasard est passé en paramètre (par défaut Math.random) : les tests
 * peuvent fournir un hasard fixe pour obtenir toujours les mêmes questions.
 * Calcul pur, pas de DOM.
 */
(function (T) {
  'use strict';

  const NB_CHOIX = 4;
  const ELEMENTS = { feu: 'Feu', terre: 'Terre', air: 'Air', eau: 'Eau' };

  /** Un entier au hasard entre 0 et n − 1. */
  const tirer = (n, hasard) => Math.floor(hasard() * n);

  /** Mélange de Fisher-Yates : chaque ordre a la même chance. Renvoie une copie. */
  function melanger(liste, hasard) {
    const copie = [...liste];
    for (let i = copie.length - 1; i > 0; i--) {
      const j = tirer(i + 1, hasard);
      [copie[i], copie[j]] = [copie[j], copie[i]];
    }
    return copie;
  }

  /** Le nom « nu » d'une fiche : « ♈ Bélier » → « Bélier », « 7 — Introspection » → « Introspection ». */
  function nomNu(titre) {
    return titre.replace(/^\d+\s*—\s*/, '').replace(/^[^\p{L}\d]+/u, '').trim();
  }

  /**
   * Cache le nom de la réponse dans l'énoncé (sinon la question se répond
   * toute seule) : chaque mot de plus de 3 lettres du titre devient « … ».
   * Pour un nombre, le chiffre lui-même est aussi caché.
   */
  function masquer(texte, cle) {
    const e = T.glossaire[cle];
    let resultat = texte;
    const mots = nomNu(e.titre).split(/[\s'’-]+/).filter((m) => m.length > 3);
    for (const mot of mots) {
      resultat = resultat.replace(new RegExp(mot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu'), '…');
    }
    if (e.categorie === 'nombre') {
      const n = cle.replace('nombre', '');
      resultat = resultat.replace(new RegExp(`(^|[^\\d])${n}(?!\\d)`, 'g'), '$1…');
    }
    return resultat;
  }

  /** Fiches utilisables d'une catégorie ('tout' = toutes). */
  function candidates(categorie) {
    return T.fiches.lister(categorie).filter((c) => T.glossaire[c].court);
  }

  /**
   * Construit les choix : la bonne réponse + (NB_CHOIX − 1) autres, mélangés.
   * libelle(cle) : texte affiché pour une clé. Les libellés sont tous différents.
   */
  function choixAvec(bonneCle, autresCles, libelle, hasard) {
    const vus = new Set([libelle(bonneCle)]);
    const distracteurs = [];
    for (const c of melanger(autresCles, hasard)) {
      if (distracteurs.length >= NB_CHOIX - 1) break;
      const l = libelle(c);
      if (c === bonneCle || vus.has(l)) continue;
      vus.add(l);
      distracteurs.push({ cle: c, libelle: l });
    }
    const choix = melanger([{ cle: bonneCle, libelle: libelle(bonneCle) }, ...distracteurs], hasard);
    return { choix, bonne: choix.findIndex((c) => c.cle === bonneCle) };
  }

  // ---------- Les quatre sortes de questions ----------

  function questionDefinition(cle, hasard) {
    const G = T.glossaire, e = G[cle];
    const memeCategorie = candidates(e.categorie);
    return {
      type: 'definition', cle,
      consigne: 'Quelle notion correspond à cette définition ?',
      enonce: masquer(e.court, cle),
      ...choixAvec(cle, memeCategorie, (c) => G[c].titre, hasard),
      explication: e.court,
    };
  }

  function questionMotsCles(cle, hasard) {
    const G = T.glossaire, e = G[cle];
    const mots = melanger(e.motsCles, hasard).slice(0, 3);
    const memeCategorie = candidates(e.categorie);
    return {
      type: 'motsCles', cle,
      consigne: 'À quelle notion associes-tu ces mots-clés ?',
      enonce: mots.map((m) => masquer(m, cle)).join(' · '),
      ...choixAvec(cle, memeCategorie, (c) => G[c].titre, hasard),
      explication: `${e.titre} : ${e.motsCles.join(' · ')}.`,
    };
  }

  function questionElement(cle, hasard) {
    const A = T.astres, G = T.glossaire;
    const signe = A.SIGNES.find((s) => T.cleGlossaire(s.nom) === cle);
    const cles = Object.keys(ELEMENTS);
    return {
      type: 'element', cle,
      consigne: 'Quel est l’élément de ce signe ?',
      enonce: G[cle].titre,
      ...choixAvec(signe.element, cles, (c) => ELEMENTS[c], hasard),
      explication: `${signe.nom} est un signe de ${ELEMENTS[signe.element]}, de mode ${signe.mode}.`,
    };
  }

  function questionMaitre(cle, hasard) {
    const A = T.astres, G = T.glossaire;
    const maitre = G[cle].maitres[0];
    // Un signe peut avoir deux maîtres (Scorpion : Mars et Pluton en moderne…) ;
    // on écarte des distracteurs les autres maîtres du même signe.
    const autres = Object.keys(A.ASTRES).filter((c) => !G[cle].maitres.includes(c));
    const noms = G[cle].maitres.map((c) => A.ASTRES[c].nom).join(' et ');
    return {
      type: 'maitre', cle,
      consigne: 'Quelle planète gouverne ce signe ?',
      enonce: G[cle].titre,
      ...choixAvec(maitre, autres, (c) => A.ASTRES[c].nom, hasard),
      explication: `${nomNu(G[cle].titre)} est gouverné par ${noms} (son domicile).`,
    };
  }

  /**
   * Une question au hasard.
   * categorie : 'tout' ou une catégorie des fiches ('nombre', 'signe'…).
   * eviter : clés déjà posées récemment (on les évite si possible).
   */
  function question(categorie = 'tout', hasard = Math.random, eviter = []) {
    const G = T.glossaire;
    let cles = candidates(categorie);
    const restantes = cles.filter((c) => !eviter.includes(c));
    if (restantes.length) cles = restantes;
    const cle = cles[tirer(cles.length, hasard)];
    const e = G[cle];

    const sortes = [questionDefinition];
    if (e.motsCles && e.motsCles.length >= 3) sortes.push(questionMotsCles);
    if (e.categorie === 'signe') sortes.push(questionElement, questionMaitre);
    return sortes[tirer(sortes.length, hasard)](cle, hasard);
  }

  /** La réponse donnée (index du choix) est-elle juste ? */
  const verifier = (q, index) => index === q.bonne;

  T.quiz = { question, verifier, masquer, melanger, nomNu, NB_CHOIX };
})(globalThis.Toiles = globalThis.Toiles || {});

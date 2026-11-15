/**
 * Toiles — fiches complètes du glossaire.
 *
 * Le glossaire (src/glossaire.js) contient les textes ; ce module les ASSEMBLE en
 * fiches prêtes à afficher, en y ajoutant les liens entre notions :
 *   - un signe renvoie à son élément, son mode, sa ou ses planètes maîtresses,
 *     et aux planètes qui y sont exaltées ;
 *   - une planète renvoie à ses signes de domicile, d'exaltation, d'exil et de chute
 *     (lus dans Toiles.positions.DIGNITES, pour ne pas les écrire deux fois) ;
 *   - un maître-nombre renvoie au nombre dans lequel il « vibre aussi » ;
 *   - un élément ou un mode renvoie à ses signes.
 *
 * Aucun accès à la page ici (pas de DOM) : src/app.js transforme le résultat en HTML.
 * Cela permet de tester les fiches dans Node (tests/tests.js).
 *
 * Dépend de : astres.js, glossaire.js, positions.js → à charger après eux.
 */
(function (T) {
  'use strict';

  /** Catégories des fiches, dans l'ordre des onglets du panneau. */
  const CATEGORIES = [
    { id: 'nombre', libelle: 'Nombres' },
    { id: 'signe', libelle: 'Signes' },
    { id: 'astre', libelle: 'Planètes' },
    { id: 'aspect', libelle: 'Aspects' },
    { id: 'notion', libelle: 'Notions' },
  ];

  /** Les 6 domaines de lecture, avec leur nom affiché. */
  const LIBELLES_DOMAINES = {
    essence: 'Essence', amour: 'Amour', travail: 'Travail',
    finances: 'Finances', sante: 'Santé', spiritualite: 'Spiritualité',
  };

  /** Toutes les clés d'une catégorie (ou toutes si categorie est vide / 'tout'),
   *  dans l'ordre où elles sont écrites dans glossaire.js. */
  function lister(categorie) {
    const G = T.glossaire;
    return Object.keys(G).filter((cle) => !categorie || categorie === 'tout' || G[cle].categorie === categorie);
  }

  /** Un lien vers une autre fiche : { cle, libelle }. */
  const lien = (cle) => ({ cle, libelle: T.glossaire[cle].titre });

  /** Clé glossaire d'un signe à partir de son nom ("Gémeaux" → "gemeaux"). */
  const cleSigne = (signe) => T.cleGlossaire(signe.nom);

  /**
   * Les blocs « liens » propres à chaque catégorie.
   * Chaque bloc : { titre, liens: [{ cle, libelle }] }. Les blocs vides sont retirés plus bas.
   */
  function blocsLiens(cle, entree) {
    const A = T.astres, D = T.positions.DIGNITES;

    if (entree.categorie === 'signe') {
      const S = A.SIGNES.find((s) => cleSigne(s) === cle);
      // Planètes exaltées dans ce signe : on parcourt la table des dignités.
      const exaltees = Object.keys(D).filter((astre) => D[astre].exaltation.includes(cle));
      return [
        { titre: 'Élément et mode', liens: [lien(S.element), lien(S.mode)] },
        { titre: entree.maitres.length > 1 ? 'Planètes maîtresses' : 'Planète maîtresse', liens: entree.maitres.map(lien) },
        { titre: 'Planètes exaltées ici', liens: exaltees.map(lien) },
      ];
    }

    if (entree.categorie === 'astre') {
      const d = D[cle];
      const vers = (liste) => liste.map(lien);
      return [
        { titre: 'Domicile (expression libre)', liens: vers(d.domicile) },
        { titre: 'Exaltation (expression sublimée)', liens: vers(d.exaltation) },
        { titre: 'Exil (expression freinée)', liens: vers(d.exil) },
        { titre: 'Chute (expression difficile)', liens: vers(d.chute) },
      ];
    }

    if (entree.categorie === 'nombre' && entree.vibreAussi) {
      return [{ titre: 'Vibre aussi en', liens: [lien(T.cleNombre(entree.vibreAussi))] },
              { titre: 'Notion', liens: [lien('maitreNombre')] }];
    }

    // Élément ou mode : les signes qui lui appartiennent.
    const signesLies = A.SIGNES.filter((s) => s.element === cle || s.mode === cle);
    if (signesLies.length) return [{ titre: 'Signes', liens: signesLies.map((s) => lien(cleSigne(s))) }];

    return [];
  }

  /**
   * Fiche complète d'une clé du glossaire.
   * Renvoie null si la clé n'existe pas, sinon :
   * {
   *   cle, titre, categorie, court,
   *   blocs: [ { titre, texte } | { titre, liens: [{cle, libelle}] } | { titre, domaines: [{domaine, libelle, texte}] } ]
   * }
   * L'ordre des blocs est l'ordre d'affichage.
   */
  function construire(cle) {
    const e = T.glossaire[cle];
    if (!e) return null;
    const blocs = [];
    const texte = (titre, valeur) => { if (valeur) blocs.push({ titre, texte: valeur }); };

    texte('En détail', e.detail);
    texte('Ce que ça fait', e.effet);
    texte('Conseil', e.conseil);
    texte('Lumière', e.lumiere);
    texte('Ombre', e.ombre);

    if (e.domaines) {
      blocs.push({
        titre: 'Dans les 6 domaines',
        domaines: Object.keys(LIBELLES_DOMAINES).map((d) => ({ domaine: d, libelle: LIBELLES_DOMAINES[d], texte: e.domaines[d] })),
      });
    }

    for (const b of blocsLiens(cle, e)) if (b.liens.length) blocs.push(b);

    // Effet de la rétrogradation propre à cette planète (déjà rédigé dans l'entrée « retrograde »).
    const retro = T.glossaire.retrograde.parAstre[cle];
    if (retro) blocs.push({ titre: 'En rétrogradation', texte: retro, liens: [lien('retrograde')] });

    if (e.motsCles) texte('Mots-clés', e.motsCles.join(' · '));

    return { cle, titre: e.titre, categorie: e.categorie, court: e.court, blocs };
  }

  /** Texte « à plat » d'une fiche, pour la recherche (sans accents, en minuscules). */
  function texteRecherche(cle) {
    const e = T.glossaire[cle];
    const morceaux = [e.titre, e.court, e.detail, e.lumiere, e.ombre, ...(e.motsCles || [])];
    return T.cleGlossaire(morceaux.filter(Boolean).join(' '));
  }

  T.fiches = { CATEGORIES, LIBELLES_DOMAINES, lister, construire, texteRecherche };
})(globalThis.Toiles = globalThis.Toiles || {});

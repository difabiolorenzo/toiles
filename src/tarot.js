/**
 * Toiles — tarot : mélanges, coupe et tirage.
 *
 * Calcul pur, sans DOM : chaque fonction reçoit un paquet (un tableau d'objets
 * carte) et renvoie un NOUVEAU paquet, sans toucher à l'ancien. Le dessus du
 * paquet est le début du tableau (indice 0).
 *
 * Quatre façons de mélanger, au choix de l'utilisateur :
 *   - riffle       : « à la main », le mélange à l'américaine, un geste à la fois ;
 *   - ramasser     : « par étalement », les cartes posées en vrac sur la table
 *                    sont ramassées dans l'ordre où elles se trouvent ;
 *   - parIntention : la durée d'un appui maintenu (en millisecondes) sert de
 *                    graine au mélange ;
 *   - melanger     : automatique (Fisher-Yates), pour les jours pressés.
 * Puis une coupe (couper) et un tirage carte par carte (tirer).
 *
 * Le hasard est toujours passé en paramètre (une fonction qui renvoie un nombre
 * entre 0 et 1, comme Math.random) : les tests fournissent un hasard fixe et
 * obtiennent toujours le même résultat.
 */
(function (T) {
  'use strict';

  /** Un entier au hasard entre 0 et n − 1. */
  const entier = (n, hasard) => Math.floor(hasard() * n);

  /**
   * Hasard « à graine » (algorithme mulberry32) : la même graine donne toujours
   * la même suite de nombres. Sert au mélange par intention, où la graine est la
   * durée de l'appui. Ce n'est pas un hasard cryptographique, et ce n'est pas le
   * but : c'est TON geste qui fixe le résultat.
   */
  function hasardAGraine(graine) {
    let etat = graine >>> 0;
    return function () {
      etat = (etat + 0x6D2B79F5) >>> 0;
      let t = etat;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Hasard du navigateur, de meilleure qualité que Math.random quand il existe
   * (crypto.getRandomValues). Utilisé par le mélange automatique.
   */
  function hasardFort() {
    try {
      const tampon = new Uint32Array(1);
      globalThis.crypto.getRandomValues(tampon);
      return tampon[0] / 4294967296;
    } catch {
      return Math.random();
    }
  }

  /**
   * Mélange automatique de Fisher-Yates : on parcourt le paquet de la fin vers
   * le début et on échange chaque carte avec une carte prise au hasard avant
   * elle. Chaque ordre possible a exactement la même chance.
   */
  function melanger(paquet, hasard = hasardFort) {
    const copie = [...paquet];
    for (let i = copie.length - 1; i > 0; i--) {
      const j = entier(i + 1, hasard);
      [copie[i], copie[j]] = [copie[j], copie[i]];
    }
    return copie;
  }

  /**
   * Un mélange à l'américaine (riffle), comme avec de vraies mains :
   *   1. on coupe le paquet en deux, à peu près au milieu (± 3 cartes : les
   *      mains ne sont jamais précises) ;
   *   2. on fait tomber les cartes des deux moitiés en alternance, par petits
   *      paquets de 1 à 3 cartes, jusqu'à épuisement.
   * Un seul riffle mélange peu : il en faut environ 7 pour un jeu de 52 cartes
   * (Bayer et Diaconis, 1992). D'où le compteur affiché dans l'interface.
   */
  function riffle(paquet, hasard = Math.random) {
    const milieu = Math.floor(paquet.length / 2);
    const decalage = entier(7, hasard) - 3; // de −3 à +3
    const coupe = Math.min(paquet.length, Math.max(0, milieu + decalage));
    const gauche = paquet.slice(0, coupe);
    const droite = paquet.slice(coupe);
    const resultat = [];
    let tourDeGauche = hasard() < 0.5; // quelle main lâche en premier
    while (gauche.length || droite.length) {
      const main = (tourDeGauche && gauche.length) || !droite.length ? gauche : droite;
      const combien = 1 + entier(3, hasard); // 1, 2 ou 3 cartes d'un coup
      resultat.push(...main.splice(0, combien));
      tourDeGauche = !tourDeGauche;
    }
    return resultat;
  }

  /** Nombre de riffles conseillé pour un vrai mélange (repère pédagogique). */
  const RIFFLES_CONSEILLES = 7;

  /**
   * Mélange par intention : la durée de l'appui (en millisecondes) devient la
   * graine d'un Fisher-Yates. Deux appuis de durée différente donnent deux
   * ordres différents ; le même appui au même paquet redonne le même ordre.
   */
  function parIntention(paquet, dureeMs) {
    return melanger(paquet, hasardAGraine(Math.round(dureeMs)));
  }

  /**
   * Étalement : place chaque carte à une position au hasard sur la table
   * (x et y entre 0 et 1, en proportion de la table). L'affichage s'en sert
   * pour dessiner les cartes en vrac, que l'utilisateur déplace ensuite.
   */
  function etaler(paquet, hasard = Math.random) {
    return paquet.map((carte) => ({ carte, x: hasard(), y: hasard() }));
  }

  /**
   * Étalement en arc de cercle : les cartes sont posées le long d'une arche,
   * dans l'ordre du paquet, avec un léger désordre (position et inclinaison) pour
   * que ce ne soit pas une grille parfaite. Ce n'est qu'une disposition de départ :
   * chaque carte peut ensuite être déplacée librement.
   *   x, y  : position entre 0 et 1 (y = 0 en haut de la table) ;
   *   angle : inclinaison en degrés, qui suit la courbe de l'arche.
   */
  const ARC_DEMI_OUVERTURE = 70; // degrés de part et d'autre du sommet

  function etalerEnArc(paquet, hasard = Math.random) {
    const max = ARC_DEMI_OUVERTURE * Math.PI / 180;
    const bruit = (ampleur) => (hasard() - 0.5) * 2 * ampleur; // entre -ampleur et +ampleur
    const borne = (v) => Math.min(1, Math.max(0, v));
    const n = paquet.length;
    return paquet.map((carte, i) => {
      const theta = n > 1 ? -max + (2 * max * i) / (n - 1) : 0; // de gauche à droite
      return {
        carte,
        // sin et cos ramenés entre 0 et 1 : bords de l'arche en bas, sommet en haut.
        x: borne(0.5 + 0.5 * Math.sin(theta) / Math.sin(max) + bruit(0.015)),
        y: borne((1 - Math.cos(theta)) / (1 - Math.cos(max)) + bruit(0.04)),
        angle: theta * 180 / Math.PI + bruit(6),
      };
    });
  }

  /**
   * Ramassage après étalement : les cartes sont ramassées en lisant la table
   * comme une page, de haut en bas puis de gauche à droite. La table est
   * découpée en bandes horizontales (8 par défaut) pour qu'un léger décalage
   * vertical ne compte pas. L'ordre final dépend donc de là où TU as posé
   * les cartes.
   */
  function ramasser(etalees, bandes = 8) {
    const bande = (y) => Math.min(bandes - 1, Math.floor(y * bandes));
    return [...etalees]
      .sort((a, b) => bande(a.y) - bande(b.y) || a.x - b.x)
      .map((e) => e.carte);
  }

  /**
   * Coupe : on soulève les `position` premières cartes et on les passe sous
   * le reste. La coupe ne crée pas de hasard (elle fait tourner le paquet),
   * c'est un geste rituel : celui qui coupe « signe » le paquet.
   */
  function couper(paquet, position) {
    const p = Math.min(paquet.length, Math.max(0, Math.round(position)));
    return [...paquet.slice(p), ...paquet.slice(0, p)];
  }

  /**
   * Retourne certaines cartes « tête en bas » (renversées), une chance sur
   * deux chacune. Option désactivée par défaut dans l'interface.
   */
  function renverser(paquet, hasard = Math.random) {
    return paquet.map((carte) => ({ ...carte, renversee: hasard() < 0.5 }));
  }

  /**
   * Tirage : retire du paquet la carte à l'indice choisi (dans l'éventail).
   * Renvoie la carte tirée et le paquet restant.
   */
  function tirer(paquet, indice) {
    const reste = [...paquet];
    const [carte] = reste.splice(indice, 1);
    return { carte, reste };
  }

  /**
   * Les tirages proposés. Chaque position a un nom : il dit OÙ regarder, sans
   * changer le sens de la carte (convention Toiles : seulement les mots-clés
   * de la carte elle-même).
   */
  const TIRAGES = {
    une: { nom: 'Une carte', positions: ['Message'] },
    trois: { nom: 'Trois cartes', positions: ['Passé', 'Présent', 'Futur'] },
    croix: { nom: 'La croix', positions: ['Pour', 'Contre', 'Chemin', 'Issue', 'Synthèse'] },
  };

  /**
   * Construit le paquet d'un jeu à partir des textes (src/textes-tarot.js) :
   * une carte = { cle, numero, nom } dans l'ordre de ce jeu. Les deux jeux
   * n'ont pas le même ordre : Force et Justice échangent leurs numéros.
   */
  function paquetDe(jeu, cartes = T.textesTarot.majeurs) {
    return cartes
      .map((c) => ({ cle: c.cle, numero: c.numero[jeu], nom: c.nom[jeu] }))
      .sort((a, b) => a.numero - b.numero);
  }

  /** Chiffres romains (I à XXI) ; 0 pour le Mat / le Fou, qui n'a pas de numéro. */
  function romain(n) {
    if (n === 0) return '0';
    const table = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let texte = '';
    for (const [valeur, lettres] of table) {
      while (n >= valeur) { texte += lettres; n -= valeur; }
    }
    return texte;
  }

  T.tarot = {
    hasardAGraine, hasardFort,
    melanger, riffle, RIFFLES_CONSEILLES, parIntention,
    etaler, etalerEnArc, ramasser, couper, renverser, tirer,
    TIRAGES, paquetDe, romain,
  };
})(globalThis.Toiles = globalThis.Toiles || {});

/**
 * Toiles — textes du tarot : les 22 arcanes majeurs.
 *
 * Fichier de DONNÉES (pas de calcul) : tu peux modifier les phrases librement.
 * Les significations sont les plus courantes en français, écrites pour Toiles
 * (aucun livre recopié).
 *
 * Deux jeux sont proposés, avec les mêmes 22 arcanes mais pas tout à fait les
 * mêmes noms ni le même ordre :
 *   - marseille : Tarot de Marseille (tradition française, XVIIe-XVIIIe s.) ;
 *   - rws       : Rider-Waite-Smith (Angleterre, 1909), base de la plupart des
 *                 tarots modernes. Il échange la Force (VIII) et la Justice (XI)
 *                 pour suivre l'ordre astrologique de la Golden Dawn.
 * Le Mat / le Fou n'a pas vraiment de numéro : on lui donne 0 pour le ranger.
 * À Marseille, l'arcane XIII n'a traditionnellement pas de nom écrit sur la carte.
 *
 * Format d'une carte :
 *   cle      : identifiant stable (indépendant du jeu)
 *   numero   : { marseille, rws }
 *   nom      : { marseille, rws }
 *   motCle   : le mot à retenir
 *   phrase   : le sens à l'endroit, en une phrase courte
 *   renverse : le sens quand la carte sort tête en bas (option)
 */
(function (T) {
  'use strict';

  const carte = (cle, nM, nR, nomM, nomR, motCle, phrase, renverse) =>
    ({ cle, numero: { marseille: nM, rws: nR }, nom: { marseille: nomM, rws: nomR }, motCle, phrase, renverse });

  T.textesTarot = {
    jeux: {
      // scans : crédit des images d'époque (option « Images d'époque »), copiées
      // dans images/tarot/<jeu>/<cle>.jpg depuis Wikimedia Commons (domaine public).
      marseille: { nom: 'Tarot de Marseille', note: 'Tradition française. La Justice est VIII, la Force XI ; l’arcane XIII n’a pas de nom.',
        scans: 'Images : tarot édité à Marseille vers 1890-1900 sur le modèle de Nicolas Conver (1760), exemplaire de la BnF (domaine public, via Wikimedia Commons).' },
      rws: { nom: 'Rider-Waite-Smith', note: 'Tarot anglais de 1909. La Force est VIII, la Justice XI.',
        scans: 'Images : Pamela Colman Smith, Rider-Waite, 1909 (domaine public, via Wikimedia Commons).' },
    },

    majeurs: [
      carte('mat', 0, 0, 'Le Mat', 'Le Fou', 'Liberté',
        'Un départ sans bagage : l’élan, l’inconnu, la confiance.', 'Imprudence, fuite, dispersion.'),
      carte('bateleur', 1, 1, 'Le Bateleur', 'Le Magicien', 'Commencement',
        'Tous les outils sont sur la table : il est temps d’agir.', 'Hésitation, talent mal employé.'),
      carte('papesse', 2, 2, 'La Papesse', 'La Grande Prêtresse', 'Intuition',
        'Le savoir silencieux, l’écoute intérieure, la patience.', 'Secret, fermeture, intuition ignorée.'),
      carte('imperatrice', 3, 3, 'L’Impératrice', 'L’Impératrice', 'Créativité',
        'L’abondance, la fertilité des idées, l’expression.', 'Blocage créatif, dépendance.'),
      carte('empereur', 4, 4, 'L’Empereur', 'L’Empereur', 'Structure',
        'L’autorité, la stabilité, les fondations solides.', 'Rigidité, abus de pouvoir.'),
      carte('pape', 5, 5, 'Le Pape', 'Le Hiérophante', 'Transmission',
        'L’enseignement, la tradition, le bon conseil.', 'Dogme, conformisme.'),
      carte('amoureux', 6, 6, 'L’Amoureux', 'Les Amoureux', 'Choix',
        'Un choix du cœur, une union, une harmonie à trouver.', 'Indécision, désaccord.'),
      carte('chariot', 7, 7, 'Le Chariot', 'Le Chariot', 'Victoire',
        'Avancer avec volonté et maîtrise de soi.', 'Perte de contrôle, direction floue.'),
      carte('justice', 8, 11, 'La Justice', 'La Justice', 'Équilibre',
        'La vérité, la décision juste, les conséquences de ses actes.', 'Injustice, déséquilibre.'),
      carte('hermite', 9, 9, 'L’Hermite', 'L’Ermite', 'Introspection',
        'Prendre du recul et chercher sa propre lumière.', 'Isolement, repli.'),
      carte('roue', 10, 10, 'La Roue de Fortune', 'La Roue de la Fortune', 'Cycle',
        'Un tournant : ce qui monte, ce qui descend, le changement.', 'Résistance au changement, malchance passagère.'),
      carte('force', 11, 8, 'La Force', 'La Force', 'Courage',
        'La douceur qui dompte : maîtrise, confiance, cran.', 'Doute de soi, force mal dirigée.'),
      carte('pendu', 12, 12, 'Le Pendu', 'Le Pendu', 'Lâcher-prise',
        'Voir les choses autrement ; une pause qui mûrit.', 'Blocage, sacrifice inutile.'),
      carte('arcane13', 13, 13, 'L’Arcane sans nom', 'La Mort', 'Transformation',
        'Une fin qui libère la place pour du neuf (rarement littérale).', 'Refus de tourner la page.'),
      carte('temperance', 14, 14, 'Tempérance', 'La Tempérance', 'Harmonie',
        'La juste mesure, la patience, la guérison.', 'Excès, impatience.'),
      carte('diable', 15, 15, 'Le Diable', 'Le Diable', 'Attachement',
        'Les désirs, les liens qui tiennent, la puissance brute.', 'Libération d’une emprise.'),
      carte('maisondieu', 16, 16, 'La Maison Dieu', 'La Tour', 'Bouleversement',
        'Ce qui était mal bâti s’effondre : une révélation soudaine.', 'Crise évitée de justesse, changement retardé.'),
      carte('etoile', 17, 17, 'L’Étoile', 'L’Étoile', 'Espoir',
        'La confiance retrouvée, l’inspiration, la sérénité.', 'Découragement, rêve flou.'),
      carte('lune', 18, 18, 'La Lune', 'La Lune', 'Imagination',
        'Les rêves, les émotions, ce qui reste dans le flou.', 'Confusion qui se dissipe.'),
      carte('soleil', 19, 19, 'Le Soleil', 'Le Soleil', 'Joie',
        'La clarté, la réussite, la chaleur partagée.', 'Joie voilée, optimisme excessif.'),
      carte('jugement', 20, 20, 'Le Jugement', 'Le Jugement', 'Renouveau',
        'Un appel, un réveil, faire le bilan pour renaître.', 'Doute, appel ignoré.'),
      carte('monde', 21, 21, 'Le Monde', 'Le Monde', 'Accomplissement',
        'Un cycle s’achève avec succès : la plénitude.', 'Inachevé, dernier pas à faire.'),
    ],

    /** « Comment ça marche » du tarot (même format que src/textes.js). */
    infobulle: {
      titre: 'Tirage de tarot',
      principe: 'Tu mélanges les 22 arcanes majeurs, tu coupes, puis tu choisis toi-même tes cartes, face cachée, dans l’éventail. Chaque carte affiche son mot-clé et son sens courant.',
      base: 'Quatre mélanges au choix : à la main (riffle : le paquet coupé en deux, les moitiés entremêlées par petits paquets ; environ 7 suffisent pour un jeu de 52 cartes, 5 ou 6 pour les 22 arcanes), par étalement (les cartes ramassées dans l’ordre où tu les as posées), par intention (la durée de ton appui fixe l’ordre), ou automatique. La coupe passe le haut du paquet dessous.',
      limites: 'Le sens d’une carte ne dépend pas ici de sa position dans le tirage : la position dit seulement où regarder. La coupe ne crée pas de hasard, c’est un geste. Le tarot est un outil de réflexion, pas une prédiction.',
    },
  };
})(globalThis.Toiles = globalThis.Toiles || {});

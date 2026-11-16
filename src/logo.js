/*
 * logo.js — Animations du logo « L'étoile tissée ».
 *
 * Au démarrage de l'application et à chaque clic sur le logo, on joue une des
 * dix animations, tirée au hasard (jamais deux fois la même d'affilée).
 *
 * Deux familles d'animations :
 *  - les animations « CSS » (rotation, battement, orbite, Lune, éclipse, corde) :
 *    on pose la classe `anim-<nom>` sur le <svg>, les images-clés sont dans toiles.css ;
 *  - les trois rétrogradations : une suite d'angles calculée ici, jouée avec
 *    element.animate() (Web Animations), car le trajet change à chaque fois.
 *
 * C'est de l'affichage pur (touche au DOM) : la seule donnée astronomique
 * utilisée vient de Toiles.astres.longitude (src/astres.js).
 * Si l'utilisateur demande moins d'animations (réglage du système), on ne joue rien.
 */
(function (T) {
  const DUREE_PAR_DEFAUT = 2600; // ms : délai de sécurité pour retirer la classe

  /* ---------- Les trois trajets de rétrogradation (angles en degrés) ---------- */

  // Hasard : 3 à 5 pas, la plupart en avant, un seul recul. Différent à chaque fois.
  function anglesHasard() {
    const angles = [0];
    const nombreDePas = 3 + Math.floor(Math.random() * 3);
    const pasDuRecul = 1 + Math.floor(Math.random() * (nombreDePas - 1));
    for (let i = 0; i < nombreDePas; i++) {
      const amplitude = 20 + Math.random() * 50;
      const sens = i === pasDuRecul ? -0.6 : 1;
      angles.push(angles[angles.length - 1] + sens * amplitude);
    }
    return angles;
  }

  // Mathématique : Terre et Mars sur des orbites circulaires autour du Soleil.
  // Vue depuis la Terre, Mars semble reculer quand la Terre la double (opposition, t = 0).
  function anglesMathematiques() {
    const angles = [];
    for (let k = 0; k <= 60; k++) {
      const annees = -0.35 + (0.7 * k) / 60;
      const angleTerre = 2 * Math.PI * annees;          // période 1 an, rayon 1 UA
      const angleMars = 2 * Math.PI * annees / 1.881;   // période 1,881 an, rayon 1,524 UA
      const dx = 1.524 * Math.cos(angleMars) - Math.cos(angleTerre);
      const dy = 1.524 * Math.sin(angleMars) - Math.sin(angleTerre);
      angles.push(Math.atan2(dy, dx) * 180 / Math.PI);
    }
    return deroulerEtEtirer(angles, 200);
  }

  // Réel : longitude de Mercure tous les 2 jours sur les 120 prochains jours.
  // Mercure rétrograde environ tous les 116 jours : la fenêtre en contient une.
  function anglesMercure() {
    if (!T.astres) return anglesMathematiques();
    const angles = [];
    const maintenant = Date.now();
    for (let jour = 0; jour <= 120; jour += 2) {
      angles.push(T.astres.longitude('mercure', new Date(maintenant + jour * 86400000)));
    }
    return deroulerEtEtirer(angles, 200);
  }

  // Rend la suite continue (pas de saut 359° → 0°), la fait partir de 0,
  // puis l'étire pour que son amplitude totale vaille « amplitudeVoulue » degrés.
  function deroulerEtEtirer(angles, amplitudeVoulue) {
    const continus = [angles[0]];
    for (let i = 1; i < angles.length; i++) {
      let ecart = angles[i] - angles[i - 1];
      if (ecart > 180) ecart -= 360;
      if (ecart < -180) ecart += 360;
      continus.push(continus[i - 1] + ecart);
    }
    const etendue = Math.max(...continus) - Math.min(...continus) || 1;
    const echelle = amplitudeVoulue / etendue;
    return continus.map((angle) => (angle - continus[0]) * echelle);
  }

  // Fait parcourir les angles aux fils, puis les pose sur un multiple de 60° :
  // l'étoile a six branches, elle retombe donc exactement sur son dessin d'origine.
  function jouerAngles(svg, angles, duree) {
    const dernier = angles[angles.length - 1];
    const repos = Math.round(dernier / 60) * 60;
    const imagesCles = angles.concat(repos).map((a) => ({ transform: `rotate(${a}deg)` }));
    svg.querySelector('.logo-fils').animate(imagesCles, { duration: duree, easing: 'ease-in-out' });
  }

  /* ---------- Catalogue des dix animations ---------- */
  // Soit « classe » (animation CSS), soit « jouer » (animation calculée).
  const ANIMATIONS = [
    { nom: 'Rotation céleste', classe: 'anim-rotation' },
    { nom: 'Rotation rapide', classe: 'anim-rapide' },
    { nom: 'Battement', classe: 'anim-battement' },
    { nom: 'Orbite', classe: 'anim-orbite' },
    { nom: 'Rétrogradation (hasard)', jouer: (svg) => jouerAngles(svg, anglesHasard(), 1600) },
    { nom: 'Rétrogradation (Mars)', jouer: (svg) => jouerAngles(svg, anglesMathematiques(), 2200) },
    { nom: 'Rétrogradation (Mercure réelle)', jouer: (svg) => jouerAngles(svg, anglesMercure(), 2600) },
    { nom: 'Phases de Lune', classe: 'anim-lune' },
    { nom: 'Éclipse', classe: 'anim-eclipse' },
    { nom: 'Corde pincée', classe: 'anim-corde' },
  ];

  let dernierIndex = -1;

  // Tire une animation au hasard, différente de la précédente.
  function tirerAnimation() {
    let index;
    do { index = Math.floor(Math.random() * ANIMATIONS.length); } while (index === dernierIndex);
    dernierIndex = index;
    return ANIMATIONS[index];
  }

  // Retire toute classe anim-* restée sur le logo et coupe les animations JS en cours.
  function nettoyer(svg) {
    ANIMATIONS.forEach((a) => a.classe && svg.classList.remove(a.classe));
    svg.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  }

  function animer(svg) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    nettoyer(svg);
    const animation = tirerAnimation();
    if (animation.jouer) { animation.jouer(svg); return; }
    void svg.getBoundingClientRect(); // force le navigateur à « oublier » l'ancienne animation
    svg.classList.add(animation.classe);
    // Retrait de la classe à la fin (sécurité si animationend ne remonte pas).
    clearTimeout(svg._minuteurLogo);
    svg._minuteurLogo = setTimeout(() => svg.classList.remove(animation.classe), DUREE_PAR_DEFAUT);
  }

  // Branche le bouton du logo et joue une première animation au démarrage.
  function initialiser() {
    const bouton = document.getElementById('bouton-logo');
    const svg = bouton && bouton.querySelector('.logo');
    if (!svg) return;
    bouton.addEventListener('click', () => animer(svg));
    animer(svg);
  }

  T.logo = { ANIMATIONS, anglesHasard, anglesMathematiques, anglesMercure, deroulerEtEtirer };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialiser);
    else initialiser();
  }
})(globalThis.Toiles = globalThis.Toiles || {});

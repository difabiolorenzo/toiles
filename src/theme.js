/* =====================================================================
   Toiles — choix du thème (clair « Carte céleste » / sombre « Nuit vivante »)

   Par défaut, la page suit le réglage du système (prefers-color-scheme) :
   c'est le CSS qui s'en charge, sans JavaScript.
   Le bouton permet de FORCER l'un ou l'autre : on pose alors
   data-theme="light" ou "dark" sur <html>, et le CSS (src/toiles.css)
   applique les jetons correspondants.

   Ce fichier est chargé dans le <head>, AVANT l'affichage de la page :
   ainsi un thème forcé s'applique tout de suite, sans « flash » de
   l'autre thème au chargement.
   ===================================================================== */
(function (T) {
  'use strict';

  const CLE_THEME = 'toiles.theme'; // clé du localStorage

  /* Lecture / écriture du choix mémorisé, toujours dans un try/catch :
     le localStorage peut être bloqué (navigation privée, réglages). */
  function lireThemeMemorise() {
    try { return localStorage.getItem(CLE_THEME); } catch { return null; }
  }
  function memoriserTheme(theme) {
    try { localStorage.setItem(CLE_THEME, theme); } catch { /* tant pis : rien n'est retenu */ }
  }

  /* Le thème réellement affiché : le choix forcé s'il existe,
     sinon celui du système. */
  function themeActuel() {
    const force = document.documentElement.dataset.theme;
    if (force === 'light' || force === 'dark') return force;
    const systemeSombre = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemeSombre ? 'dark' : 'light';
  }

  function appliquerTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  /* Le bouton est une icône : soleil (☀) pour passer en clair, lune (☾) pour
     passer en sombre. L'icône montre ce qui VA se passer, pas l'état actuel.
     Le texte complet reste dans aria-label (lecteurs d'écran) et title (survol).
     ︎ force le rendu « texte » du glyphe (pas d'émoji en couleur). */
  function libelleBouton(bouton) {
    const versClair = themeActuel() === 'dark';
    const libelle = versClair ? 'Passer en thème clair' : 'Passer en thème sombre';
    bouton.textContent = (versClair ? '☀' : '☾') + '︎';
    bouton.setAttribute('aria-label', libelle);
    bouton.title = libelle;
  }

  /* Branche le bouton : un clic bascule et mémorise. */
  function brancherBoutonTheme(bouton) {
    libelleBouton(bouton);
    bouton.addEventListener('click', function () {
      const nouveau = themeActuel() === 'dark' ? 'light' : 'dark';
      appliquerTheme(nouveau);
      memoriserTheme(nouveau);
      libelleBouton(bouton);
    });
    // Si le système change de thème alors qu'aucun choix n'est forcé,
    // le libellé doit suivre.
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', function () { libelleBouton(bouton); });
    }
  }

  // Exécuté tout de suite (dans le <head>) : réappliquer un choix mémorisé.
  if (typeof document !== 'undefined') {
    const memorise = lireThemeMemorise();
    if (memorise === 'light' || memorise === 'dark') appliquerTheme(memorise);
  }

  T.theme = { brancherBoutonTheme, themeActuel };
})(globalThis.Toiles = globalThis.Toiles || {});

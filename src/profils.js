/**
 * Toiles — module Profils.
 *
 * Gère seulement les DONNÉES des profils (pas l'affichage, qui est dans app.js).
 * Un profil : { id, nom, naissance: 'AAAA-MM-JJ', heure: null, lieu: null }
 *   heure et lieu sont prévus pour l'ascendant (plus tard) et restent vides pour l'instant.
 *
 * Stockage : localStorage du navigateur, sous une seule clé.
 *   - Si le stockage est bloqué (navigation privée, réglages…), on garde les profils
 *     en mémoire le temps de la visite : la page marche, mais rien n'est retenu.
 *   - Dans Node (tests), localStorage n'existe pas : même solution en mémoire.
 */
(function (T) {
  'use strict';

  const CLE = 'toiles_profils';
  const CLE_ACTIF = 'toiles_profil_actif';

  // ---------- Accès au stockage, sans jamais planter ----------
  const secours = {}; // utilisé si localStorage est absent ou bloqué
  const stockage = {
    lire(cle) {
      try { return globalThis.localStorage.getItem(cle); } catch { return secours[cle] ?? null; }
    },
    ecrire(cle, valeur) {
      try { globalThis.localStorage.setItem(cle, valeur); } catch { secours[cle] = valeur; }
    },
  };

  /** Lit la liste ; un contenu abîmé donne une liste vide plutôt qu'une erreur. */
  function lister() {
    try {
      const liste = JSON.parse(stockage.lire(CLE) || '[]');
      return Array.isArray(liste) ? liste : [];
    } catch {
      return [];
    }
  }

  function enregistrer(liste) {
    stockage.ecrire(CLE, JSON.stringify(liste));
  }

  const obtenir = (id) => lister().find((p) => p.id === id) || null;

  /** Vérifie un profil avant de l'enregistrer. Renvoie un message d'erreur, ou null si tout va bien. */
  function verifier({ nom, naissance }) {
    if (!nom || !nom.trim()) return 'Le nom est obligatoire.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(naissance || '')) return 'La date de naissance est obligatoire.';
    return null;
  }

  /** Identifiant unique simple : horodatage + hasard (pas besoin de plus pour un usage personnel). */
  const nouvelId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  function ajouter(champs) {
    const erreur = verifier(champs);
    if (erreur) throw new Error(erreur);
    const profil = { id: nouvelId(), nom: champs.nom.trim(), naissance: champs.naissance, heure: null, lieu: null };
    enregistrer([...lister(), profil]);
    return profil;
  }

  function modifier(id, champs) {
    const liste = lister();
    const i = liste.findIndex((p) => p.id === id);
    if (i < 0) throw new Error('Profil introuvable.');
    const nouveau = { ...liste[i], ...champs, id };
    const erreur = verifier(nouveau);
    if (erreur) throw new Error(erreur);
    nouveau.nom = nouveau.nom.trim();
    liste[i] = nouveau;
    enregistrer(liste);
    return nouveau;
  }

  function supprimer(id) {
    enregistrer(lister().filter((p) => p.id !== id));
    if (actif() === id) choisirActif('');
  }

  // ---------- Profil actif (le dernier choisi, retrouvé à la visite suivante) ----------
  // Valeurs possibles : '' (aucun), 'autre' (date tapée à la main), ou l'id d'un profil.
  function actif() {
    const v = stockage.lire(CLE_ACTIF) || '';
    return v === 'autre' || v === '' || obtenir(v) ? v : '';
  }
  const choisirActif = (valeur) => stockage.ecrire(CLE_ACTIF, valeur);

  /** Contenu du fichier de sauvegarde (.json), lisible à l'œil. */
  function exporter() {
    return JSON.stringify({ application: 'Toiles', version: 1, date: new Date().toISOString(), profils: lister() }, null, 2);
  }

  T.profils = { lister, obtenir, ajouter, modifier, supprimer, actif, choisirActif, exporter, verifier };
})(globalThis.Toiles = globalThis.Toiles || {});

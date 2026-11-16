/*
 * sw.js — « service worker » de Toiles (rend la page installable et utilisable hors ligne).
 *
 * Pourquoi ce fichier ?
 *   Pour qu'un navigateur propose d'« installer » une page (icône sur l'écran d'accueil,
 *   fenêtre sans barre d'adresse), il lui faut un manifeste (manifest.webmanifest) ET un
 *   service worker : un petit script qui tourne à côté de la page et peut répondre aux
 *   requêtes à sa place. Ici, il garde une copie de tous les fichiers de l'application
 *   pour qu'elle s'ouvre même sans réseau.
 *
 * Où il fonctionne ?
 *   Seulement en https (GitHub Pages) ou sur http://localhost. En double-clic (file://),
 *   index.html ne l'enregistre pas : l'application marche comme avant, sans installation.
 *
 * Il est à la racine du dépôt (et non dans src/) car un service worker ne contrôle que
 * les pages situées dans son dossier ou en dessous.
 *
 * ⚠ Après une modification de l'application, augmenter VERSION : c'est ce qui force les
 *   navigateurs à recharger les fichiers au lieu de garder l'ancienne copie.
 */

const VERSION = 'toiles-v4'; // v4 : étalement en arc, cartes retournables, filtre Synthèse

// Tous les fichiers nécessaires à l'application (chemins relatifs au dossier du site).
const FICHIERS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'src/toiles.css',
  'src/theme.js',
  'src/numerologie.js',
  'src/astres.js',
  'src/complements.js',
  'src/villes.js',
  'src/maisons.js',
  'src/schemas.js',
  'src/transits.js',
  'src/textes.js',
  'src/glossaire.js',
  'src/positions.js',
  'src/fiches.js',
  'src/profils.js',
  'src/methodologie.js',
  'src/croisee.js',
  'src/calendrier.js',
  'src/journal.js',
  'src/quiz.js',
  'src/textes-tarot.js',
  'src/tarot.js',
  'src/app.js',
  'images/logo.svg',
  'images/icones/icone-180.png',
  'images/icones/icone-192.png',
  'images/icones/icone-512.png',
  'polices/InterVariable.woff2',
  'polices/InterVariable-Italic.woff2'
];

// Installation : on met tous les fichiers en cache d'un coup.
self.addEventListener('install', (evenement) => {
  evenement.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(FICHIERS))
      .then(() => self.skipWaiting()) // la nouvelle version prend la main sans attendre
  );
});

// Activation : on supprime les caches des versions précédentes.
self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(
        noms.filter((nom) => nom !== VERSION).map((nom) => caches.delete(nom))
      ))
      .then(() => self.clients.claim())
  );
});

// Requêtes : « réseau d'abord, cache en secours ».
// Pourquoi ? En ligne, on voit toujours la dernière version publiée ; hors ligne,
// la copie en cache prend le relais. La copie est rafraîchie à chaque visite.
self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET' || !requete.url.startsWith(self.location.origin)) return;

  evenement.respondWith(
    fetch(requete)
      .then((reponse) => {
        if (reponse.ok) {
          const copie = reponse.clone();
          caches.open(VERSION).then((cache) => cache.put(requete, copie));
        }
        return reponse;
      })
      .catch(() => caches.match(requete, { ignoreSearch: true }))
  );
});

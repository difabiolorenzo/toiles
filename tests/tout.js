/**
 * Lanceur en ligne de commande : node tests/tout.js
 * Charge les modules de Toiles, puis exécute tests/tests.js.
 * Code de sortie 1 si un test échoue (utile plus tard pour une vérification automatique).
 */
'use strict';
const chemin = require('path');
const racine = chemin.join(__dirname, '..');

// Même ordre que dans index.html.
for (const f of ['numerologie', 'astres', 'transits', 'textes', 'glossaire', 'positions', 'fiches', 'profils', 'methodologie'])
  require(chemin.join(racine, 'src', f + '.js'));
require(chemin.join(__dirname, 'tests.js'));

let ok = 0, ko = 0, groupe = '';
for (const t of Toiles.tests.liste) {
  if (t.groupe !== groupe) { groupe = t.groupe; console.log(`\n${groupe}`); }
  try {
    t.fn();
    ok++;
    console.log(`  ✓ ${t.nom}`);
  } catch (e) {
    ko++;
    console.log(`  ✗ ${t.nom}\n      ${e.message}`);
  }
}
console.log(`\n${ok} réussi(s), ${ko} échec(s)`);
process.exitCode = ko ? 1 : 0;

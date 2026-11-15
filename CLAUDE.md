# CLAUDE.md — consignes pour travailler sur Toiles

Lis aussi `README.md` (le projet) et `TODO.md` (où on en est).

## Tenue du TODO.md
- En tête, les **Grandes lignes** (grands axes du projet) et les **Décisions prises** (choix techniques et éditoriaux arrêtés).
- **Prochaines étapes** structurées par version / jalon (`### v0.1`, `### v0.2`, etc.).
- Chaque tâche est une case à cocher (`- [x]` pour les tâches terminées, `- [ ]` pour les tâches ouvertes) avec une description concise citant fichiers, fonctions ou règles clés.
- Garder le fichier à jour : cocher une tâche lorsqu'elle est terminée et validée par les tests.

## Le projet
Outil **personnel d'apprentissage** de la numérologie et de l'astrologie. L'utilisateur débute :
il veut comprendre, pas seulement obtenir un résultat. Langue : **français** partout (interface, code, commentaires).

## Règles techniques (non négociables)
- **Vanilla JS / HTML / CSS, zéro dépendance**, zéro outil de build, zéro CDN.
- Doit marcher en **double-clic sur `index.html`** (file://) :
  - scripts **classiques** `<script src>`, **pas de modules ES** (`import`/`export` bloqués en file://) ;
  - pas de `fetch` de fichiers locaux → les données (textes, villes…) vivent dans des fichiers `.js`.
- Chaque module s'attache à `globalThis.Toiles` via `(function (T) { ... })(globalThis.Toiles = globalThis.Toiles || {})`,
  pour fonctionner aussi dans Node (tests rapides avec `node -e "require('./src/...')"`).
- Persistance : `localStorage` seulement (profils), toujours dans un `try/catch`.
- Interface adaptative ordinateur + téléphone. Style **sobre et clair**, mode sombre selon le système.

## Code lisible par l'utilisateur
L'utilisateur veut **comprendre et modifier le code lui-même** :
- commentaires **détaillés en français** : le *pourquoi*, pas seulement le *quoi* ;
- noms de variables et fonctions en français, explicites (`anneePersonnelle`, pas `ap`) ;
- fonctions courtes, une responsabilité chacune ; pas d'astuce obscure ;
- séparer **calcul** (`src/*.js` purs, sans DOM) / **textes** (données) / **affichage** (`app.js`).

## Choix de contenu
- Numérologie **pythagoricienne** ; maîtres-nombres 11, 22, 33 conservés.
- Semaine numérologique = mois + n° de semaine ISO (convention Toiles, à signaler comme telle).
- Astrologie **tropicale géocentrique** ; astres : Soleil → Neptune (Pluton, nœuds, Chiron : plus tard).
- Lecture **par jour** (pas d'heure précise), sauf pour le thème natal.
- Domaines : `essence`, `amour`, `travail`, `finances`, `sante`, `spiritualite`.
- Textes **concis** : mot-clé + phrase courte. Pas de source imposée → significations les plus courantes en français.
- Lecture croisée : **correspondances expliquées**, pas une note globale.
- Chaque module a une infobulle « Comment ça marche » : principe, base de calcul, limites.

## Vérification
- **Lancer les tests** après toute modification de `src/` : `node tests/tout.js` (ou ouvrir `tests/index.html`). Tout doit être vert avant de livrer. Un nouveau calcul ou un nouveau texte de référence → un nouveau test dans `tests/tests.js`.
- Les tests sont un outil de développement : l'application ne doit jamais en dépendre. `index.html` en double-clic reste la seule chose nécessaire à l'utilisateur.
- Tout calcul astronomique modifié est revérifié contre des dates connues (équinoxes, pleines lunes, rétrogradations publiées).
- Vérifier la page dans un navigateur (pas d'erreur console) avant de livrer.

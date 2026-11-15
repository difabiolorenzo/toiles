# Toiles

Outil personnel pour **apprendre** la numérologie et l'astrologie en les pratiquant au quotidien.
JS / HTML / CSS **vanilla, sans dépendance**. S'ouvre par double-clic sur `index.html`.

---

## Cahier des charges

### Principes
- **Usage** : personnel, orienté apprentissage. Chaque résultat montre *comment* il est obtenu et *ce qu'il signifie*.
- **Traditions** : numérologie pythagoricienne, astrologie tropicale géocentrique.
- **Granularité** : lecture **par jour** (pas d'heure précise).
- **Textes** : concis, mots-clés + phrases courtes. Rédigés pour Toiles, sans source externe imposée.
- **Domaines** : essence, amour, travail, finances, santé, spiritualité.
- **Interface** : sobre et claire, s'adapte à l'ordinateur et au téléphone.
- **Accès** : fichier local. Passage possible sur GitHub Pages plus tard.
- **Code** : commenté en détail, en français, pour être compris et modifié à la main.

### Modules
Utilisables seuls ou ensemble. Chacun a une **infobulle « Comment ça marche »** : principe, base de calcul, limites.

| Module | Rôle | Données nécessaires |
|---|---|---|
| **Numérologie** | Nombres universels et personnels : jour, semaine, mois, année | Date (+ naissance pour le personnel) |
| **Ciel** | Planètes Soleil → Neptune, Lune, rétrogradations, aspects, éléments et modes | Date |
| **Transits** | Le ciel du jour comparé au thème natal d'un profil | Date de naissance (+ heure et lieu pour les maisons) |
| **Lecture croisée** | Correspondances **expliquées** entre nombres, ciel et transits (ex. « le 4 et la Lune en Taureau parlent tous deux de stabilité ») | Ce qui est disponible |

### Apprentissage
- **Calcul détaillé** à déplier sous chaque résultat (ex. 2026 → 2+0+2+6 = 10 → 1).
- **Fiches glossaire** : une par nombre, signe, planète, aspect.
- **Leçon du jour** : un concept expliqué à partir des nombres ou du ciel du jour.

### Profils
- Plusieurs profils (moi + proches), enregistrés dans le navigateur.
- Par profil : nom, date de naissance, et en option l'heure et le lieu.
- Lieu : petite liste de villes intégrée + saisie manuelle latitude/longitude en secours.

---

## Avancement

Tâches ouvertes, plan de route et idées pour plus tard : voir [`TODO.md`](TODO.md).
Consignes de travail pour Claude : voir [`CLAUDE.md`](CLAUDE.md).

---

## État actuel (brouillon)

Un premier jet existe déjà et servira de base à la vue Aujourd'hui :

```
index.html            page de démonstration
src/numerologie.js    module numérologie  → Toiles.numerologie
src/astres.js         module ciel          → Toiles.astres
src/transits.js       transits personnels (ciel du jour × thème natal) → Toiles.transits
src/textes.js         textes des infobulles « Comment ça marche » → Toiles.textes
src/glossaire.js      définitions des termes (nombres, planètes, signes, aspects, ℞…) → Toiles.glossaire
src/positions.js      « planète en signe » : 108 textes + dignités → Toiles.positions
src/fiches.js         fiches complètes assemblées depuis le glossaire → Toiles.fiches
src/profils.js        profils (données seulement), stockés dans le navigateur → Toiles.profils
src/methodologie.js   volet méthodologie et pédagogie → Toiles.methodologie
tests/index.html      tests permanents, en double-clic (ou : node tests/tout.js)
src/app.js            vue Aujourd'hui : filtre, infobulles, rendu, panneaux
src/toiles.css        styles
```

Les modules s'attachent à `globalThis.Toiles` : ils fonctionnent dans le navigateur (`<script>`) comme dans Node (`require('./src/astres.js')`).

**Calculs** : éléments orbitaux de Paul Schlyter + perturbations principales (Lune, Jupiter, Saturne). Précision < 1°, vérifiée sur l'équinoxe de mars 2024 et la pleine lune du 23/04/2024.

**Convention à connaître** : la « semaine » numérologique n'a pas de règle standard. Toiles utilise *mois + n° de semaine ISO*.

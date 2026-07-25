# F1 Tracker

App web (React + TypeScript + Vite) pour suivre calendrier, résultats et classements F1, avec theming dynamique par écurie préférée.

## Stack
- React + TypeScript + Vite
- Tailwind CSS
- TanStack Query (cache des appels API)
- Recharts (graphique d'évolution des classements)
- react-router-dom
- API : [Jolpica-F1](https://github.com/jolpica/jolpica-f1) (remplaçant communautaire d'Ergast, gratuit, sans clé)

## Démarrer

```bash
npm install
npm run dev
```

## Structure

```
src/
  features/
    calendar/        → calendrier de la saison en cours
    race-results/     → résultats d'une course
    standings/         → classements pilotes (actuel + évolution)
    circuits/           → liste des circuits + historique des vainqueurs
    team-theme/          → sélecteur d'écurie + thème CSS dynamique
  shared/
    api/               → client Jolpica + hooks TanStack Query
    ui/                → composants génériques (Card, Badge, TableRow, Skeleton)
```

## Notes
- Le thème (couleur d'écurie) est stocké en `localStorage`, appliqué via des variables CSS (`--color-primary`, `--color-primary-ink`) sur `:root`.
- Les couleurs d'écurie sont statiques dans `teamThemes.ts` — à ajuster en cas de rebrand officiel.
- Le mapping `constructorId` (Jolpica) → écurie interne est dans `constructorIdMap.ts` : à vérifier/compléter si un `constructorId` a changé côté API.
- Encore à faire : page constructeurs (classement écuries), gestion d'erreur plus fine, tests.

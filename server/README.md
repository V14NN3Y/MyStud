# mystud-server

Backend minimal pour MyStud, construit pour combler quatre limites précises
listées dans `docs/security-and-quality.md` (section 7, "Limites connues
avant production") et dans `project_plan.md` (Phase 8). Ce n'est pas la
Phase 8 complète : c'est une première tranche réelle et testée. Le frontend
commence à s'y brancher (voir "Intégration frontend" ci-dessous) mais la
plupart des pages restent encore 100% démo.

## Ce qui est réellement implémenté

- **Rôles vérifiés côté serveur** (`src/auth.ts`, `src/routes/auth.ts`) —
  un JWT signé côté serveur porte le rôle ; chaque route protégée vérifie ce
  jeton, elle ne fait plus confiance à un état côté client. Il n'y a
  toujours pas de vrai fournisseur d'identité derrière — n'importe quel rôle
  démo reste demandable — mais c'est le serveur qui décide ensuite, pas
  l'interface.
- **Journal d'audit persistant et append-only** (`src/db.ts`,
  `src/routes/audit.ts`) — table SQLite avec des triggers `BEFORE UPDATE`/
  `BEFORE DELETE` qui lèvent une erreur : impossible de modifier ou
  supprimer une entrée par une voie normale, même avec un accès direct à la
  base (vérifié par `test/audit.test.ts`).
- **Documents privés avec liens temporaires** (`src/routes/documents.ts`) —
  les fichiers ne sont jamais servis publiquement ; obtenir un lien de
  téléchargement nécessite d'être le propriétaire (par matricule) ou un rôle
  institutionnel, et le lien signé expire au bout de 5 minutes.
- **Tokenisation du NPI** (`src/routes/identity.ts`) — le NPI brut n'est
  jamais stocké : `tokenizeNpi` calcule un HMAC-SHA256 déterministe avec un
  secret serveur. Même NPI → même jeton (pour reconnaître un visiteur), mais
  le jeton ne se retransforme pas en NPI sans le secret.
- **E-mail réel via Resend** (`src/notifications/channel.ts`,
  `src/routes/notifications.ts`) — si `RESEND_API_KEY` est défini,
  `emailChannel` envoie un vrai e-mail via l'API Resend ; sinon il retombe
  sur `ConsoleChannel` (journalise au lieu d'envoyer), donc le serveur
  fonctionne à l'identique avec ou sans clé. Testé (`test/notifications.test.ts`)
  en mockant `fetch` — aucun test n'appelle jamais le vrai réseau Resend.
  Exposé via `POST /api/notifications/send`.
- **Fil de notifications persistant** (`src/db.ts`, `src/routes/notifications.ts`)
  — tables `notifications` et `notification_preferences` : l'état lu/non-lu
  et les préférences de canal par catégorie sont écrits en base, pas
  seulement dans l'état React d'un onglet. Public (sans `requireRole`) comme
  `identity.ts` : il n'y a pas de compte étudiant réel à authentifier.
  Exposé via `GET /api/notifications`, `PATCH /api/notifications/:id/read`,
  `PATCH /api/notifications/read-all`, `GET /api/notifications/preferences`,
  `PATCH /api/notifications/preferences/:categorie`.

## Intégration frontend

Le client API frontend vit dans `src/lib/api.ts` (racine du repo, pas dans
`server/`), configurable via `VITE_API_URL` (défaut : `http://localhost:4000`).

- **Branché** : le wizard `/acces` (étape 3 → 4) appelle réellement
  `POST /api/identity/tokenize` — le NPI est tokenisé côté serveur, le
  jeton renvoyé est stocké dans `ProfilDemo.npiToken` et affiché dans le
  récapitulatif ; l'e-mail saisi déclenche un vrai envoi Resend. CORS est
  ouvert uniquement à `CORS_ORIGIN` (`src/app.ts`).
- **Branché** : `NotificationsProvider` (donc la cloche de la navbar et
  `/notifications` sur tout le site) lit et écrit le fil de notifications et
  les préférences via le backend — plus de compteur non-lu figé dans un
  fichier mock. Si le backend est indisponible, la liste reste vide (aucune
  fausse donnée) et `/notifications` affiche un bandeau "Backend
  indisponible" plutôt que de fabriquer un état.
- **Pas encore branché** : le `RoleSwitcher` de `/universite` reste un
  `useState` client (pas d'appel à `/api/auth/session`), le journal d'audit
  affiché y est toujours le tableau mock en mémoire (pas `/api/audit`), et
  aucune page n'utilise encore `/api/documents`.

## Ce qui n'est pas fait

- **SMS réel** — Resend ne couvre que l'e-mail. `smsChannel` reste un
  `ConsoleChannel` ; brancher un vrai SMS demande un autre fournisseur
  (Twilio, etc.) et ses identifiants — voir le squelette `TwilioSmsChannel`
  commenté dans `src/notifications/channel.ts`.
- **Gouvernance NPI/ANIP réelle**, MFA agents, sauvegardes/plan de reprise —
  toujours hors de portée d'un backend de démonstration ; voir
  `docs/security-and-quality.md` section 7-8.

## Lancer le serveur

```bash
cd server
npm install
npm run dev        # http://localhost:4000, redémarre au changement de fichier
```

Aucun `.env` n'est requis en développement : chaque secret a un fallback
clairement marqué "insecure/dev-only" dans `src/env.ts`. En production
(`NODE_ENV=production`), copiez `.env.example` vers `.env` et remplissez
`JWT_SECRET`, `NPI_HMAC_SECRET`, `DOWNLOAD_LINK_SECRET` — le serveur refuse
de démarrer sans eux.

La base SQLite et les documents uploadés vivent dans `server/data/`
(ignoré par git, recréé automatiquement).

## Envoyer un vrai e-mail (Resend)

1. `cp .env.example .env`
2. Renseignez `RESEND_API_KEY` dans `.env` (un compte Resend créé pour un
   autre projet fonctionne — voir "Ce qui est réellement implémenté"
   ci-dessus pour les nuances de domaine/quota partagés). `.env` est ignoré
   par git : la clé ne quitte jamais votre machine.
3. `npm run dev`, puis :
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/session \
     -H "Content-Type: application/json" -d '{"role":"admin"}' | python3 -c "import json,sys; print(json.load(sys.stdin)['token'])")
   curl -X POST http://localhost:4000/api/notifications/send \
     -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
     -d '{"to":"votre-adresse@example.com","channel":"email","subject":"Test MyStud","message":"Ça marche."}'
   ```
   Sans domaine vérifié dans Resend, `to` doit correspondre à l'adresse du
   compte Resend lui-même (limite du sandbox `onboarding@resend.dev`).

## Tests

```bash
npm run test        # node --test, 0 dépendance de test ajoutée
npm run type-check
```

Chaque fichier de test démarre sa propre instance du serveur sur un port
aléatoire avec sa propre base SQLite temporaire (`test/helpers.ts`) — aucun
état partagé entre les tests, aucun risque de polluer `server/data/`.

## Pourquoi SQLite via `node:sqlite`

Le module `node:sqlite` est intégré à Node 22+ (encore expérimental) : zéro
dépendance native à compiler, ce qui évite les soucis de build dans des
environnements sans outils de compilation. Pour un vrai déploiement, migrer
vers Postgres reste simple — le SQL utilisé ici (`src/db.ts`) est standard,
sans fonctionnalité propre à SQLite hormis les triggers d'immuabilité, qui
ont un équivalent direct en Postgres (`CREATE RULE` ou un trigger
équivalent).

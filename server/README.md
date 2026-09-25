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
- **Workflows institutionnels de `/universite` persistants** (`src/db.ts`,
  `src/routes/candidatures.ts`, `publications.ts`, `notesValidations.ts`) —
  accepter/refuser/mettre en liste d'attente une candidature, publier un
  emploi du temps, valider des notes : ces trois entités vivent maintenant
  en base plutôt que dans l'état React de `CandidatureQueue`,
  `PublicationPanel` et `NotesValidation`, qui repartait à zéro à chaque
  rechargement. Protégé par `requireRole(...INSTITUTIONAL_ROLES)` (partagé
  depuis `src/auth.ts`), comme le journal d'audit. Exposé via
  `GET /api/candidatures`, `PATCH /api/candidatures/:id/decision`,
  `GET /api/publications`, `PATCH /api/publications/:id/toggle`,
  `GET /api/notes-validations`, `PATCH /api/notes-validations/:id/valider`.
- **Suivi de bourses étudiant persistant** (`src/db.ts`,
  `src/routes/bourseCandidatures.ts`) — déposer une candidature de bourse,
  la retirer, ou envoyer une pièce complémentaire demandée : ces trois
  actions ne vivaient que dans l'état React de `/bourses/suivi`, y compris
  le bouton "J'ai déposé ces pièces" qui ne changeait même pas le statut
  localement. Public comme les notifications (pas de compte étudiant réel) ;
  le serveur génère lui-même la référence de suivi (`MYSTUD-BRS-2026-XXXXXX`),
  pas le client. Exposé via `GET /api/bourse-candidatures`,
  `POST /api/bourse-candidatures`, `DELETE /api/bourse-candidatures/:id`,
  `PATCH /api/bourse-candidatures/:id/deposer-pieces`.

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
- **Branché** : `/universite` obtient un vrai jeton via
  `POST /api/auth/session` à chaque changement de rôle (le `RoleSwitcher`
  continue d'*offrir* un rôle pour la démo, mais chaque lecture/écriture
  protégée passe désormais par ce jeton signé serveur, pas par un état
  client). Le journal d'audit s'alimente réellement via `GET`/`POST
  /api/audit`, et le module "Documents administratifs" (rôle Service de
  scolarité) utilise `POST /api/documents` puis `GET
  /api/documents/:id/link` pour générer un vrai lien de téléchargement
  temporaire. Si le backend est indisponible, la page bascule sans erreur
  sur l'état 100% démo précédent (bandeau "Mode démonstration locale").
- **Branché** : `CandidatureQueue`, `PublicationPanel` et `NotesValidation`
  (dans `/universite`) chargent leurs listes réelles dès qu'un jeton de
  session existe, et chaque décision/publication/validation persiste via
  l'API au lieu de rester dans l'état React du composant. Si le backend est
  indisponible, chacun retombe sur son contenu mock d'origine (mode
  démonstration locale, comme le reste de la page).
- **Branché** : `/bourses/suivi` charge la vraie liste au montage, la
  soumission du wizard et le retrait d'une candidature persistent, et
  "J'ai déposé ces pièces" fait vraiment repasser le dossier en instruction
  au lieu d'un simple cocher local. Backend indisponible → liste vide et
  bandeau "Backend indisponible" plutôt qu'un faux état vide ou des données
  mock présentées comme réelles.
- **Pas encore branché** : aucune autre page n'utilise `/api/documents`
  (relevés/certificats côté `/etudiant`, par exemple). Le catalogue des
  programmes de bourse (`bourses.ts`), les formations/établissements/
  facultés, les emplois, les annonces, la FAQ, le profil étudiant et les
  tableaux de bord ministère restent des mocks statiques dans `src/mocks/`
  — voir "Ce qui n'est pas fait" ci-dessous.

## Ce qui n'est pas fait

- **SMS réel** — Resend ne couvre que l'e-mail. `smsChannel` reste un
  `ConsoleChannel` ; brancher un vrai SMS demande un autre fournisseur
  (Twilio, etc.) et ses identifiants — voir le squelette `TwilioSmsChannel`
  commenté dans `src/notifications/channel.ts`.
- **Gouvernance NPI/ANIP réelle**, MFA agents, sauvegardes/plan de reprise —
  toujours hors de portée d'un backend de démonstration ; voir
  `docs/security-and-quality.md` section 7-8.
- **Les autres domaines de contenu** (catalogue des programmes de bourse,
  formations, établissements, facultés, emplois, annonces, FAQ, profil
  étudiant, stats ministère) n'ont pas de table ni d'endpoint : ce sont
  encore des fichiers statiques dans `src/mocks/`. Ce sont majoritairement
  des catalogues de référence plutôt que de l'état qui se fait passer pour
  réel, donc moins prioritaires que les trois domaines déjà migrés
  (notifications, workflows institutionnels de `/universite`, suivi de
  bourses étudiant) ; les autres suivraient le même patron (table SQLite +
  routes + réécriture du provider/de la page correspondante) s'ils sont
  demandés.

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

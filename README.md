# MyStud — Portail national de l'enseignement supérieur du Bénin

Portail public + espaces personnels + pilotage institutionnel pour l'enseignement
supérieur béninois : identification du nouveau bachelier, catalogue national des
formations et établissements, candidatures, bourses, espace étudiant, espace
université et espace ministère.

**⚠️ Prototype de démonstration.** Aucune donnée réelle, aucune connexion ANIP /
office du baccalauréat / système de paiement. Chaque écran qui simule une
vérification officielle l'indique explicitement. Voir [« Ce qui est réel vs
démonstration »](#ce-qui-est-réel-vs-démonstration) plus bas pour le détail exact.

🔗 **Démo en ligne** : https://mystud-benin.vercel.app *(frontend seul, voir
[Déploiement](#déploiement))*

## Sommaire

- [Stack technique](#stack-technique)
- [Démarrage rapide](#démarrage-rapide)
- [Scripts disponibles](#scripts-disponibles)
- [Tester le site (identifiants de démonstration)](#tester-le-site-identifiants-de-démonstration)
- [Structure du projet](#structure-du-projet)
- [Pages / routes](#pages--routes)
- [Backend](#backend)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Ce qui est réel vs démonstration](#ce-qui-est-réel-vs-démonstration)

## Stack technique

- **Frontend** : Vite + React 19 + TypeScript (strict) + Tailwind CSS +
  react-router-dom v7 + react-i18next (français uniquement pour l'instant).
- **Backend** (optionnel, dans `server/`) : Node/Express + `node:sqlite`
  (intégré à Node 22+, aucune dépendance native à compiler). Voir
  [server/README.md](server/README.md) pour le détail complet.
- **Tests** : Vitest + Testing Library côté frontend, `node --test` côté
  backend (volontairement deux outils différents, pour garder le backend
  léger en dépendances).
- **Polices et icônes** auto-hébergées (`@fontsource`, `remixicon`) — pas de
  CDN tiers, pour un portail public.
- **Déploiement** : Vercel (frontend statique).

## Démarrage rapide

```bash
npm install
npm run dev        # http://localhost:3000
```

Le site fonctionne sans rien configurer de plus : toutes les pages tournent
sur des données de démonstration (`src/mocks/`). Pour activer les
fonctionnalités réellement persistées (notifications, workflows université,
suivi de bourses — voir plus bas), lancez aussi le backend :

```bash
cd server
npm install
npm run dev         # http://localhost:4000
```

Le frontend le détecte automatiquement (`VITE_API_URL`, défaut
`http://localhost:4000` — voir `.env.example`). Sans backend, chaque page
concernée bascule proprement sur un état "mode démonstration locale" ou un
bandeau "backend indisponible" plutôt que de simuler un faux succès.

## Scripts disponibles

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement Vite (port 3000) |
| `npm run build` | Build de production dans `out/` |
| `npm run preview` | Sert le build de production en local |
| `npm run lint` | ESLint sur `src/` |
| `npm run type-check` | `tsc --noEmit` |
| `npm run test` | Suite de tests Vitest |
| `npm run test:watch` | Tests en mode watch |

Côté backend (`cd server`) : `npm run dev`, `npm run test`, `npm run type-check`
— voir [server/README.md](server/README.md).

## Tester le site (identifiants de démonstration)

Il n'y a **aucun vrai système d'authentification** (pas de couple
identifiant/mot de passe) — c'est un choix assumé du prototype
(`project_plan.md` : *« aucune connexion réelle ANIP / bac / paiement
revendiquée »*). Chaque espace a son propre mécanisme de démonstration :

### Espace candidat (`/acces`)

Le parcours d'identification du nouveau bachelier accepte **n'importe quelle
valeur plausible** :

1. **NPI** : 10 chiffres, n'importe lesquels (ex. `1234567890`).
2. **Téléphone** : au moins 8 chiffres (ex. `0197000000`).
3. **Code à usage unique** : généré côté client et **affiché directement à
   l'écran** (encadré jaune "Code de démonstration") — il n'y a pas de vrai
   envoi SMS, recopiez simplement le code affiché.
4. **Baccalauréat** : un numéro de table quelconque (non vide), une série
   au choix, et une **vraie adresse e-mail** — celle-ci reçoit un e-mail de
   confirmation réel si le backend tourne avec une clé Resend configurée
   (voir [server/README.md](server/README.md#envoyer-un-vrai-e-mail-resend)).

Une fois les 4 étapes validées, vous arrivez sur `/espace` avec un profil
étudiant fictif généré de façon déterministe à partir du NPI saisi (même NPI
→ même profil, à chaque fois).

### Espace université (`/universite`)

Pas de connexion : un sélecteur de rôle en haut de page permet de se
présenter comme n'importe lequel des 10 rôles institutionnels prévus —
cliquez simplement sur un rôle pour voir les modules qui lui sont ouverts :

| Rôle | Modules ouverts |
| --- | --- |
| Ministère | Tableau de bord, bourses, annonces, offre ciblée, audit |
| Direction nationale | Tableau de bord, candidatures, bourses, audit |
| Université | Tableau de bord, candidatures, formations, publications, notes, annonces, audit |
| Faculté | Tableau de bord, candidatures, formations, notes |
| Service de scolarité | Candidatures, publications, notes, **documents** |
| Enseignant | Notes |
| Agent de bourse | Bourses |
| Recruteur vérifié | Offres et recruteurs |
| Parent ou tuteur | Tableau de bord |
| Administrateur technique | Rôles et habilitations, audit |

Chaque changement de rôle obtient un vrai jeton signé côté serveur
(`POST /api/auth/session`) si le backend tourne ; sinon la page repasse en
mode démonstration locale sans erreur. Les modules **File de candidatures**,
**Publications**, **Validation des notes**, **Documents administratifs** et
**Journal d'audit** sont réellement persistés en base quand le backend est
actif (voir [server/README.md](server/README.md)) — les autres modules
restent des vitrines "Démonstration".

### Espace ministère (`/ministere`)

Aucune connexion requise : le tableau de bord national est ouvert
directement.

### Suivi de bourses (`/bourses/suivi`)

Aucune connexion propre à cette page : elle utilise le profil créé via
`/acces`, ou fonctionne même sans être passé par `/acces`. "Nouvelle
candidature" ouvre un assistant qui ne demande que le choix d'un programme
de bourse ouvert — le dépôt, le retrait et l'envoi de pièces complémentaires
sont réellement persistés côté serveur si le backend tourne.

## Structure du projet

```
├── src/
│   ├── pages/          # Une page par route (voir tableau ci-dessous)
│   ├── components/     # base/ (UI générique) et feature/ (navbar, footer, etc.)
│   ├── hooks/           # useDemoSession, useNotifications, providers
│   ├── mocks/           # Données de démonstration par domaine
│   ├── lib/             # Client API (api.ts) et utilitaires (format.ts)
│   ├── i18n/            # Traductions françaises (une par domaine fonctionnel)
│   └── router/          # Configuration des routes (code-splitting par page)
├── server/               # Backend Express minimal (voir server/README.md)
├── public/               # favicon, robots.txt, sitemap.xml
├── docs/                 # Notes sécurité/qualité, plan projet
└── vercel.json           # Configuration de déploiement (frontend uniquement)
```

## Pages / routes

| Route | Page |
| --- | --- |
| `/` | Accueil |
| `/formations`, `/formations/:id`, `/formations/comparer` | Catalogue national des formations |
| `/etablissements`, `/etablissements/:id` | Annuaire des établissements |
| `/bourses`, `/bourses/suivi` | Bourses et aides + suivi de candidature |
| `/stages-emplois` | Offres de stages et d'emplois |
| `/annonces` | Annonces et calendrier des campagnes |
| `/acces` | Identification du nouveau bachelier (NPI + OTP démo) |
| `/espace`, `/espace/etudiant` | Espace candidat puis espace étudiant |
| `/ministere` | Tableau de bord ministère (agrégé, anonymisé) |
| `/universite` | Espace université et rôles institutionnels |
| `/notifications` | Notifications et préférences |
| `/faq` | Questions fréquentes |
| `*` | Page introuvable |

## Backend

Le backend (`server/`) est un ajout minimal et volontairement limité en
dépendances : rôles vérifiés côté serveur, journal d'audit append-only,
documents privés à lien temporaire, tokenisation NPI, envoi d'e-mail réel via
Resend, et trois domaines migrés d'un état React local vers une vraie
persistance (notifications, workflows institutionnels `/universite`, suivi
de bourses étudiant). Tout le reste du site fonctionne sur des données de
démonstration statiques dans `src/mocks/`.

Détails complets, endpoints, et ce qui n'est pas fait : voir
**[server/README.md](server/README.md)**.

## Tests

```bash
npm run test          # frontend (Vitest)
cd server && npm run test   # backend (node --test)
```

Chaque fichier de test backend démarre sa propre instance de serveur sur un
port aléatoire avec sa propre base SQLite temporaire — aucun état partagé
entre les tests. Côté frontend, tout appel réseau non explicitement mocké
est bloqué dans les tests (`src/test/setup.ts`) : aucun test ne dépend d'un
backend réellement démarré.

## Déploiement

Le site est déployé sur Vercel à partir de ce dépôt GitHub
(`V14NN3Y/MyStud`) : chaque push sur `master` déclenche un déploiement de
production, chaque autre branche/pull request obtient un déploiement de
preview.

**Seul le frontend est déployé.** Le backend (`server/`) utilise
`node:sqlite`, qui écrit dans un fichier local — incompatible avec le modèle
serverless de Vercel (pas de disque persistant entre deux invocations).
Déployer ce backend tel quel casserait silencieusement toute la persistance
décrite ci-dessus. Le site déployé tourne donc sans backend, ce que chaque
page gère déjà proprement (mode démonstration locale / bandeau
"indisponible").

Pour brancher un vrai backend en production, il faudrait le déployer sur une
plateforme avec disque persistant (Render, Railway, Fly.io…) et pointer
`VITE_API_URL` (variable d'environnement Vercel) vers son URL.

## Ce qui est réel vs démonstration

- **Réel, persisté en base** (si le backend tourne) : rôles/sessions
  institutionnels, journal d'audit, documents privés à lien temporaire,
  tokenisation NPI, e-mail via Resend, notifications + préférences,
  candidatures/publications/notes de `/universite`, suivi de bourses
  étudiant.
- **Démonstration, données statiques** (`src/mocks/`) : catalogue des
  formations et établissements (fidèle au *Guide d'information et de
  sensibilisation des nouveaux bacheliers 2026-2027*, MESRS), programmes de
  bourse, emplois, annonces, FAQ, profil étudiant, statistiques ministère.

Le détail complet (endpoint par endpoint) est dans
[server/README.md](server/README.md).

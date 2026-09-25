# MyStud — Portail national de l'enseignement supérieur du Bénin
## 1. Description du projet
MyStud est le portail national d'orchestration et de suivi de l'enseignement supérieur béninois. Il accompagne le futur bachelier depuis l'identification (NPI + OTP) jusqu'à l'admission, puis devient l'espace étudiant (inscription, emploi du temps, notes, examens, bourses, documents, stages). Le ministère dispose d'un espace de pilotage agrégé.
- Positionnement : portail public + espaces personnels + pilotage institutionnel (orchestration et traçabilité, pas remplacement des systèmes universitaires).
- Public principal : étudiants et futurs étudiants béninois.
- Périmètre pilote : établissements publics d'abord, établissements privés reconnus prévus dans le modèle mais activés plus tard.
- Langue initiale : français.
- Objectif : prototype fonctionnel démontrable en 48 h, avec mention explicite « données de démonstration » (aucune connexion réelle ANIP / bac / paiement revendiquée).
## 2. Structure des pages
- `/` — Accueil (portail public)
- `/formations` — Catalogue national des formations (recherche + filtres)
- `/formations/:id` — Fiche détaillée d'une formation
- `/etablissements` — Annuaire des établissements
- `/etablissements/:id` — Fiche établissement
- `/bourses` — Bourses et aides publiques
- `/bourses/suivi` — Suivi des candidatures de bourse (dépôt, étapes, statut par programme)
- `/annonces` — Annonces et calendrier des campagnes
- `/stages-emplois` — Stages et emplois (offres vérifiées + profil professionnel)
- `/acces` — Accès à l'espace (identification NPI + OTP démo)
- `/espace` — Espace candidat (profil vérifié, 3 candidatures classées, chronologie des décisions)
- `/espace/etudiant` — Espace étudiant après admission (situation, emploi du temps, notes, examens, documents)
- `/formations/comparer` — Comparateur de formations (2 à 3 côte à côte)
- `/ministere` — Espace ministère (tableaux de bord agrégés)
- `/universite` — Espace université et rôles (file de candidatures, décisions, publications, validation des notes, journal d'audit)
- `/notifications` — Notifications et assistance (canaux, préférences, historique, événements prioritaires)
- `/faq` — Questions fréquentes (NPI, candidatures, statuts, bourses, notes, documents, téléphone)
- `*` — Page introuvable
## 3. Fonctionnalités clés
- [x] Portail public : accueil, catalogue des formations, annuaire des établissements, bourses publiques, annonces/calendrier
- [x] Recherche et filtres de formations (mot-clé, domaine, université, ville, niveau, type d'établissement)
- [x] Fiche formation complète (conditions d'accès, capacité, frais, débouchés, statut de reconnaissance, date de mise à jour)
- [x] Fiche établissement détaillée (composantes/facultés + formations rattachées)
- [x] Comparateur de formations (durée, frais, capacité, débouchés, lien établissement, export imprimable)
- [x] Statut de provenance des données (vérifiée / importée / en attente / démonstration)
- [x] Identification du nouveau bachelier (NPI + OTP simulé) + vérification du bac (démo)
- [x] Dépôt et suivi de 3 candidatures (chronologie détaillée et statuts de décision)
- [x] Espace étudiant : situation, emploi du temps, notes et progression, examens, documents administratifs
- [x] Bourses et aides : dépôt et suivi des candidatures de bourse (soumise, en étude, information complémentaire, acceptée, rejetée, mise en paiement, clôturée)
- [x] Stages / emplois + profil professionnel (visibilité activée par consentement, premier contact contrôlé)
- [x] Espace ministère : tableau de bord national agrégé et anonymisé (effectifs par établissement, filière et zone, candidatures, admissions, listes d'attente, bourses, taux de réussite, alertes)
- [x] Données du guide officiel MESRS 2026-2027 intégrées aux fiches de formation (régime de bourse, quota bourses, places FPP, séries admises)
- [x] Notifications et assistance : canaux (portail/SMS/e-mail), préférences, historique et événements prioritaires + FAQ
- [x] Espace université et rôles : contrôle des rôles, file de candidatures, décisions et motifs standardisés, publication emploi du temps/examens, validation des notes, journal d'audit
- [ ] Envois réels SMS/e-mail et consentements avancés (voir Phase 8)
## 4. Modèle de données (si base de données connectée)
> Non connecté pour l'instant — données de démonstration simulées. Modèle prévisionnel :
### Table: etudiants
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Identifiant interne MyStud |
| npi_token | text | Référence NPI tokenisée/chiffrée |
| statut | text | statut du dossier |
| contact_email | text | e-mail vérifié |
| contact_tel | text | téléphone vérifié |
| maj_le | timestamptz | dernière mise à jour |
### Table: etablissements (id, nom, sigle, ville, type, statut_reconnaissance)
### Table: formations (id, etablissement_id, nom, domaine, niveau, duree, diplome, capacite, frais, statut)
### Table: campagnes (id, libelle, ouverture, fermeture, public_cible)
### Table: candidatures (id, etudiant_id, campagne_id, formation_id, rang_preference, statut, motif_decision, maj_le)
### Table: bourses / candidatures_bourse / documents / examens / notes / offres / notifications / roles / consentements / journal_audit
Séparation stricte : identité / données académiques / données sociales dans des tables distinctes.
## 5. Intégrations backend et tierces
- Base de données : non connectée — données de démonstration pour l'instant (Readdy Backend ou SaaS Supabase envisagé en phase ultérieure)
- ANIP (identité/NPI) : connecteur représenté uniquement (OTP simulé)
- Résultats du baccalauréat : connecteur représenté (données de démonstration)
- Paiements : non prévus au stade du prototype
- Notifications (e-mail/SMS) : non connectées pour l'instant
## 6. Plan de développement par phases
### Phase 1 : Portail public — socle visuel
- Objectif : accueil + catalogue national des formations consultable, avec identité visuelle MyStud.
- Livrable : Accueil (hero de recherche, chiffres clés, formations à la une, domaines, établissements, annonces, bourses, appel à l'action), Catalogue avec filtres et tri, Fiche formation détaillée, navigation et pied de page.
### Phase 2 : Portail public — contenus complémentaires
- Objectif : annuaire des établissements (liste + fiche), bourses et aides publiques, annonces et calendrier des campagnes.
- Livrable : pages `/etablissements`, `/etablissements/:id`, `/bourses`, `/annonces`.
### Phase 3 : Identification et candidatures
- Objectif : parcours du nouveau bachelier (NPI + OTP simulé), vérification du bac, choix de 3 candidatures et suivi.
- Livrable : `/acces` + tableau de bord candidatures.
### Phase 4 : Espace étudiant — LIVRÉ
- Objectif : emploi du temps, notes et progression, examens, documents administratifs.
- Livrable : `/espace/etudiant` — résumé de situation, emploi du temps hebdomadaire (grille/liste + filtres), notes et progression avec demande de vérification, calendrier des examens, documents administratifs (référence unique, QR de vérification). Accès déclenché depuis `/espace` après acceptation d'une candidature.
### Phase 5 : Espace ministère — LIVRÉ
- Objectif : tableaux de bord agrégés et anonymisés + alertes de pilotage.
- Livrable : `/ministere` — KPI nationaux, filtre par périmètre (national / zone), effectifs par établissement et par filière, répartition par zone et par genre, évolution sur cinq ans, candidatures/admissions/listes d'attente par établissement, taux de réussite par niveau, suivi des bourses, alertes de pilotage, export/impression. Toutes les données sont agrégées et anonymisées.
### Phase 6 : Modules transversaux — PARTIELLEMENT LIVRÉ
- Objectif : bourses (candidatures), stages/emplois et profil professionnel, notifications.
- Livré : `/bourses/suivi` (dépôt en 4 étapes + chronologie par programme) et `/stages-emplois` (offres vérifiées, filtres, fiche détaillée, profil professionnel avec visibilité par consentement, messagerie contrôlée).
- À venir : notifications réelles, moteur de rôles/permissions.
### Phase 7 : Données officielles, notifications et espace institutionnel — LIVRÉ
- Objectif : intégrer le guide officiel aux formations, outiller les notifications et l'assistance, ouvrir l'espace université avec contrôle des rôles.
- Livré :
  - Fiches de formation enrichies par le guide MESRS (régime de bourse, quota de places boursières, places à frais partagés FPP, séries admises), reprises dans la carte, la fiche détail et le comparateur.
  - `/notifications` : trois canaux (portail obligatoire, SMS, e-mail), préférences par catégorie, historique avec état d'envoi, notification prioritaire et liste des événements prioritaires.
  - `/faq` : questions fréquentes par thème (NPI, candidatures, statuts, bourses, notes, documents, téléphone) avec recherche.
  - `/universite` : sélecteur de rôle (moindre privilège), file de candidatures avec décisions (accepter / liste d'attente / refuser avec motif standardisé), publication emploi du temps et examens, validation des notes, journal d'audit.
### Phase 8 : Passage en production (à venir)
- Objectif : sécurité, gouvernance des données et intégrations réelles.
- À venir : habilitations vérifiées côté serveur, journal d'audit immuable, stockage privé des documents, tokenisation du NPI, canaux SMS/e-mail réels, sauvegardes et plan de reprise. Voir `docs/security-and-quality.md`.

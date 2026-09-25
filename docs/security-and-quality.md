MyStud — Sécurité, confidentialité et qualité des données

    Prototype de démonstration. Ce document décrit ce qui est en place dans le prototype,
    ce qui est simulé, et les limites connues avant toute mise en production réelle.

1. Nature du prototype

MyStud tel que livré est un prototype de présentation. Aucune connexion réelle n’est
active : l’identité (ANIP), les résultats du baccalauréat, les systèmes universitaires et
les paiements sont simulés. Les écrans concernés affichent une mention explicite
« données de démonstration ».

Les écrans ne doivent jamais laisser croire qu’une connexion officielle est active alors
qu’elle ne l’est pas. Les notifications (portail, SMS, e-mail) sont présentées comme des
canaux abstraits : aucun envoi réel n’est effectué.
2. Données sensibles et identité

    Aucun NPI réel, OTP réel ou secret n’est présent dans le code. Le NPI saisi dans la
    démonstration sert uniquement à générer une identité fictive et déterministe
    (creerProfilDemo) ; il n’est jamais transmis ni stocké côté serveur.

    Le NPI n’apparaît dans aucune URL. Il reste une donnée d’identification réservée à
    l’appairage d’identité. MyStud attribue un matricule interne (MS-AAAA-XXXXXX) qui
    sert d’identifiant d’affichage.

    Les données affichées portent toujours une provenance (Vérifiée / Importée / En attente
    / Démonstration) et une date de mise à jour (composant StatusBadge, libellés
    « Mise à jour le … »).

3. Accès, rôles et périmètre

    L’espace candidat (/espace) et l’espace étudiant (/espace/etudiant) sont protégés par
    une barrière d’accès (EspaceGate, EtudiantGate) : sans identification, l’accès aux
    données personnelles est remplacé par un écran d’invitation.

    L’espace institutionnel (/universite) implémente un contrôle des rôles : chaque rôle
    (ministère, direction nationale, université, faculté, scolarité, enseignant, agent de
    bourse, recruteur vérifié, parent, administrateur technique) ne voit que les modules
    autorisés à sa mission, selon le principe du moindre privilège.

    L’espace ministère (/ministere) n’affiche que des données agrégées et anonymisées :
    aucun effectif individuel, aucune note, aucune identité. Un badge « Agrégé · Anonymisé »
    le rappelle en tête de page.

    Limite connue : dans le prototype, le changement de rôle est un sélecteur de
    démonstration (côté client). En production, l’habilitation doit être vérifiée côté
    serveur (jeton, rôle, périmètre) et non par l’interface.

4. Traçabilité et audit

    Toute action importante de l’espace institutionnel produit un événement d’audit
    (décision d’admission, refus avec motif, publication, validation de notes) : action, cible,
    auteur, rôle et horodatage. Le journal d’audit affiche ces événements.

    Les motifs de refus sont standardisés (liste fermée) et un commentaire facultatif
    les complète, conformément à la règle de traçabilité des décisions.

    Limite connue : le journal d’audit du prototype vit en mémoire. En production, il doit
    être immuable (append-only) et conservé côté serveur ; une suppression ou une correction
    ne doit jamais effacer l’historique.

5. Sécurité applicative et bonnes pratiques

    Aucune clé d’API ni secret n’est écrit dans le code du prototype.

    Aucune donnée personnelle n’est exposée dans les URL (les routes n’utilisent que des
    identifiants de ressources publics : formationId, etablissementId).

    Les pièces et documents administratifs sont présentés comme produits par les systèmes
    officiels. En production, ils doivent être stockés dans un espace privé et servis via
    des liens temporaires ou un contrôle d’autorisation — jamais publiquement accessibles.

    Les notes et les bourses ne sont visibles que selon les autorisations : une note
    n’apparaît pour l’étudiant qu’après validation par le circuit de l’établissement
    (écran « Validation des notes »).

    Ne jamais solliciter de secret par messagerie : les clés (Resend, OpenAI, fournisseurs de
    paiement…) doivent être fournies via les intégrations sécurisées ou les secrets backend.

6. Qualité de l’expérience et accessibilité

    Erreurs compréhensibles : écrans dédiés (formation introuvable, état vide, message
    d’échec d’envoi de notification).

    Formulaires : labels explicites, focus visible (focus:ring), messages d’erreur
    lisibles (ex. motif de refus obligatoire), limitation des zones de texte à 500 caractères.

    Tableaux sur mobile : contenus enveloppés dans un conteneur à défilement horizontal
    (overflow-x-auto + largeur minimale), jamais compressés.

    Graphiques : chaque visualisation est complétée par des valeurs chiffrées et des
    intitulés lisibles (listes de barres, légendes, valeurs des donuts), de sorte qu’un
    résumé textuel de l’information reste disponible sans dépendre de la couleur.

    Mouvement réduit : les animations de décompte et les apparitions respectent
    prefers-reduced-motion (les valeurs s’affichent directement lorsque l’utilisateur le
    demande).

    Navigation : chaque page est joignable depuis la navigation, le pied de page ou un lien
    contextuel ; aucune route ne crée d’impasse (page * de secours incluse).

7. Limites connues avant production

    Gouvernance des données : l’usage du NPI et du service ANIP nécessite un accord
    institutionnel, une base juridique et une politique de minimisation.

    Habilitations côté serveur : le contrôle des rôles doit être exécuté côté backend, pas
    seulement dans l’interface de démonstration.

    Journal d’audit persistant et immuable : à mettre en place côté serveur.

    Stockage privé des documents : liens temporaires et contrôle d’autorisation à ajouter.

    Chiffrement / tokenisation du NPI : références tokenisées selon l’architecture retenue.

    Authentification renforcée des agents : MFA, séparation des rôles, journalisation des
    connexions.

    Sauvegardes, plan de reprise et procédure d’incident : à prévoir avant ouverture
    nationale.

    Canaux SMS / e-mail réels : à connecter après choix des fournisseurs et configuration
    explicite ; aucun envoi réel n’est effectué dans le prototype.

    Droits des personnes : consultation des données détenues, demande de correction et
    gestion des consentements à finaliser.

8. Décisions à faire valider par le ministère

Avant toute production : autorisation d’usage du NPI/ANIP ; autorité responsable du
traitement ; universités du pilote ; système officiel du baccalauréat à interroger ; statuts
de prise en charge ; responsabilité des décisions d’admission ; règles d’accès parental ;
circuits de validation des notes ; documents pouvant être signés électroniquement ; règles de
publication des statistiques ; canaux SMS et e-mail ; hébergement ; durée de conservation ;
traitement des étudiants étrangers.
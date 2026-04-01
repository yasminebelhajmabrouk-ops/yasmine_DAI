# Architecture Backend — DAI-BMAD

## 1. Objectif

Ce document décrit l’architecture backend du projet **DAI-BMAD — Dossier d’Anesthésie Intelligent**.

Le backend est conçu comme un **monolithe Django modulaire**, aligné avec les documents d’architecture, le PRD, les diagrammes UML et les diagrammes C4 du projet. Il couvre le parcours anesthésique complet :

- **pré-opératoire**
- **per-opératoire**
- **post-opératoire / SSPI**

L’objectif du backend est de fournir :
- une API REST claire et structurée
- une persistance fiable des données cliniques
- une traçabilité complète via audit
- une base évolutive pour les alertes, rapports, intégrations SIH/DPI, biomédical et IA

---

## 2. Principes d’architecture

### 2.1 Monolithe modulaire
Le backend suit une architecture **Django modulaire par apps**, conformément aux documents de solutioning du projet.

Cela signifie :
- un seul backend Django
- plusieurs modules métier séparés
- une API REST unique
- une base de données PostgreSQL (ou SQLite en développement)

### 2.2 Séparation des responsabilités
Chaque module backend porte une responsabilité métier précise :
- identité patient
- dossier anesthésique
- pré-op
- per-op
- post-op
- audit
- alertes
- rapports
- intégration

### 2.3 Dossier anesthésique comme pivot
Le **dossier anesthésique** (`AnesthesiaCase`) est l’entité pivot du système.

Tous les modules cliniques s’y rattachent :
- `preop`
- `perop`
- `postop`
- `alert`
- `report`

### 2.4 Traçabilité systématique
Les actions critiques doivent être historisées :
- création de dossier
- transitions d’état
- calcul de scores
- création d’observations
- événements per-op
- fin de session / fin de séjour

Cette traçabilité est portée par le module `audit`.

---

## 3. Stack technique

- **Backend** : Django
- **API** : Django REST Framework
- **Base de données** : PostgreSQL (cible), SQLite (dev)
- **Auth** : Django auth / JWT / OIDC (selon évolution)
- **Documentation architecture** : UML + C4 + BMAD docs

---

## 4. Modules backend

## 4.1 `patient`
Responsabilité :
- gérer l’identité patient
- servir de point d’entrée clinique

Entité principale :
- `Patient`

---

## 4.2 `casefile`
Responsabilité :
- gérer le **dossier anesthésique**
- gérer le cycle de vie du dossier

Entité principale :
- `AnesthesiaCase`

Concepts clés :
- statut du dossier
- transitions d’état
- rattachement au patient
- contexte opératoire

Statuts principaux :
- `PRE_OP`
- `PER_OP`
- `POST_OP`
- `CLOSED`

Le module `casefile` est le pivot métier du backend.

---

## 4.3 `preop`
Responsabilité :
- gérer le questionnaire pré-opératoire
- enregistrer les réponses
- calculer les scores cliniques
- préparer la validation pré-anesthésique

Entités principales :
- `PreOpQuestionnaire`
- `QuestionTemplate`
- `PreOpQuestionnaireResponse`
- `ClinicalScore`

Capacités implémentées :
- structure questionnaire
- réponses unitaires
- sauvegarde en masse (`save-responses`)
- calcul des scores
- recalcul des scores
- historisation des résultats

Scores actuellement supportés :
- DUKE
- LEE
- STOP_BANG
- APFEL
- GOLD
- CHILD_PUGH
- NYHA
- CHA2DS2_VASC
- ARISCAT
- ALDRETE (utilisé côté postop)

---

## 4.4 `perop`
Responsabilité :
- gérer le segment bloc opératoire
- démarrer / terminer une session per-op
- enregistrer les constantes
- enregistrer les événements per-op
- gérer les administrations médicamenteuses

Entités principales :
- `PerOpSession`
- `VitalSignMeasurement`
- `PerOpEvent`
- `MedicationAdministration`

Capacités implémentées :
- démarrage session per-op
- fin session per-op
- enregistrement constantes
- lecture des constantes
- enregistrement événements
- lecture des événements
- vue `summary`

---

## 4.5 `postop`
Responsabilité :
- gérer le séjour SSPI
- enregistrer les observations postopératoires
- calculer le score de sortie Aldrete
- déterminer la readiness de sortie

Entités principales :
- `PostOpStay`
- `PostOpObservation`

Capacités implémentées :
- démarrage séjour postop
- fin séjour postop
- création d’observation
- calcul Aldrete
- consultation du score Aldrete
- vue `summary`

---

## 4.6 `audit`
Responsabilité :
- tracer les actions critiques du système

Entité principale :
- `AuditLog`

Exemples d’actions tracées :
- `CREATE`
- `STATE_TRANSITION`
- `COMPUTE_SCORES`
- `SAVE_RESPONSES`
- `START_PEROP_SESSION`
- `CREATE_VITAL_MEASUREMENT`
- `CREATE_PEROP_EVENT`
- `START_POSTOP_STAY`
- `CREATE_POSTOP_OBSERVATION`

---

## 4.7 `alert` *(cible / à compléter)*
Responsabilité cible :
- détecter des anomalies
- gérer le cycle de vie des alertes
- rattacher les alertes au dossier anesthésique

États prévus :
- `ACTIVE`
- `ACKNOWLEDGED`
- `RESOLVED`

---

## 4.8 `report` *(cible / à compléter)*
Responsabilité cible :
- générer la synthèse anesthésique
- archiver les documents
- préparer les exports

---

## 4.9 `settings` *(cible / à compléter)*
Responsabilité cible :
- gérer les seuils d’alerte
- gérer les protocoles
- gérer les templates de documents

---

## 4.10 `integration` *(cible / à compléter)*
Responsabilité cible :
- gérer les échanges SIH / DPI
- préparer les intégrations FHIR / HL7 / IHE
- gérer les points d’entrée biomédicaux
- préparer les connecteurs IA

---

## 5. Flux métier global

## 5.1 Pré-op
1. Création du dossier anesthésique
2. Création du questionnaire pré-op
3. Saisie / sauvegarde des réponses
4. Calcul des scores
5. Consultation et validation par l’anesthésiste

## 5.2 Per-op
1. Transition du dossier en `PER_OP`
2. Démarrage d’une session per-op
3. Ingestion des constantes
4. Enregistrement des événements / médicaments
5. Fin de session

## 5.3 Post-op
1. Transition du dossier en `POST_OP`
2. Démarrage du séjour SSPI
3. Saisie des observations
4. Calcul du score Aldrete
5. Décision de sortie
6. Fin de séjour

---

## 6. API — principes de conception

Le backend expose une API REST organisée autour du dossier anesthésique.

### Exemples d’endpoints existants

### `casefile`
- `GET /api/cases/`
- `POST /api/cases/`
- `POST /api/cases/{id}/state/`

### `preop`
- `GET /api/preop-questionnaires/{id}/form/`
- `POST /api/preop-questionnaires/{id}/compute-scores/`
- `POST /api/preop-questionnaires/{id}/save-responses/`

### `perop`
- `GET /api/cases/{id}/perop/summary/`
- `POST /api/cases/{id}/perop/sessions/start/`
- `POST /api/cases/{id}/perop/sessions/end/`
- `GET /api/cases/{id}/perop/vitals/`
- `POST /api/cases/{id}/perop/vitals/`
- `GET /api/cases/{id}/perop/events/`
- `POST /api/cases/{id}/perop/events/`

### `postop`
- `GET /api/cases/{id}/postop/summary/`
- `POST /api/cases/{id}/postop/stay/start/`
- `POST /api/cases/{id}/postop/stay/end/`
- `GET /api/cases/{id}/postop/observations/`
- `POST /api/cases/{id}/postop/observations/`
- `GET /api/cases/{id}/postop/scores/aldrete/`

---

## 7. État actuel du backend

### Implémenté
- `patient`
- `casefile`
- `preop`
- `perop`
- `postop`
- `audit`

### Partiellement préparé / à compléter
- `alert`
- `report`
- `settings`
- `integration`

### Évolutions avancées prévues
- `interop`
- `streaming`
- `telemedicine`
- `security_compliance`
- `ai_agent`

---

## 8. Alignement documentaire

L’architecture backend actuelle est alignée avec :
- le **Product Brief**
- le **PRD**
- l’**Architecture du système**
- le **Backend Module Design**
- le **C4 Design**
- l’**UML Design**
- le **Implementation Plan**

Elle respecte en particulier :
- l’approche **monolithe modulaire**
- le rôle pivot du **dossier anesthésique**
- la séparation **pré-op / per-op / post-op**
- l’importance de l’**audit**
- l’extensibilité vers alertes, intégration et temps réel

---

## 9. Prochaines étapes recommandées

### Priorité fonctionnelle
- implémenter `alert`
- implémenter `report`
- implémenter `settings`

### Priorité technique
- ajouter un endpoint global `case full summary`
- renforcer la standardisation des erreurs API
- compléter RBAC / permissions
- ajouter des tests backend

### Priorité architecture
- finaliser les diagrammes UML
- finaliser les diagrammes C4
- ajouter documentation OpenAPI / Swagger propre

---

## 10. Résumé

Le backend DAI-BMAD est construit comme un **backend Django modulaire**, structuré autour du **dossier anesthésique** et couvrant déjà le cœur du parcours clinique :

- **pré-op**
- **per-op**
- **post-op**

Le système permet déjà :
- la collecte structurée des données
- le calcul des scores cliniques
- la traçabilité des actions
- l’historisation des observations
- la préparation du parcours complet de l’anesthésie

Cette base sert de socle au frontend, aux alertes, aux rapports et aux intégrations futures.
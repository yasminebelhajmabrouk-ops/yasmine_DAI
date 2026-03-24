---
type: implementation-plan
project: "DAI-BMAD — Dossier d’Anesthésie Intelligent"
phase: "Phase 4 — Implementation"
language: fr
created: "2026-03-24"
inputs:
  - "../phase-2-planning/prd.md"
  - "../phase-3-solutioning/architecture.md"
  - "../phase-3-solutioning/backend-module-design.md"
  - "../phase-3-solutioning/c4-design.md"
  - "../phase-3-solutioning/uml-design.md"
stack:
  frontend: "React"
  backend: "Django"
  api: "Django REST Framework"
  database: "PostgreSQL"
---

# Implementation Plan — DAI-BMAD (Phase 4)

## 1) Objectif du document
Ce document transforme les livrables de solutioning (architecture + découpage backend) en un **plan d’implémentation exécutable** : ordre de développement, jalons, conventions techniques, risques et préparation des premiers commits.

Il vise à :
- Minimiser le “time-to-first-value” (MVP utilisable) tout en sécurisant les fondations (auth, modèle de données, audit).
- Réduire les risques d’intégration (front/back/DB) en validant tôt les contrats d’API.
- Donner une séquence de travail claire et traçable (BMAD → stories → code).

## 2) Position dans BMAD
- Phase BMAD : **Phase 4 — Implementation**.
- Entrées : PRD (Phase 2) + Architecture, C4, UML, Backend module design (Phase 3).
- Sorties attendues :
  - Squelette de repo exécutable (backend Django + frontend React + DB Postgres).
  - Incréments livrables (MVP puis V1) alignés sur les priorités PRD.
  - Discipline d’exécution (stories, critères d’acceptation, revue, QA).

## 3) Stratégie générale d’implémentation
### 3.1 Approche “vertical slice” (recommandée)
Privilégier des incréments **de bout en bout** (UI → API → DB) sur un cas d’usage minimal, plutôt qu’un backend complet sans UI ou l’inverse. Cela permet :
- Validation rapide des contrats (DTO, statuts, transitions, erreurs).
- Détection précoce des écarts de compréhension (métier vs UI vs données).

### 3.2 Fondations non négociables (dès le début)
- **AuthN/AuthZ** (au moins JWT de dev) + RBAC minimal.
- **Audit** des actions critiques (append-only) dès les premières features.
- **Contrats d’API** stables (DRF serializers comme frontière).
- **Migrations** et conventions DB (PostgreSQL) posées tôt.

### 3.3 Choix d’architecture applicative
- Backend : **Django modulaire par apps** (monolithe modulaire), cohérent avec le module design.
- API : **Django REST Framework**, REST/JSON.
- Frontend : **React** (idéalement TypeScript), structuré par features (preop/perop/postop/admin).
- Données : **PostgreSQL**.

## 4) Ordre recommandé de développement
Ordre de travail (séquence de réduction de risque) :

1. **Bootstrap repo** (outillage, conventions, env, scripts) + CI minimale.
2. **Backend core** : projet Django, settings (env), app `auth`, app `audit`, healthcheck.
3. **DB core** : modèles pivot `Patient`, `AnesthesiaCase` (dossier) + migrations.
4. **API contracts** : endpoints CRUD minimal (patients / cases) + pagination + erreurs standardisées.
5. **Frontend core** : app React, routing, auth client, client HTTP, gestion erreurs.
6. **Vertical slice MVP** : créer un patient → créer un dossier → consulter le dossier.
7. **Pré‑op MVP** : questionnaire minimal + soumission + consultation des scores (même si scores simplifiés au départ).
8. **Admin MVP** : paramètres (seuils/templates) + users/roles (périmètre minimal).
9. **Per‑op / Post‑op** (après socle) : ingestion vitals / événements / SSPI.
10. **Intégrations** (en dernier) : SIH/DPI, gateway biomédical, IA — derrière une couche d’adaptation.

## 5) Plan backend Django
### 5.1 Squelette et conventions
Créer un projet Django (ex. `dai_api`) avec :
- Configuration par environnement (`.env`), séparation dev/test/prod.
- DRF installé et configuré (auth, pagination, rendu JSON, erreurs).
- Structure modulaire par apps : `auth`, `patient`, `case`, `preop`, `perop`, `postop`, `alert`, `report`, `settings`, `audit`, `integration`, `common`.

Conventions recommandées :
- `api/` (views/viewsets, serializers, permissions, urls)
- `application/` (use cases)
- `domain/` (invariants métier si isolés)
- `infrastructure/` (clients externes, adaptateurs)

### 5.2 Priorité des apps (MVP → V1)
**MVP (socle)**
- `auth` : authentification (JWT dev) + RBAC minimal.
- `audit` : écriture des événements d’audit.
- `patient` + `case` : entités pivot + CRUD.
- `common` : gestion d’erreurs, pagination, horodatage.

**V1**
- `preop` : questionnaire, réponses, scores, validation.
- `settings` : paramètres (seuils, protocoles, templates) + audit.
- `report` : génération/archivage (format de base).

**Évolutions**
- `perop`, `postop`, `alert` en extension progressive.
- `integration` (SIH, gateway, IA) via adaptateurs.

### 5.3 API : standards de design
Standards DRF à appliquer systématiquement :
- Serializer = frontière (pas d’exposition brute des modèles).
- Codes d’erreurs cohérents (validation vs métier vs technique).
- Permissions déclaratives par endpoint.
- Idempotence explicite pour certaines opérations (ex. acquittement d’alerte).

### 5.4 Sécurité
- En dev : JWT local (simple) + rotation/expiration.
- Préparer l’intégration OIDC ultérieure sans réécrire les endpoints : isoler la logique d’auth dans `auth`.
- Journaliser les actions critiques dans `audit` (création dossier, transition d’état, validation, paramétrage).

### 5.5 Observabilité
- Logs structurés (corrélation par request id).
- Endpoint healthcheck.
- Traces minimales sur appels d’intégration.

## 6) Plan frontend React
### 6.1 Squelette et conventions
Objectifs du socle frontend :
- Routing (features preop/perop/postop/admin).
- Client HTTP unique (gestion token, erreurs, corrélation).
- Gestion des états de chargement/erreur (UX “always-on” pour per‑op/SSPI plus tard).

Structure recommandée :
- `src/core/` : config, http client, auth session.
- `src/shared/` : composants UI réutilisables.
- `src/features/{preop,perop,postop,admin}/` : pages + hooks + services d’API.

### 6.2 Ordre de construction (MVP)
1. Auth (écran login minimal si nécessaire, ou mock en dev).
2. Patient : liste/recherche minimale + création.
3. Dossier : création + page détail dossier (statut, métadonnées).
4. Pré‑op : formulaire questionnaire minimal + soumission.

### 6.3 Contrat API et typage
- Générer/maintenir des types (TypeScript) alignés sur les serializers DRF.
- Stratégie recommandée : types partagés par “DTO” (request/response) par feature.

### 6.4 Performance et résilience (préparation)
- Prévoir un mode dégradé réseau (messages clairs, retry).
- Pour le per‑op : commencer par polling/SSE (selon décision) et garder l’architecture ouverte au WebSocket.

## 7) Plan base de données PostgreSQL
### 7.1 Stratégie
- Modèle relationnel normalisé (patients, dossiers, réponses, scores, mesures, événements).
- Historisation explicite des mesures (séries temporelles) et des actions (audit append-only).

### 7.2 Migrations et gestion du schéma
- Migrations Django versionnées et revues.
- Règles : pas de “migration squashing” avant stabilisation (sauf besoin).
- Indexer tôt : `patient_id`, `case_id`, `timestamp`, `alert_status`.

### 7.3 Données sensibles
- Clarifier la politique de rétention et anonymisation (si nécessaire) avant d’industrialiser.
- Séparer clairement données métier vs logs.

## 8) Plan intégration BMAD / GitHub Copilot
### 8.1 Discipline BMAD côté implémentation
- Travailler par incréments traçables : **epic → stories → PR**.
- Chaque story doit définir : scope, ACs Given/When/Then, endpoints concernés, modèles impactés.

### 8.2 Utilisation de Copilot (pratique)
- Utiliser Copilot pour : scaffolding DRF (serializers/viewsets), création de formulaires React, refactors, tests.
- Garder la vérité dans les docs : PRD/architecture = source de référence, Copilot = accélérateur, pas décideur.
- Code review systématique (sécurité, données de santé, logs/audit).

### 8.3 Artefacts attendus dans `_bmad-output/`
- Tech specs par incrément.
- Notes de décisions (ADR légers) quand un choix change la trajectoire (auth, temps réel, intégration).

## 9) Découpage par incréments (MVP, V1, évolutions)
### MVP (objectif : “dossier minimal utilisable”)
- Auth + RBAC minimal.
- CRUD Patient + Dossier anesthésique.
- Transitions d’état dossier (au moins PRE_OP → PER_OP → POST_OP → CLOSED) avec audit.
- Pré‑op minimal : questionnaire simple + soumission + stockage.
- Frontend : parcours bout-en-bout correspondant.

### V1 (objectif : “pré‑op robuste + début d’administration”)
- Pré‑op complet (scores ciblés du PRD, recalcul, validation anesthésiste).
- Paramétrage (`settings`) : seuils et templates (versioning minimal) + audit.
- Début de génération de rapport (format de base, export ultérieur).

### Évolutions
- Per‑op : ingestion vitals + événements, consultation historisée.
- Alertes : règles/seuils + cycle de vie (ack/resolved).
- Post‑op : SSPI + Aldrete.
- Intégrations : SIH/DPI, gateway biomédical, IA (progressif).

## 10) Risques d’implémentation
Risques principaux et parades :

- **Temps réel per‑op** (latence, fiabilité) → commencer MVP en polling/SSE, instrumenter, évoluer ensuite.
- **Modèle de données** (évolutivité, historisation) → poser conventions et indexes tôt, valider via slices.
- **Sécurité/RBAC** (accès données santé) → permissions strictes, audit, revue sécurité.
- **Intégrations SIH/gateway** (formats variables, disponibilité) → anti-corruption layer + mocks + retries.
- **Dette de contrat API** (UI diverge) → contract-first (DTO/serializers), tests d’API, versioning si besoin.

## 11) Préparation aux premiers commits de code
Checklist “prêt à coder” :

1. **Repo hygiene**
   - `.gitignore` présent (déjà ajouté).
   - Conventions de nommage des dossiers `backend/` et `frontend/` fixées.

2. **Bootstraps**
   - Backend : création du projet Django + DRF + healthcheck.
   - Frontend : création de l’app React + routing minimal.
   - DB : docker-compose (si retenu) ou scripts infra pour Postgres.

3. **Contrats et tests minimaux**
   - 1 endpoint “health” + 1 endpoint “patients” avec tests API.
   - 1 page UI connectée sur l’API (preuve d’intégration).

4. **Qualité et sécurité**
   - Lint/formatters (Python + JS/TS) activés.
   - Secrets hors repo (env vars), logs sans données sensibles.

5. **Traçabilité**
   - Première story “Bootstrap vertical slice” créée et associée au premier PR.

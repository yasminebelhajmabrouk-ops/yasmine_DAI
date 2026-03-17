---
type: backend-module-design
project: "DAI-BMAD — Dossier d’Anesthésie Intelligent"
phase: "Phase 3 — Solutioning"
language: fr
created: "2026-03-17"
inputs:
  - "../phase-2-planning/prd.md"
  - "./architecture.md"
  - "./uml-design.md"
  - "./c4-design.md"
---

# Backend Module Design — Phase 3 (Solutioning)

## 1) Objectif du document
Ce document décrit la **décomposition du backend Spring Boot** de DAI-BMAD en **modules métier** (monolithe modulaire), dérivés du PRD, de l’architecture, de l’UML Design et du C4 Design.

Objectifs :
- Établir une **carte des modules** (responsabilités, frontières, dépendances).
- Proposer une **structuration Java** (packages, couches) qui limite le couplage et facilite les évolutions.
- Donner une base actionnable pour l’implémentation : **entités**, **services**, **repositories**, **contrôleurs API** par module.

## 2) Position dans BMAD
- Phase BMAD : **Phase 3 — Solutioning**.
- Rôle : transformer les exigences (PRD) et les vues globales (Architecture + C4) en une décomposition backend exploitable par l’équipe de dev.
- Articulation avec les autres livrables :
  - PRD (Phase 2) : priorisation (P0/P1/P2) et exigences fonctionnelles (FR) + non fonctionnelles.
  - Architecture (Phase 3) : monolithe modulaire, sécurité, intégrations, contrats d’API indicatifs.
  - UML Design (Phase 3) : scénarios (pré‑op / per‑op / workflow) et modèle de domaine.
  - C4 Design (Phase 3) : contexte + conteneurs (Frontend, API, DB, Gateway, SIH, Auth, IA).

## 3) Principes de structuration du backend
### 3.1 Style d’architecture retenu
- **Monolithe modulaire** (première étape) : un seul déploiement Spring Boot, avec des frontières de modules explicites.
- **API REST** centrale (contrats alignés sur l’architecture), échanges JSON.
- **PostgreSQL** comme persistance principale, avec historisation (mesures) et audit.

### 3.2 Organisation interne par couches (par module)
Pour limiter le couplage, chaque module suit une structure cohérente :
- **api** : contrôleurs REST, DTO (request/response), mapping, validation des entrées.
- **application** : cas d’usage (services applicatifs), orchestration transactionnelle, règles de workflow.
- **domain** : modèle métier (entités, value objects, invariants), événements métier (si retenus).
- **infrastructure** : adaptateurs techniques (JPA repositories, clients SIH/IA, intégration gateway, stockage document, etc.).

### 3.3 Règles de dépendances (anti-couplage)
- Les modules “métier” (pré‑op, per‑op, post‑op…) **dépendent** du noyau dossier (case) et du patient.
- Le module **audit** est transversal (appelé par les autres modules), mais **ne dépend pas** d’eux.
- Le module **integration** expose des interfaces/clients ; il ne porte pas de logique métier du dossier.
- Le module **auth** (Spring Security, RBAC) est transversal pour la couche API ; la logique métier ne “connaît” l’utilisateur qu’au travers d’un contexte minimal (ex. `currentUserId`).

### 3.4 Conventions techniques recommandées
- Transactions : limites au niveau **application**, granularité par cas d’usage.
- DTO vs Domain : pas d’exposition directe d’entités JPA dans l’API.
- Validation : Bean Validation sur DTO + vérifications métier dans domain/application.
- Audit : journaliser les actions critiques (création dossier, transitions d’état, validation, acquittement alerte, génération document, changements paramètres).
- Intégrations : pattern **anti-corruption layer** (mapping et contrôle d’erreurs) pour SIH, IA, biomédical.

## 4) Liste des modules backend
La liste ci-dessous est alignée sur l’architecture (modules métier principaux) et complète les besoins d’administration/paramétrage.

| Module | Finalité | Couverture principale (PRD / Architecture / UML) |
|---|---|---|
| auth | Authn/Authz, RBAC, users/roles | FR-21..FR-22 + sécurité | 
| patient | Identité patient + accès patient | FR-01..FR-04 (partiel) + intégration SIH |
| case | Dossier anesthésique, états/transitions | FR-01..FR-03, workflow UML |
| preop | Questionnaire, réponses, scores, validation | FR-05..FR-09, séquence pré‑op UML |
| perop | Session bloc, vitals, événements, historisation | FR-10..FR-13, séquence per‑op UML |
| postop | SSPI, douleur, score Aldrete | FR-15..FR-16 |
| alert | Cycle de vie alertes et règles | FR-09 / FR-14 + per‑op (P1) |
| report | Synthèse anesthésique, documents/export | FR-18..FR-20 |
| settings | Paramètres (seuils, protocoles, templates) | FR-23 |
| audit | Audit actions critiques (append-only) | NFR / sécurité + FR transverses |
| integration | SIH/DPI, services IA, gateway biomédical | intégrations (à préciser) |
| common (support) | erreurs, types partagés, pagination, temps | support technique |

## 5) Responsabilités de chaque module
### auth
- Authentification (JWT initial ou OIDC) et application des rôles.
- Gestion des utilisateurs et rôles (admin IT) selon le périmètre retenu.

### patient
- Gestion de l’identité patient (création interne si non fournie par SIH, ou lecture via intégration).
- Accès à l’historique des dossiers anesthésiques d’un patient.

### case
- Création/consultation/mise à jour du dossier anesthésique.
- Gestion des statuts (`PRE_OP`, `PER_OP`, `POST_OP`, `CLOSED`) et transitions (auditées).

### preop
- Gestion du questionnaire (structure/état), enregistrement des réponses.
- Calcul et historisation des scores (ASA, RCRI, Apfel, Mallampati), puis validation/correction.

### perop
- Démarrage/fin de session per‑op.
- Ingestion et historisation des constantes (time-series), saisie événements/médicaments.

### postop
- Observations SSPI, douleur, score Aldrete (calcul + historisation).

### alert
- Création et gestion du cycle de vie des alertes (ACTIVE → ACK → RESOLVED).
- Évaluation de règles/seuils (en lien avec settings) et exposition à l’UI.

### report
- Génération et archivage de la synthèse anesthésique.
- Accès aux documents, export PDF/format établissement (selon décision).

### settings
- Paramétrage des seuils d’alerte, protocoles, modèles de documents.
- Versioning minimal et audit des changements.

### audit
- Écriture et consultation interne du journal d’audit.
- Normalisation des événements d’audit (action, entité, acteur, horodatage, corrélation).

### integration
- Adaptateurs SIH/DPI (identité patient, documents), IA (scoring/recommandations), biomédical (gateway).
- Mapping, retries, gestion d’erreurs, journalisation technique.

## 6) Relations entre modules
### 6.1 Dépendances fonctionnelles (résumé)
- `case` est le **pivot** : `preop`, `perop`, `postop`, `alert`, `report` s’attachent à un dossier.
- `patient` est requis pour `case` (un dossier est rattaché à un patient).
- `preop` produit des `ClinicalScore` et peut créer des “points d’attention” consommés par `alert`.
- `perop` produit mesures/événements et peut déclencher `alert`.
- `postop` produit `ClinicalScore(ALDRETE)`.
- `settings` configure `alert` (seuils/règles), `report` (templates) et éventuellement `preop` (versions de questionnaire).
- `integration` fournit des clients : `preop` (IA scoring), `patient` (SIH), `perop` (gateway biomédical), `report` (export SIH).
- `audit` est transversal et appelé par tous.

### 6.2 Dépendances techniques (règles)
- La couche `api` dépend de `application`.
- `application` dépend de `domain` et d’interfaces d’accès (ports) déclarées dans le module.
- `infrastructure` implémente ces ports (JPA/clients externes).
- Éviter les “imports croisés” de `domain` entre modules : préférer des IDs (`patientId`, `caseId`) et des services de lecture.

## 7) Packages Java recommandés
Le code n’étant pas encore présent dans ce workspace, le package racine est **à confirmer** (choix recommandé ci-dessous).

Recommandation (à ajuster à votre `groupId`) :
- Racine : `com.dai.api`

Structure :
- `com.dai.bmad.config` (Spring Security, OpenAPI, Jackson, persistence, etc.)
- `com.dai.bmad.common` (erreurs, types, utilitaires, time, pagination, security-context)
- `com.dai.bmad.auth.{api,application,domain,infrastructure}`
- `com.dai.bmad.patient.{api,application,domain,infrastructure}`
- `com.dai.bmad.casefile.{api,application,domain,infrastructure}`
- `com.dai.bmad.preop.{api,application,domain,infrastructure}`
- `com.dai.bmad.perop.{api,application,domain,infrastructure}`
- `com.dai.bmad.postop.{api,application,domain,infrastructure}`
- `com.dai.bmad.alert.{api,application,domain,infrastructure}`
- `com.dai.bmad.report.{api,application,domain,infrastructure}`
- `com.dai.bmad.settings.{api,application,domain,infrastructure}`
- `com.dai.bmad.audit.{api,application,domain,infrastructure}` (API facultative)
- `com.dai.bmad.integration.{application,infrastructure}` (clients externes, anti-corruption layer)

Note : le terme `casefile` évite le mot-clé Java `case`.

## 8) Entités principales par module
## 9) Services principaux par module
## 10) Repositories principaux par module
## 11) Contrôleurs API principaux par module
Les éléments ci-dessous sont listés de façon **indicative** et alignée avec :
- le modèle UML (entités et statuts),
- la proposition de tables Postgres (architecture),
- les routes API exemples (architecture).

### 11.1 auth
- Entités : `User`, `Role`, (évent.) `UserRole`
- Services : `UserService`, `RoleService`, `AuthorizationService` (RBAC), `TokenValidationService` (JWT/OIDC)
- Repositories : `UserRepository`, `RoleRepository`, `UserRoleRepository`
- Contrôleurs :
  - `GET /users`, `POST /users`
  - `GET /roles`
  - `PUT /users/{id}/roles`

### 11.2 patient
- Entités : `Patient`
- Services : `PatientService` (CRUD), `PatientHistoryService` (lecture dossiers)
- Repositories : `PatientRepository`
- Contrôleurs :
  - `POST /patients` (si création interne)
  - `GET /patients/{id}`
  - `GET /patients/{id}/cases`

### 11.3 case (dossier anesthésique)
- Entités : `AnesthesiaCase`, `CaseStatus`
- Services : `CaseService` (CRUD), `CaseStateTransitionService` (transitions + audit)
- Repositories : `AnesthesiaCaseRepository`
- Contrôleurs :
  - `POST /cases`, `GET /cases/{id}`, `PATCH /cases/{id}`
  - `POST /cases/{id}/state`

### 11.4 preop
- Entités : `PreOpQuestionnaire`, `QuestionnaireResponse`, `ClinicalScore`, `ValidationStatus`, `ScoreType`
- Services :
  - `QuestionnaireService` (structure/état)
  - `QuestionnaireSubmissionService` (soumission réponses)
  - `ScoringService` (calcul scores ; appelle `integration` si IA externe)
  - `PreOpValidationService` (validation/correction + audit)
- Repositories : `PreOpQuestionnaireRepository`, `QuestionnaireResponseRepository`, `ClinicalScoreRepository`
- Contrôleurs :
  - `GET /cases/{id}/preop/questionnaire`
  - `POST /cases/{id}/preop/questionnaire/submission`
  - `GET /cases/{id}/preop/scores`
  - `POST /cases/{id}/preop/scores/recompute`
  - `POST /cases/{id}/preop/validation`

### 11.5 perop
- Entités : `PerOpSession`, `VitalSignMeasurement`, `Event`, `MedicationAdministration`, `EventType`
- Services :
  - `PerOpSessionService` (start/end)
  - `VitalsIngestionService` (ingestion + historisation)
  - `PerOpSummaryService` (données écran per‑op)
  - `EventService` (événements + médicaments)
- Repositories : `PerOpSessionRepository`, `VitalSignMeasurementRepository`, `EventRepository`, `MedicationAdministrationRepository`
- Contrôleurs :
  - `GET /cases/{id}/perop/summary`
  - `POST /cases/{id}/perop/sessions/start`
  - `POST /cases/{id}/perop/sessions/end`
  - `POST /cases/{id}/perop/vitals` (gateway → backend)
  - `GET /cases/{id}/perop/vitals`
  - `POST /cases/{id}/perop/events`
  - `GET /cases/{id}/perop/events`

### 11.6 postop
- Entités : `PostOpStay`, `ClinicalScore` (type = `ALDRETE`)
- Services : `PostOpObservationService`, `AldreteScoringService`
- Repositories : `PostOpStayRepository`, `ClinicalScoreRepository`
- Contrôleurs :
  - `GET /cases/{id}/postop/observations`
  - `POST /cases/{id}/postop/observations`
  - `GET /cases/{id}/postop/scores/aldrete`

### 11.7 alert
- Entités : `Alert`, `AlertStatus`, `AlertType`, `Severity`
- Services :
  - `AlertQueryService` (listing)
  - `AlertLifecycleService` (ack/resolve + audit)
  - `AlertEvaluationService` (évaluation règles/seuils ; intégration `settings`)
- Repositories : `AlertRepository`
- Contrôleurs :
  - `GET /cases/{id}/alerts`
  - `POST /alerts/{id}/ack`
  - `POST /alerts/{id}/resolve`

### 11.8 report
- Entités : `AnesthesiaReport` et/ou `Document` (selon modélisation retenue), métadonnées export
- Services : `ReportGenerationService`, `DocumentService`, `DocumentExportService`
- Repositories : `DocumentRepository`
- Contrôleurs :
  - `POST /cases/{id}/documents/anesthesia-report`
  - `GET /cases/{id}/documents`
  - `GET /documents/{id}`
  - `GET /documents/{id}/export`

### 11.9 settings
- Entités : `Setting` (clé/valeur) et/ou objets typés (`AlertThresholds`, `Protocol`, `DocumentTemplate`)
- Services : `SettingsQueryService`, `SettingsUpdateService` (avec audit)
- Repositories : `SettingsRepository`
- Contrôleurs :
  - `GET /settings`
  - `PUT /settings/alert-thresholds`
  - `PUT /settings/protocols`
  - `PUT /settings/document-templates`

### 11.10 audit
- Entités : `AuditLog`
- Services : `AuditService` (append-only), `AuditContextService` (corrélation)
- Repositories : `AuditLogRepository`
- Contrôleurs : (facultatif) lecture admin/support, selon exigences de sécurité.

### 11.11 integration
- Entités : principalement des DTO d’intégration (SIH, IA, biomédical)
- Services : `SihClient`, `AiScoringClient`, `DeviceGatewayAdapter`, `IntegrationFacade`
- Repositories : aucun (sauf table de mapping/état si requis)
- Contrôleurs : selon choix d’intégration (webhooks, endpoints internes), à préciser.

## 12) Préparation à l’implémentation
### 12.1 Décisions à verrouiller avant code
- Auth : JWT MVP vs OIDC/SSO, stratégie MFA, cycle de vie des tokens.
- Temps réel per‑op : polling vs SSE pour MVP ; conditions de passage WebSocket.
- Intégration SIH : REST/HL7/FHIR, schéma d’identité, règles de synchronisation.
- Biomédical : protocole source, mapping device → patient/case, gestion de la déconnexion.
- Documents : format, stockage, export (et contraintes établissement).

### 12.2 Ordre de livraison recommandé (P0 → P1)
- P0 : `auth`, `patient`, `case`, `preop`, `perop`, `postop`, `report`, `audit`.
- P1 : `alert` (règles avancées + cycle de vie), `settings` (paramétrage complet), intégrations SIH plus larges.

### 12.3 Outillage et garde-fous
- Spécification OpenAPI dès le début (contrat FE↔BE et GW↔BE).
- Migrations DB (Flyway/Liquibase) : tables patient/case/preop/perop/postop/alerts/documents/settings/audit.
- Tests :
  - tests d’acceptation sur les flux PRD (Given/When/Then),
  - tests de cycle de vie alertes,
  - tests de transitions d’état du dossier.
- Qualité : règles d’architecture (ex. ArchUnit) pour contrôler les dépendances entre modules.

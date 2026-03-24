---
type: architecture
project: "DAI-BMAD — Dossier d’Anesthésie Intelligent"
phase: "Phase 3 — Solutioning"
language: fr
created: "2026-03-16"
inputs:
  - "../phase-1-analysis/project-brief.md"
  - "../phase-2-planning/prd.md"
  - "DAI-Project/docs/04-architecture/l4-architecture-overview.md (référence historique)"
  - "DAI-Project/diagrams/c4/*.puml (C4)"
  - "DAI-Project/diagrams/uml/source/*.puml (UML)"
- Phase : Solutioning
- Entrées : Product Brief (Phase 1), PRD (Phase 2), UML historique, C4 historique
- Sorties : architecture cible, modules système, contrats d’API, base des diagrammes C4 et de l’implémentation
- Agent BMAD principal : Architect
---

# Architecture du système — DAI-BMAD

Ce document d’architecture consolide la cible technique à partir du Product Brief (Phase 1) et du PRD (Phase 2). Il formalise la vue globale, la décomposition en modules, les flux principaux, la sécurité et les intégrations.

## 1) Vue d’architecture globale
### 1.1 Principes
- Séparation stricte **Frontend / Backend**.
- **API REST** centrale et contractuelle.
- Données **structurées** et **auditées** (traçabilité “qui/quoi/quand”).
- Architecture **modulaire** (questionnaire, scoring, per‑op, post‑op, alertes, audit, intégration).
- Extensibilité : intégrations SIH/DPI et dispositifs biomédicaux, services IA (progressif).

### 1.2 Composants (niveau système)
- **Frontend React** : UI pré‑op, per‑op, post‑op, administration.
- **Backend Django** : logique métier, sécurité, audit, alertes, API.
- **PostgreSQL** : persistance des dossiers, questionnaires, scores, constantes, événements, alertes, audit.
- **Device Gateway** : adaptateur d’intégration biomédicale.
- **Systèmes externes** : SIH/DPI, service d’authentification, services IA.

## 2) Architecture frontend (React)
### 2.1 Découpage applicatif
- **Core** : bootstrap, configuration, client HTTP (auth, corrélation), gestion erreurs.
- **Auth** : login/SSO (selon stratégie), gestion session/token.
- **Shared UI** : composants réutilisables (formulaires, tableaux, timelines, badges d’état).
- **Features** (par domaine métier) :
  - **preop** : questionnaire patient, scores, validation anesthésiste.
  - **perop** : monitoring (constantes), événements, alertes.
  - **postop** : SSPI, douleur, Aldrete.
  - **admin** : utilisateurs/rôles, paramètres (seuils, protocoles, modèles).

### 2.2 Stratégie de données
- Appels **REST/JSON** au backend.
- Rafraîchissement per‑op :
  - MVP : polling (intervalle à définir) ou SSE.
  - Évolutions : WebSocket (temps réel avancé).

### 2.3 UX critique (contexte bloc/SSPI)
- Écrans per‑op/SSPI “always‑on” : priorité à la continuité d’affichage, gestion des erreurs réseau (mode dégradé).
- Affichage état du flux biomédical (connecté/dégradé/absent) + notifications.

## 3) Architecture backend (Django)
### 3.1 Style d’architecture
- **Backend Django modulaire par apps** (au départ, monolithe modulaire) : un seul déploiement, frontières par apps explicites, API REST unique.
- Couche **Application** (use cases), **Domain** (métier), **Infrastructure** (DB, intégrations).

### 3.2 Modules backend (composants)
Référence (C4 Component) alignée avec le périmètre PRD :
- **Authentication module** : authentification Django, JWT et/ou OIDC, RBAC.
- **Patient module** : identité patient + dossier anesthésie.
- **Pre‑op module** : questionnaire, réponses, calcul scores, validation.
- **Per‑op module** : session bloc, constantes, événements/médicaments.
- **Post‑op module** : SSPI, douleur, score Aldrete.
- **Alert module** : règles/seuils, cycle de vie (active → ack → resolved).
- **Report module** : génération de synthèse anesthésique + archivage.
- **Audit module** : journalisation actions critiques.
- **Integration module** : SIH/DPI, services IA, device gateway.
- **Persistence layer** : ORM Django, transactions.

### 3.3 Contrats d’API (exemples)
- `POST /patients` : création patient (si non fourni par SIH/DPI).
- `GET /patients/{id}` : consultation patient.
- `GET /patients/{id}/cases` : historique dossiers anesthésiques d’un patient (FR-04).

- `POST /cases` : création dossier anesthésie (FR-01).
- `GET /cases/{id}` : consultation dossier.
- `PATCH /cases/{id}` : mise à jour (métadonnées, champs dossier).
- `POST /cases/{id}/state` : transition d’état (pré‑op → per‑op → post‑op → clos) avec audit (FR-02/FR-03).

- `GET /cases/{id}/preop/questionnaire` : récupérer structure/état du questionnaire.
- `POST /cases/{id}/preop/questionnaire/submission` : soumission réponses (FR-05/FR-06).
- `GET /cases/{id}/preop/scores` : consultation des scores.
- `POST /cases/{id}/preop/scores/recompute` : recalcul scores après correction (FR-07).
- `POST /cases/{id}/preop/validation` : validation/correction (FR-08).

- `GET /cases/{id}/perop/summary` : données nécessaires écran per‑op (FR-10).
- `POST /cases/{id}/perop/sessions/start` : démarrage session per‑op.
- `POST /cases/{id}/perop/sessions/end` : fin session per‑op.
- `POST /cases/{id}/perop/vitals` : ingestion constantes (gateway → backend) (FR-11).
- `GET /cases/{id}/perop/vitals` : consultation a posteriori (FR-13).
- `POST /cases/{id}/perop/events` : saisie événements (FR-12).
- `GET /cases/{id}/perop/events` : consultation événements (FR-13).

- `GET /cases/{id}/alerts` : lister alertes (pré‑op/per‑op/post‑op) (FR-09/FR-14).
- `POST /alerts/{id}/ack` : acquittement (FR-14).
- `POST /alerts/{id}/resolve` : résolution (optionnel selon workflow).

- `GET /cases/{id}/postop/observations` : consultation suivi SSPI.
- `POST /cases/{id}/postop/observations` : observations SSPI (FR-15).
- `GET /cases/{id}/postop/scores/alldrete` : score Aldrete historisé (FR-16).

- `POST /cases/{id}/documents/anesthesia-report` : générer synthèse (FR-18).
- `GET /cases/{id}/documents` : consulter documents (FR-20).
- `GET /documents/{id}` : récupérer métadonnées.
- `GET /documents/{id}/export` : export PDF/format établissement (FR-19).

- `GET /users` / `POST /users` : gestion des utilisateurs (admin).
- `GET /roles` : référentiel rôles.
- `PUT /users/{id}/roles` : affectation rôles (FR-21).

- `GET /settings` : lecture paramètres.
- `PUT /settings/alert-thresholds` : seuils/règles alertes (FR-23).
- `PUT /settings/protocols` : protocoles.
- `PUT /settings/document-templates` : modèles de documents.

(NB : Les routes exactes seront alignées au design API détaillé lors de l’implémentation.)

## 3.4 Modules métier principaux
- patient
- anesthesia-case
- questionnaire
- scoring
- perop
- postop
- alert
- report
- audit
- integration

## 4) Architecture base de données (PostgreSQL)
### 4.1 Principes
- Données normalisées, historisation des mesures et événements.
- Audit “append‑only” autant que possible (journal immuable).
- Indexation sur : `case_id`, `timestamp`, `patient_id`, `alert_status`.

### 4.2 Tables (proposition)
- `patients` : identité.
- `anesthesia_cases` : dossier anesthésie + statut + contexte opératoire.
- `preop_questionnaires` : métadonnées (soumis/validé).
- `questionnaire_responses` : `question_code`, `value`, `recorded_at`, `language`, `version` (ou mécanisme équivalent).
- `clinical_scores` : type, valeur, détails (JSON), computed_at.
- `perop_sessions` : start/end.
- `vital_sign_measurements` : mesures horodatées (FC, TA, SpO2, EtCO2, …).
- `events` : type (médication/procédure/incident/technique) + description.
- `medication_administrations` : détails médicaments.
- `alerts` : type, sévérité, statut, raised_at, ack_at, ack_comment.
- `postop_stays` : SSPI + douleur + périodes.
- `documents` : synthèses (format, emplacement, hash/metadata).
- `users` : identité.
- `roles` : rôles (anesthésiste, IADE, SSPI, admin, …).
- `user_roles` : association user↔role (si multi‑rôles).
- `settings` : paramètres (seuils, protocoles, modèles) (FR-23).
- `audit_logs` : action, entité, qui/quand, contexte.

### 4.3 Modèle domaine (référence UML)
Le modèle de classes UML existant (Patient, AnesthesiaCase, PreOpQuestionnaire, PerOpSession, VitalSignMeasurement, Alert, AuditLog, etc.) guide la structure relationnelle.

## 5) Modules du système (vue fonctionnelle)
- **Pré‑op** : questionnaire patient FR/AR, calcul scores, validation anesthésiste.
- **Per‑op** : monitoring constantes + événements, alertes (P1).
- **Post‑op** : SSPI, Aldrete, synthèse.
- **Documents** : génération + archivage.
- **Administration** : RBAC, paramètres (seuils, protocoles), audit.
- **Intégrations** : SIH/DPI, biomédical, IA.

## 6) Flux principaux (pré‑op, per‑op, post‑op)
### 6.1 Flux Pré‑op (questionnaire → scores → validation)
- Le patient accède au questionnaire (FR/AR), soumet les réponses.
- Le backend calcule les scores (ASA, RCRI/Lee, Apfel, Mallampati) et enregistre réponses + scores.
- L’anesthésiste consulte, corrige et valide (statut + audit).

### 6.2 Flux Per‑op (session → constantes → règles/alertes → événements)
- Démarrage session per‑op.
- Réception des constantes via gateway : persistance horodatée.
- Évaluation règles/seuils : création alerte (P1), notification UI, acquittement et audit.
- Saisie des événements et administrations de médicaments.
- Fin de session.

### 6.3 Flux Post‑op (SSPI → Aldrete → synthèse)
- Saisie/collecte des observations SSPI, douleur.
- Calcul score de sortie (Aldrete).
- Génération/archivage du rapport anesthésique.

## 7) Architecture de sécurité
### 7.1 Objectifs
- Empêcher l’accès non autorisé (authn/authz).
- Garantir la confidentialité en transit (TLS) et la traçabilité (audit).
- Appliquer la séparation des rôles (anesthésiste, IADE, SSPI, admin).

### 7.2 Mécanismes
- **TLS** entre navigateur et API.
- **Authentification** : JWT en phase initiale, ou OIDC si service d’authentification externe.
- **Autorisation RBAC** : règles par endpoints et opérations (ex. validation réservée anesthésiste).
- **Audit** : journalisation des actions critiques (création dossier, validation, acquittement alerte, génération document, changements paramètres).
- **Gestion de session** : expiration, rotation, révocation (selon politique).

### 7.3 Points à verrouiller
- Stratégie SSO/MFA et exigences de conservation des audits.
- Gestion des accès patient (process et sécurité).

## 8) Architecture d’intégration (SIH, dispositifs biomédicaux)
### 8.1 Intégration SIH / DPI
- Objectif : identité patient, admissions, éventuellement documents.
- Interfaces : REST et/ou standards hospitaliers (HL7/FHIR) **à préciser**.
- Approche : intégration via `Integration module` (anti‑corruption layer), mapping et journalisation.

### 8.2 Intégration dispositifs biomédicaux
- Les dispositifs envoient les constantes via un **Device Gateway**.
- Le gateway normalise et transmet au backend.
- Résilience : détection déconnexion, événement technique, affichage warning UI.

### 8.3 Services IA
- MVP : moteur de scoring (interne ou service externe) appelé via API.
- Évolutions : détection anomalies avancée, recommandations — sous gouvernance clinique.

## 9) Diagrammes C4 (Context / Container)

### 9.1 C4 — System Context
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

title DAI — C4 System Context Diagram

Person(patient, "Patient", "Remplit le questionnaire pré-opératoire")
Person(anesthesiste, "Anesthésiste", "Valide les informations cliniques et prend les décisions")
Person(iade, "IADE", "Suit le patient au bloc et enregistre les événements")
Person(sspi, "Équipe SSPI", "Assure le suivi post-opératoire")
Person(admin, "Administrateur IT", "Gère les utilisateurs, rôles et paramètres")

System(dai, "DAI", "Dossier d’Anesthésie Intelligent couvrant le parcours pré-op, per-op et post-op")

System_Ext(sih, "SIH / DPI", "Système d'information hospitalier / dossier patient informatisé")
System_Ext(devices, "Dispositifs biomédicaux", "Moniteurs et équipements envoyant les constantes vitales")
System_Ext(ai, "Services IA", "Calcul de scores, détection d’anomalies, assistance")
System_Ext(auth, "Service d’authentification", "Gestion des identités et accès")

Rel(patient, dai, "Remplit le questionnaire pré-op")
Rel(anesthesiste, dai, "Consulte, valide, décide")
Rel(iade, dai, "Suit le per-op, saisit médicaments et événements")
Rel(sspi, dai, "Suit le post-op et évalue la sortie")
Rel(admin, dai, "Administre la plateforme")

Rel(dai, sih, "Lit / échange données patient et documents", "REST / HL7 / FHIR (à préciser)")
Rel(devices, dai, "Envoie constantes vitales", "Gateway / protocole biomédical")
Rel(dai, ai, "Appelle services d’aide à la décision", "API")
Rel(dai, auth, "Authentifie les utilisateurs", "OIDC / JWT")

@enduml
```

### 9.2 C4 — Container Diagram
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

title DAI — C4 Container Diagram

Person(patient, "Patient", "Remplit le questionnaire pré-opératoire")
Person(anesthesiste, "Anesthésiste", "Valide les données cliniques")
Person(iade, "IADE", "Suit le patient au bloc")
Person(sspi, "Équipe SSPI", "Suit le patient en post-op")
Person(admin, "Administrateur IT", "Gère la plateforme")

System_Ext(sih, "SIH / DPI", "Système hospitalier")
System_Ext(devices, "Dispositifs biomédicaux", "Moniteurs / équipements")
System_Ext(ai, "Service IA", "Scores et assistance décisionnelle")
System_Ext(auth, "Auth Service", "OIDC / JWT")

System_Boundary(dai, "DAI") {
  Container(frontend, "Frontend Web", "React", "Interface utilisateur web pour pré-op, per-op, post-op et administration")
  
  Container(api, "Backend API", "Django REST Framework", "Expose les API REST, applique la logique métier, gère sécurité, alertes et audit")

  ContainerDb(db, "Database", "PostgreSQL", "Stocke patients, dossiers anesthésie, scores, constantes, événements, alertes et audit")

  Container(gateway, "Device Gateway", "Adapter / Integration Layer", "Reçoit les constantes biomédicales et les transmet au backend")
}

Rel(patient, frontend, "Utilise", "HTTPS")
Rel(anesthesiste, frontend, "Utilise", "HTTPS")
Rel(iade, frontend, "Utilise", "HTTPS")
Rel(sspi, frontend, "Utilise", "HTTPS")
Rel(admin, frontend, "Utilise", "HTTPS")

Rel(frontend, api, "Appelle", "REST / JSON")
Rel(api, db, "Lit / écrit", "SQL")
Rel(gateway, api, "Envoie données biomédicales", "REST / messaging")
Rel(api, ai, "Appelle le calcul de scores / recommandations", "REST")
Rel(api, auth, "Valide authentification / tokens", "OIDC / JWT")
Rel(api, sih, "Échange données patient / documents", "REST / HL7 / FHIR")
Rel(devices, gateway, "Envoie constantes", "Protocole biomédical")

@enduml
```

## 10) Choix technologiques
### 10.1 Stack retenue (ADR)
- **Frontend** : React.
- **Backend** : Django.
- **Base de données** : PostgreSQL.
- **API** : Django REST Framework (REST).
- **Sécurité** : authentification Django + JWT et/ou OIDC selon le contexte (SSO/MFA selon politique).
- **Temps réel** : à prévoir ultérieurement si nécessaire.

### 10.2 Rationnel
- React : structuration adaptée aux applications complexes.
- Django : socle robuste pour API sécurisées et modulaires.
- PostgreSQL : stabilité et cohérence transactionnelle pour le cœur métier.

---

## Annexes

### A) Références UML (pour les flux)
Les diagrammes UML (séquence pré‑op / per‑op, activity workflow, class domain model) existent en PlantUML côté sources projet et guident la mise en œuvre des flux et des modèles de données.

### B) Traçabilité PRD → Architecture (FR → modules / API / données)
Table de correspondance indicative (cible) entre les exigences fonctionnelles du PRD et les éléments d’architecture. Les chemins API et le schéma physique seront figés lors du design détaillé.

| FR | Cible (résumé) | Modules | API (indicatif) | Données (tables indicatives) |
|---|---|---|---|---|
| FR-01 | Créer/consulter/MAJ dossier | Patient, Audit, Persistence | `POST /cases`, `GET /cases/{id}`, `PATCH /cases/{id}` | `anesthesia_cases`, `patients`, `audit_logs` |
| FR-02 | Couvrir pré/per/post + état | Case/Workflow, Audit | `GET /cases/{id}`, `POST /cases/{id}/state` | `anesthesia_cases`, `audit_logs` |
| FR-03 | Transitions contraintes + trace | Case/Workflow, Audit | `POST /cases/{id}/state` | `anesthesia_cases`, `audit_logs` |
| FR-04 | Historique anesthésique patient | Patient | `GET /patients/{id}/cases` | `anesthesia_cases` |
| FR-05 | Questionnaire patient numérique | Pre‑op, Audit | `GET /cases/{id}/preop/questionnaire`, `POST /cases/{id}/preop/questionnaire/submission` | `preop_questionnaires`, `questionnaire_responses`, `audit_logs` |
| FR-06 | Sections minimales questionnaire | Pre‑op | `GET /cases/{id}/preop/questionnaire` | `preop_questionnaires`, `questionnaire_responses` |
| FR-07 | Calcul scores + recalcul | Pre‑op, Integration (IA), Persistence | `GET /cases/{id}/preop/scores`, `POST /cases/{id}/preop/scores/recompute` | `clinical_scores`, `questionnaire_responses` |
| FR-08 | Validation/corrections | Pre‑op, Audit | `POST /cases/{id}/preop/validation` | `preop_questionnaires`, `questionnaire_responses`, `audit_logs` |
| FR-09 | Alertes “attention clinique” | Alert, Pre‑op | `GET /cases/{id}/alerts` | `alerts` |
| FR-10 | Écran per‑op (données) | Per‑op | `GET /cases/{id}/perop/summary` | `perop_sessions`, `vital_sign_measurements`, `events`, `alerts` |
| FR-11 | Collecte constantes via devices | Per‑op, Integration (Gateway) | `POST /cases/{id}/perop/vitals` | `vital_sign_measurements` |
| FR-12 | Saisie événements + médicaments | Per‑op, Audit | `POST /cases/{id}/perop/events` | `events`, `medication_administrations`, `audit_logs` |
| FR-13 | Historique horodaté consultable | Per‑op | `GET /cases/{id}/perop/vitals`, `GET /cases/{id}/perop/events` | `vital_sign_measurements`, `events`, `medication_administrations` |
| FR-14 | Alertes per‑op (active/ack/resolved) | Alert, Audit | `GET /cases/{id}/alerts`, `POST /alerts/{id}/ack`, `POST /alerts/{id}/resolve` | `alerts`, `audit_logs` |
| FR-15 | Suivi SSPI | Post‑op, Audit | `GET /cases/{id}/postop/observations`, `POST /cases/{id}/postop/observations` | `postop_stays`, `audit_logs` |
| FR-16 | Score Aldrete calculé + historisé | Post‑op | `GET /cases/{id}/postop/scores/aldrete` | `clinical_scores` (type=ALDRETE) |
| FR-17 | Protocoles/recommandations (gouvernance) | Post‑op, Integration (optionnel) | `GET /cases/{id}/postop/recommendations` (à confirmer) | (extension P1) `settings` / tables dédiées (à définir) |
| FR-18 | Génération synthèse anesthésique | Report, Audit | `POST /cases/{id}/documents/anesthesia-report` | `documents`, `audit_logs` |
| FR-19 | Export PDF/format établissement | Report | `GET /documents/{id}/export` | `documents` |
| FR-20 | Archivage/consultation documents | Report | `GET /cases/{id}/documents`, `GET /documents/{id}` | `documents` |
| FR-21 | Rôles utilisateurs | Authentication | `GET /roles`, `PUT /users/{id}/roles` | `users`, `roles`, `user_roles` |
| FR-22 | RBAC appliqué | Authentication | (transversal) contrôles sur endpoints | `users`, `roles`, `user_roles` |
| FR-23 | Paramétrage (seuils, protocoles, modèles) | Alert, Report, Admin | `GET /settings`, `PUT /settings/alert-thresholds`, `PUT /settings/protocols`, `PUT /settings/document-templates` | `settings`, `audit_logs` |


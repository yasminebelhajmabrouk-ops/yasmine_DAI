---
type: pid
project: "DAI-BMAD — Dossier d'Anesthésie Intelligent"
phase: "Phase 1 — Analysis & Discovery"
language: fr
created: "2026-03-16"
updated: "2026-04-15"
inputs:
  - "./project-brief.md"
  - "../phase-2-planning/prd.md"
  - "../phase-3-solutioning/architecture.md"
  - "../phase-3-solutioning/backend-module-design.md"
  - "../phase-3-solutioning/c4-design.md"
  - "../phase-3-solutioning/uml-design.md"
  - "../phase-3-solutioning/security-and-compliance.md"
  - "../phase-3-solutioning/interoperability-and-standards.md"
  - "../phase-3-solutioning/realtime-and-streaming.md"
  - "../phase-3-solutioning/telemedicine-design.md"
  - "../phase-3-solutioning/ai-and-mcp-integration.md"
  - "../phase-3-solutioning/advanced-architecture-alignment.md"
  - "../phase-4-implementation/implementation-plan.md"
  - "../client-assets/Architecture DMI Anesthésie Hybride (1).docx"
  - "../07-bmad-method/advanced-support-alignment.md"
---

# PID — Document d'Initialisation du Projet

## DAI-BMAD — Dossier d'Anesthésie Intelligent

---

## 1) Identification du projet

| Élément | Détail |
|---|---|
| **Nom du projet** | DAI-BMAD — Dossier d'Anesthésie Intelligent |
| **Code projet** | DAI-BMAD |
| **Date de création** | 16 mars 2026 |
| **Domaine** | Santé / Anesthésie — Parcours périopératoire |
| **Contexte** | Hôpital / Santé publique |
| **Référence client** | Architecture DMI Anesthésie Hybride (Présentiel & Télémédecine) |
| **Méthodologie** | BMAD (BMad Agentic Development) avec workflow IA |
| **Statut** | En cours de développement (MVP — Incréments 1-3) |

---

## 2) Justification du projet

### 2.1 Problématique

En contexte périopératoire, la gestion des données d'anesthésie présente des défis critiques :

- **Hétérogénéité des données** : coexistence de supports papier et numériques, sources multiples non consolidées.
- **Sensibilité des données** : confidentialité des données de santé, exigences hospitalières strictes.
- **Criticité temporelle** : environnement bloc opératoire et SSPI où le temps est un facteur vital.
- **Traçabilité insuffisante** : absence de journalisation systématique (qui / quoi / quand).
- **Risques liés à la saisie manuelle** : erreurs, informations incomplètes, absence de consolidation temps réel.

### 2.2 Opportunité

DAI-BMAD répond à la nécessité de **centraliser le dossier d'anesthésie** et de **réduire les risques** en offrant une plateforme numérique intégrée couvrant l'ensemble du parcours anesthésique.

---

## 3) Vision et objectifs

### 3.1 Vision

Mettre à disposition des équipes d'anesthésie une **plateforme unique, fiable et intégrée** qui :

- Accompagne la **préparation pré-opératoire** (questionnaire + scores + points d'attention).
- Supporte le **suivi per-opératoire** (constantes, événements, alertes).
- Facilite le **post-opératoire** (SSPI, score de sortie, synthèse).
- Garantit la **conformité opérationnelle** (sécurité, disponibilité, audit).

Le système cible un **DMI d'anesthésie hybride**, combinant prise en charge présentielle au bloc et en SSPI avec des usages décentralisés de **télémédecine** (téléconsultation pré-anesthésique, télé-expertise, télésurveillance), dans un cadre d'interopérabilité basé sur **HL7/FHIR/IHE** et de sécurité by design.

### 3.2 Objectif général

Construire une plateforme capable de centraliser les informations anesthésiques et de soutenir la décision clinique via des calculs/alertes, **avec validation médicale systématique**.

### 3.3 Objectifs spécifiques

| # | Objectif | Mesurable par |
|---|---|---|
| O1 | Réduire les erreurs de saisie | Diminution des champs manquants / incohérents |
| O2 | Améliorer la complétude du dossier anesthésique | Taux de complétion des dossiers |
| O3 | Accélérer la préparation pré-opératoire | Temps moyen de complétion du questionnaire |
| O4 | Assurer un suivi patient en environnement critique | Taux d'utilisation des écrans per-op / SSPI |
| O5 | Détecter les anomalies et tracer les alertes | Traçabilité des alertes (création, affichage, acquittement) |
| O6 | Standardiser les données pour l'échange et l'audit | Conformité aux standards (HL7/FHIR) |

---

## 4) Périmètre du projet

### 4.1 Inclus (IN)

#### Pré-opératoire
- Questionnaire patient numérique (bilingue FR/AR, même modèle métier).
- Calcul automatique de scores cliniques (ASA, RCRI/Lee, Apfel, Mallampati, Duke/METs, STOP-BANG, GOLD, Child-Pugh, NYHA, CHA₂DS₂-VASc, ARISCAT).
- Affichage de points d'attention / alertes nécessitant validation.
- Consultation pré-anesthésique avec décision (autoriser / examens complémentaires / avis spécialisé / récuser).

#### Per-opératoire (bloc)
- Interface de suivi quasi temps réel.
- Collecte et enregistrement des constantes vitales (FC, TA, SpO₂, EtCO₂, etc.) via dispositifs/passerelles.
- Saisie des actes, médicaments et événements.
- Alertes intelligentes + traçabilité (apparition, acquittement, résolution).

#### Post-opératoire (SSPI)
- Suivi des constantes, douleur, observations.
- Score de sortie (Aldrete).
- Génération d'un rapport anesthésique et archivage.

#### Traçabilité & données
- Stockage structuré, historisation horodatée.
- Journalisation des actions critiques (audit append-only).

#### Télémédecine (P2)
- Téléconsultation pré-anesthésique à distance.
- Télé-expertise inter-hospitalière.
- Télésurveillance post-opératoire.
- Consentement patient traçable et audité.

#### IA gouvernée (P2)
- Agents IA via protocole MCP (Model Context Protocol).
- Prédiction d'instabilité hémodynamique.
- RAG pour rédaction de comptes rendus anesthésiques.
- Triage et aide à la décision (sous validation clinique obligatoire).

### 4.2 Hors périmètre (OUT)

- Dossier médical global hors anesthésie.
- Gestion administrative hospitalière.
- Remplacement total du SIH/DPI.
- Intégration de dispositifs biomédicaux non validés.

---

## 5) Parties prenantes et utilisateurs

### 5.1 Utilisateurs directs

| Rôle | Responsabilité dans DAI |
|---|---|
| **Patient** | Saisie du questionnaire pré-opératoire |
| **Anesthésiste** | Consultation pré-anesthésique, décision clinique, prescriptions, synthèse |
| **IADE** (Infirmier Anesthésiste) | Suivi per-opératoire, événements/médicaments, gestion alertes |
| **Équipe SSPI** | Suivi post-opératoire et évaluation de sortie |
| **Administrateur IT** | Sécurité, gestion des rôles, intégrations, exploitation |

### 5.2 Systèmes externes

| Système | Interaction | Standards |
|---|---|---|
| **SIH / DPI** | Échange données patient et documents | REST / HL7 v2 / HL7 FHIR / IHE (XCPD, XCA, XDS.b) |
| **Dispositifs biomédicaux** | Envoi des constantes vitales via Device Gateway | IHE PCD/DEV (DEC, PIV, ACM), IEEE 11073, Devices on FHIR |
| **Services IA** | Calcul de scores, détection anomalies, aide à la décision | API REST, MCP (Model Context Protocol) |
| **Service d'authentification** | Gestion identités et accès | OIDC / JWT, IHE XUA (assertions inter-établissements) |
| **Service de télémédecine** | Visioconférence sécurisée | WebRTC (DTLS/SRTP), STUN/TURN |

---

## 6) Architecture technique

### 6.1 Stack technologique

| Couche | Technologie | Justification |
|---|---|---|
| **Frontend** | React 19 + Vite 8 | Structuration adaptée aux applications complexes et réactives |
| **Backend** | Django + Django REST Framework | Socle robuste pour API sécurisées et modulaires |
| **Base de données** | PostgreSQL (cible) / SQLite (dev) | Stabilité et cohérence transactionnelle pour le cœur métier |
| **API** | REST / JSON | Standard, contractuel, simple à intégrer |
| **Authentification** | JWT et/ou OIDC | Flexibilité selon politique établissement (SSO/MFA) |
| **Temps réel** | Polling/SSE (MVP) → WebSocket (P1) → Pub/Sub broker (P2) | Évolutivité progressive |
| **Routing frontend** | React Router DOM 7 | Navigation SPA structurée |
| **Animations** | Framer Motion | Micro-animations et transitions fluides |
| **Graphiques** | Recharts | Visualisation des constantes et tendances |
| **Icônes** | Lucide React | Iconographie médicale cohérente |
| **HTTP client** | Axios | Appels API avec intercepteurs (auth, erreurs) |

### 6.2 Architecture logique (C4 — Containers)

```
┌─────────────────────────────────────────────────────────────────┐
│                        DAI System                               │
│                                                                 │
│  ┌──────────────┐    REST/JSON    ┌──────────────────────────┐  │
│  │  Frontend    │ ──────────────→ │   Backend API            │  │
│  │  React       │                 │   Django REST Framework  │  │
│  │              │                 │                          │  │
│  │  • Pré-op    │                 │  • Authentication module │  │
│  │  • Per-op    │                 │  • Patient module        │  │
│  │  • Post-op   │                 │  • Pre-op module         │  │
│  │  • Admin     │                 │  • Per-op module         │  │
│  └──────────────┘                 │  • Post-op module        │  │
│                                   │  • Alert module          │  │
│  ┌──────────────┐   REST/msg      │  • Report module         │  │
│  │ Device       │ ──────────────→ │  • Audit module          │  │
│  │ Gateway      │                 │  • Integration module    │  │
│  └──────────────┘                 └───────────┬──────────────┘  │
│                                               │ SQL             │
│                                   ┌───────────▼──────────────┐  │
│                                   │   PostgreSQL             │  │
│                                   │   Patients, dossiers,    │  │
│                                   │   scores, constantes,    │  │
│                                   │   événements, audit      │  │
│                                   └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         ▲              ▲               ▲              ▲
         │              │               │              │
    Dispositifs     SIH / DPI      Services IA    Auth Service
    biomédicaux                                   (OIDC / JWT)
```

### 6.3 Modules backend

#### Modules implémentés (état actuel)

| Module | Fonction | Statut |
|---|---|---|
| `patient` | Identité patient, point d'entrée clinique | ✅ Implémenté |
| `casefile` | Dossier anesthésique, statuts (PRE_OP/PER_OP/POST_OP/CLOSED), transitions | ✅ Implémenté |
| `preop` | Questionnaire, réponses, calcul scores, validation pré-anesthésique | ✅ Implémenté |
| `perop` | Session bloc, constantes (FC, TA, SpO₂, EtCO₂), événements, médicaments | ✅ Implémenté |
| `postop` | SSPI, observations, douleur, score Aldrete, readiness de sortie | ✅ Implémenté |
| `audit` | Journalisation actions critiques (append-only) | ✅ Implémenté |
| `common` | Erreurs standardisées, types partagés, pagination, utilitaires | ✅ Implémenté |
| `dai_api` | Configuration Django, settings, URLs, WSGI/ASGI | ✅ Implémenté |

#### Modules à compléter (cible)

| Module | Fonction | Statut |
|---|---|---|
| `alert` | Règles/seuils, cycle de vie (ACTIVE → ACKNOWLEDGED → RESOLVED) | 🔲 À compléter |
| `report` | Génération synthèse anesthésique + archivage + export PDF | 🔲 À compléter |
| `settings` | Paramétrage seuils d'alerte, protocoles, templates documents | 🔲 À compléter |
| `integration` | SIH/DPI, services IA, device gateway (anti-corruption layer) | 🔲 À compléter |

#### Modules avancés (évolutions)

| Module | Fonction | Phase |
|---|---|---|
| `interop` | Adaptateurs HL7 v2 / FHIR / IHE, mapping, conformance | P1/P2 |
| `streaming` | Diffusion temps réel constantes/événements (SSE → WebSocket → Pub/Sub) | P1/P2 |
| `telemedicine` | Téléconsultation WebRTC, sessions, consentement, audit | P2 |
| `security_compliance` | Audit renforcé (ATNA), consentement, traçabilité, règles locales | P1/P2 |
| `ai_agent` | Intégration MCP, tools IA autorisés, feature flags, gouvernance | P2 |

---

## 7) Sécurité et conformité

### 7.1 Principes

- **Least privilege** : accès minimal par rôle et par contexte clinique.
- **Traçabilité** : audit des actions critiques (écriture) et des accès sensibles (lecture).
- **Confidentialité** : chiffrement en transit (TLS 1.2+) et au repos.
- **Séparation recommandation vs décision** : notamment pour les usages IA.
- **Horodatage cohérent** : indispensable pour valeur médico-légale.

### 7.2 Contrôles techniques

| Contrôle | Description |
|---|---|
| **TLS** | Obligatoire pour toutes les communications client ↔ API (TLS 1.2+, idéalement 1.3) |
| **Chiffrement au repos** | Via capacités DB/infra PostgreSQL, clés gérées hors code |
| **Authentification** | OIDC (SSO) cible, avec JWT en phase initiale |
| **Autorisation** | RBAC (anesthésiste/IADE/SSPI/admin), extensible ABAC si multi-établissements |
| **Audit** | Journal append-only : qui/quoi/quand + objet clinique + contexte technique |
| **Synchronisation temps** | NTP/chrony, distinction `recorded_at` vs `received_at` |

### 7.3 Conformité locale (exemple tunisien)

La référence client cite l'exemple tunisien (loi 2004-63) : données de santé « sensibles », autorisations, transferts transfrontaliers, consentement.

| Exigence | Description |
|---|---|
| **Base légale** | Modalités de consentement (e-consent si requis) |
| **Hébergement** | Règles de souveraineté des données (où sont les données et sauvegardes) |
| **Rétention** | Durées de conservation (dossier, mesures, audit) |
| **Droits des personnes** | Accès, rectification, suppression selon règles santé |
| **Transferts transfrontaliers** | Autorisations selon cadre réglementaire local |

> **Note** : ce document n'est pas un avis juridique. Il formalise les points d'exigence à traiter avec le DPO/juridique et l'hébergeur.

---

## 8) Interopérabilité et standards de santé

### 8.1 Stratégie d'interopérabilité

Le système est conçu pour évoluer vers un **DMI hybride** intégrant :
- Interopérabilité SIH / HIE via **HL7 v2 / HL7 FHIR / IHE**.
- Ingestion biomédicale normalisée.
- Façade FHIR (convertir les flux entrants en représentations FHIR logiques).
- Anti-corruption layer (ne jamais exposer les formats externes au domaine métier).

### 8.2 Profils IHE visés

| Famille | Profils | Rôle |
|---|---|---|
| **PCD/DEV** (Point of Care Devices) | DEC, PIV, ACM | Transmission constantes, vérification perfusion, gestion alarmes |
| **ITI** (IT Infrastructure) | XCPD, XCA, XDS.b | Découverte patient, partage de documents inter-communautés |
| **CT** (Consistent Time) | — | Synchronisation horodatage (valeur médico-légale) |
| **Transition** | MHD, mXDE | Publication/découverte docs REST, extraction éléments cliniques |
| **Devices on FHIR / SDPi** | DoF | Mapping IEEE 11073 → FHIR (trajectoire) |

### 8.3 Ressources FHIR minimales

| Ressource FHIR | Usage DAI |
|---|---|
| `Patient` | Identité et identifiants |
| `Device` | Source biomédicale |
| `Observation` | Constantes vitales horodatées (SpO₂, TA, FC, EtCO₂…) |
| `Encounter` / `Procedure` | Contexte intervention |
| `MedicationAdministration` | Administrations per-opératoires |
| `DocumentReference` | Documents (synthèse, feuille anesthésie) |

---

## 9) Temps réel et streaming

### 9.1 Exigences

- Faible latence pour supervision per-opératoire et SSPI.
- Fiabilité (détection perte de flux, reprise).
- Sécurité (auth, RBAC, isolation multi-salle/multi-patient).

### 9.2 Trajectoire progressive

| Phase | Mécanisme | Description |
|---|---|---|
| **MVP** | Polling / SSE | Simple, robuste, suffisant pour premiers tests |
| **P1** | WebSocket | Bidirectionnel, latence plus faible, multi-salles |
| **P2** | Broker Pub/Sub (Redis/RabbitMQ/Kafka) | Découplage ingestion/diffusion, absorption des pics |

### 9.3 Chaîne de la donnée

```
Dispositif → Device Gateway → Ingestion (integration) → Normalisation (interop)
    → Persistance (perop/postop) → Diffusion (streaming) → UI Frontend
```

### 9.4 État de flux

- Backend : calcul `last_received_at` par source et par case.
- Exposition : `OK` / `DEGRADED` / `LOST`.
- Frontend : affichage explicite + alertes techniques.

---

## 10) Télémédecine

### 10.1 Périmètre (P2)

| Capacité | Description |
|---|---|
| **Téléconsultation pré-anesthésique** | Consultation à distance médecin-patient |
| **Télé-expertise inter-hospitalière** | Avis spécialisé entre établissements |
| **Télésurveillance** | Supervision distante post-opératoire |

### 10.2 Architecture WebRTC

- **Standard** : WebRTC avec chiffrement natif (DTLS/SRTP).
- **Exclusion** : outils de visioconférence grand public non conformes.
- **Composants** : signaling (SDP/ICE), STUN/TURN (traversée NAT).

### 10.3 Modèle de données

- `TeleconsultationSession` : caseId, scheduledAt, status (planned/active/ended/cancelled).
- `TeleconsultationParticipant` : sessionId, userId, role, joinedAt, leftAt.
- `ConsentRecord` : patientId, caseId, scope, signedAt, revokedAt.

### 10.4 Flux principal

1. Planification : création session + invitation.
2. Consentement patient : explicite, traçable.
3. Démarrage : participants rejoignent (audit join/leave).
4. Consultation : accès contrôlé au dossier.
5. Clôture : compte rendu + archivage.

---

## 11) IA gouvernée et intégration MCP

### 11.1 Principes

- L'IA est une **extension**, pas un remplacement du jugement clinique.
- Séparation stricte entre **recommandation IA** et **décision clinique finale**.
- Prévention du **data spillage** : l'IA n'a pas accès direct à la base de données.
- Prévention des **hallucinations** : validation médicale systématique.

### 11.2 Protocole MCP (Model Context Protocol)

MCP standardise la communication entre agents IA (MCP clients) et systèmes hospitaliers (MCP servers) :
- L'agent IA invoque des **tools autorisés** (ex. récupérer une créatinine récente).
- Chaque tool : valide autorisations, limite les champs retournés, journalise l'appel.

### 11.3 Catalogue de tools (exemples)

| Tool | Description | Accès |
|---|---|---|
| `get_recent_creatinine_level` | Valeur + date | Read-only |
| `get_vital_trend` | Séries temporelles agrégées | Read-only |
| `get_active_alerts` | Alertes actives/acquittées | Read-only |
| `draft_anesthesia_report` | Brouillon structuré (jamais publié automatiquement) | Action (validation requise) |

### 11.4 Cas d'usage

- **Prédiction d'instabilité hémodynamique** : alertes et points d'attention, jamais d'action automatique.
- **RAG pour comptes rendus** : génération de brouillons avec sources internes, validation humaine obligatoire.
- **Triage/télésurveillance** : aide à la priorisation des signaux.

### 11.5 Gouvernance

- Feature flags pour activation contrôlée.
- Journalisation : entrées, sorties, version modèle, décision clinique finale.
- POC en sandbox avant activation sur données réelles.

---

## 12) Plan de livraison

### 12.1 Stratégie d'implémentation

Le projet suit une approche **« vertical slice »** : incréments de bout en bout (UI → API → DB) sur un cas d'usage minimal, plutôt qu'un backend complet sans UI ou l'inverse.

### 12.2 Incréments

```
Incrément 1          Incrément 2          Incrément 3          Incrément 4
─────────────────    ─────────────────    ─────────────────    ─────────────────
SOCLE (P0)           PER-OP (P0)          POST-OP + DOCS (P0) AMÉLIORATIONS (P1)

• Auth + RBAC        • Écran per-op       • SSPI               • Alertes
  + Audit            • Constantes         • Score Aldrete         intelligentes
• Dossier            • Événements         • Synthèse           • Export PDF
  anesthésie         • Historisation        anesthésique        • Paramétrage
• Parcours pré-op                                              • SSO / MFA
• Questionnaire
• Scores socle
```

### 12.3 Priorisation des fonctionnalités

| Priorité | Contenu | Phase |
|---|---|---|
| **P0 — MVP** | Dossier anesthésie, parcours complet (pré/per/post-op), questionnaire, scores, constantes, événements, SSPI, Aldrete, synthèse, auth + RBAC + audit | Incréments 1–3 |
| **P1 — V1/V1.1** | Alertes intelligentes, export PDF, paramétrage, SSO/MFA, WebSocket, interop SIH/DPI | Incrément 4 |
| **P2 — Évolutions** | Broker Pub/Sub, IA gouvernée (MCP), télémédecine (WebRTC), profils IHE avancés | Futur |

### 12.4 Exigences fonctionnelles (référence PRD)

Le PRD définit **23 exigences fonctionnelles** (FR-01 à FR-23) et **21 exigences non fonctionnelles** (NFR-01 à NFR-21), traçables vers les exigences L2 d'origine (EF-01 à EF-23).

Référence complète : [prd.md](../phase-2-planning/prd.md)

---

## 13) Méthodologie BMAD

### 13.1 Phases du projet

| Phase | Contenu | Statut |
|---|---|---|
| **Phase 1 — Analysis & Discovery** | Product Brief, PID | ✅ Complété |
| **Phase 2 — Planning** | PRD (exigences fonctionnelles et non fonctionnelles) | ✅ Complété |
| **Phase 3 — Solutioning** | Architecture, C4, UML, backend module design, sécurité, interop, temps réel, télémédecine, IA/MCP | ✅ Complété |
| **Phase 4 — Implementation** | Plan d'implémentation, développement incrémental | 🔄 En cours |

### 13.2 Principes BMAD appliqués

- Travail par incréments traçables : **epic → stories → PR**.
- Chaque story définit : scope, critères d'acceptation (Given/When/Then), endpoints concernés, modèles impactés.
- Utilisation de Copilot/IA comme **accélérateur**, pas comme décideur.
- Code review systématique (sécurité, données de santé, logs/audit).
- Décisions structurantes consignées en mini-ADR.

### 13.3 Alignement référence client

La référence client « Architecture DMI Anesthésie Hybride » recommande une cible microservices. Pour respecter les contraintes DAI-BMAD :
- On conserve **un seul déploiement Django**, mais on modélise des « services » comme **frontières internes** (apps Django + jobs async + canaux temps réel).
- Les apports de la référence client sont traduits en **ajouts compatibles**, pas en refonte.

---

## 14) Données métier

### 14.1 Questionnaire préanesthésique

Le questionnaire est structuré par sections :

1. Identité & contexte opératoire
2. Antécédents médicaux
3. Dialyse / néphrologie
4. Traitements en cours
5. Antécédents chirurgicaux / anesthésiques
6. Allergies & habitudes
7. Risque hémorragique
8. Antécédents familiaux
9. Capacité fonctionnelle
10. Sommeil / SAOS
11. Signes complémentaires
12. Autonomie
13. Satisfaction (patient / médecin)

### 14.2 Scores cliniques supportés

| Score | Phase | Priorité | Statut backend |
|---|---|---|---|
| Duke / METs | Pré-op | P0 | ✅ Implémenté |
| RCRI / Lee | Pré-op | P0 | ✅ Implémenté |
| STOP-BANG | Pré-op | P0 | ✅ Implémenté |
| Apfel | Pré-op | P0 | ✅ Implémenté |
| GOLD | Pré-op | P0 | ✅ Implémenté |
| Child-Pugh | Pré-op | P0 | ✅ Implémenté |
| NYHA | Pré-op | P0 | ✅ Implémenté |
| CHA₂DS₂-VASc | Pré-op | P0 | ✅ Implémenté |
| ARISCAT | Pré-op | P0 | ✅ Implémenté |
| **Aldrete** | Post-op (SSPI) | P0 | ✅ Implémenté |
| ASA | Pré-op | P0 | ⚠️ Logique à valider |
| Mallampati | Pré-op | P0 | 🔲 À confirmer |

### 14.3 Règles de gestion

- Une réponse peut alimenter **plusieurs scores**.
- Les scores doivent conserver le **détail du calcul** et être **recalculables** après correction.
- La **validation finale** revient au médecin.
- FR/AR partagent le **même modèle métier**.
- Traçabilité du dernier contrôle d'anesthésie avant intervention.

---

## 15) Risques identifiés

| # | Risque | Impact | Mitigation |
|---|---|---|---|
| R1 | Accès patient au questionnaire (processus et sécurité non définis) | Élevé | Définir en amont le mécanisme d'accès sécurisé |
| R2 | Intégrations biomédicales dépendantes du contexte établissement | Moyen | Architecture découplée via Device Gateway + anti-corruption layer |
| R3 | Intégrations SIH/DPI variables selon établissement | Moyen | Module d'intégration avec façade FHIR + mocks pour développement |
| R4 | Contraintes « quasi temps réel » à quantifier | Moyen | MVP en polling/SSE, évolution progressive WebSocket → Pub/Sub |
| R5 | Gouvernance clinique requise pour IA et alertes | Élevé | Validation médicale systématique, feature flags, audit IA |
| R6 | Conformité réglementaire locale (données de santé, loi 2004-63) | Élevé | Checklist conformité, collaboration DPO/juridique |
| R7 | Choix solution WebRTC pour télémédecine (self-host vs fournisseur) | Moyen | Préparer modèle et points d'extension, livrer vidéo en incrément séparé |
| R8 | IA non gouvernée (risque clinique et conformité) | Élevé | MCP avec tools autorisés, séparation recommandation/décision, POC sandbox |
| R9 | Dette contrat API (divergence frontend/backend) | Moyen | Contract-first (DTO/serializers), tests d'API, versioning |
| R10 | Profils IHE non figés (variantes HL7/FHIR) | Moyen | Anti-corruption layer, démarrage avec mocks, verrouillage profils avant connecteurs réels |

---

## 16) Indicateurs de succès (KPI)

| KPI | Description | Cible |
|---|---|---|
| **Taux de complétion** | Diminution des champs manquants/incohérents | À définir avec les équipes cliniques |
| **Temps pré-op** | Temps moyen de complétion du questionnaire patient | Réduction mesurable vs. processus papier |
| **Taux d'utilisation** | Utilisation des écrans per-op/SSPI pendant intervention | > 80% des interventions |
| **Disponibilité** | Taux de disponibilité du service en exploitation | Adapté environnement critique |
| **Satisfaction** | Satisfaction des utilisateurs (anesthésistes, IADE, SSPI, IT) | > 4/5 |

---

## 17) État actuel d'implémentation

### Backend

| Composant | État |
|---|---|
| Projet Django (`dai_api`) | ✅ Configuré |
| Module `patient` (identité, CRUD) | ✅ Implémenté |
| Module `casefile` (dossier anesthésie, transitions) | ✅ Implémenté |
| Module `preop` (questionnaire, réponses, 10 scores) | ✅ Implémenté |
| Module `perop` (sessions, constantes, événements, médicaments) | ✅ Implémenté |
| Module `postop` (SSPI, observations, Aldrete, readiness sortie) | ✅ Implémenté |
| Module `audit` (journalisation actions critiques) | ✅ Implémenté |
| Module `common` (erreurs, utilitaires) | ✅ Implémenté |
| Module `alert` | 🔲 Préparé, à compléter |
| Module `report` | 🔲 Préparé, à compléter |
| Module `settings` | 🔲 Préparé, à compléter |
| Module `integration` | 🔲 Préparé, à compléter |
| API REST (endpoints pré/per/post-op) | ✅ Fonctionnels |

### Frontend

| Composant | État |
|---|---|
| App React + Vite + Routing | ✅ Configuré |
| Page d'accueil (Landing Page) | ✅ Implémentée |
| Authentification (Login / Signup) | ✅ Implémentée |
| Dashboard Médecin (Doctor Dashboard) | ✅ Implémenté |
| Dashboard Patient (Patient Dashboard) | ✅ Implémenté |
| Composants Pré-op (PreOpModule) | ✅ Implémentés |
| Composants Per-op | ✅ Implémentés |
| Composants Post-op (Aldrete, ObservationHistory) | ✅ Implémentés |
| Composants Alertes | ✅ Implémentés |
| Composants Admin (Layout, Common) | ✅ Implémentés |

### Infrastructure

| Composant | État |
|---|---|
| Dépôt Git (.git, .github, .gitignore) | ✅ Configuré |
| Diagrammes PlantUML (C4 + UML) | ✅ Présents (`diagrams/`) |
| Documentation complète (4 phases) | ✅ Organisée (`docs/`) |
| Infrastructure (déploiement) | 🔲 Placeholder uniquement |

---

## 18) Hypothèses et questions ouvertes

> [!IMPORTANT]
> Les éléments suivants doivent être verrouillés avant finalisation du MVP :

1. **Dispositifs biomédicaux** : liste, protocoles et formats d'échange à définir.
2. **Intégration SIH/DPI** : modalités d'échange (identité patient, admissions, documents).
3. **Standards interopérabilité** : profils IHE cibles (PCD/DEV/ITI) et périmètre P0/P1/P2 à verrouiller.
4. **Stratégie FHIR** : façade vs stockage natif, ressources minimales à figer.
5. **Politique de sécurité** : SSO, badges, MFA et exigences d'audit/conservation.
6. **Diffusion temps réel** : SSE vs WebSocket pour P1, nécessité d'un broker Pub/Sub pour P2.
7. **Seuils d'alertes** : protocoles cliniques de référence à valider.
8. **Télémédecine** : solution WebRTC (self-host vs fournisseur) + politique d'enregistrement.
9. **MCP / IA** : quels tools autoriser, quels flux sont read-only vs action (avec approbation).
10. **Accès patient au questionnaire** : processus et mécanisme de sécurité.
11. **Conformité locale** : validation juridique (DPO) et choix d'hébergement souverain.

---

## 19) Références documentaires

| Document | Emplacement | Phase |
|---|---|---|
| Product Brief | [project-brief.md](./project-brief.md) | Phase 1 — Analysis |
| **PID (ce document)** | [pid.md](./pid.md) | Phase 1 — Analysis |
| PRD | [prd.md](../phase-2-planning/prd.md) | Phase 2 — Planning |
| Architecture système | [architecture.md](../phase-3-solutioning/architecture.md) | Phase 3 — Solutioning |
| Diagrammes C4 | [c4-design.md](../phase-3-solutioning/c4-design.md) | Phase 3 — Solutioning |
| Diagrammes UML | [uml-design.md](../phase-3-solutioning/uml-design.md) | Phase 3 — Solutioning |
| Design backend | [backend-module-design.md](../phase-3-solutioning/backend-module-design.md) | Phase 3 — Solutioning |
| Sécurité & conformité | [security-and-compliance.md](../phase-3-solutioning/security-and-compliance.md) | Phase 3 — Solutioning |
| Interopérabilité | [interoperability-and-standards.md](../phase-3-solutioning/interoperability-and-standards.md) | Phase 3 — Solutioning |
| Temps réel & streaming | [realtime-and-streaming.md](../phase-3-solutioning/realtime-and-streaming.md) | Phase 3 — Solutioning |
| Télémédecine | [telemedicine-design.md](../phase-3-solutioning/telemedicine-design.md) | Phase 3 — Solutioning |
| IA & MCP | [ai-and-mcp-integration.md](../phase-3-solutioning/ai-and-mcp-integration.md) | Phase 3 — Solutioning |
| Alignement architecture avancée | [advanced-architecture-alignment.md](../phase-3-solutioning/advanced-architecture-alignment.md) | Phase 3 — Solutioning |
| Plan d'implémentation | [implementation-plan.md](../phase-4-implementation/implementation-plan.md) | Phase 4 — Implementation |
| Alignement BMAD | [advanced-support-alignment.md](../07-bmad-method/advanced-support-alignment.md) | Méthodologie BMAD |
| Architecture backend | [README_ARCHITECTURE.md](../../backend/README_ARCHITECTURE.md) | Documentation technique |
| Référence client | [Architecture DMI Anesthésie Hybride](../client-assets/) | Asset client |
| Diagrammes PlantUML (C4 + UML) | [diagrams/](../../diagrams/) | Livrables visuels |

---

## 20) Notes de traçabilité

Ce PID consolide la matière issue de l'ensemble des livrables du projet DAI-BMAD :
- **Phase 1** : Product Brief (Vision L1, Requirements L2, UML L3, Architecture L4, Domaine L5a).
- **Phase 2** : PRD (exigences fonctionnelles et non fonctionnelles détaillées).
- **Phase 3** : Architecture, C4, UML, backend module design, sécurité, interopérabilité, temps réel, télémédecine, IA/MCP, alignement référence client.
- **Phase 4** : Plan d'implémentation, vertical slices, ordre de développement.
- **Méthodologie BMAD** : alignement support avancé, checklists, processus spec-driven.
- **Référence client** : Architecture DMI Anesthésie Hybride (Présentiel & Télémédecine).

Il sert de **document de référence unique** pour l'initialisation et le cadrage du projet, et reflète l'état actuel de l'implémentation.

---
type: c4-design
project: "DAI-BMAD — Dossier d’Anesthésie Intelligent"
phase: "Phase 3 — Solutioning"
language: fr
created: "2026-03-17"
inputs:
  - "../phase-2-planning/prd.md"
  - "./architecture.md"
  - "./uml-design.md"
---

# C4 Design — Phase 3 (Solutioning)

## 1) Objectif du document
Ce document “C4 Design” formalise l’architecture DAI-BMAD sous l’angle **C4** (niveau *System Context* et *Container*), et relie explicitement :
- la vue d’ensemble (acteurs, systèmes externes, interactions),
- la décomposition en conteneurs (frontend, backend, base de données, gateway),
- les principaux flux inter-systèmes,
- la traçabilité **Architecture → C4**,
- les éléments concrets nécessaires pour préparer l’implémentation.

Ce document complète :
- le PRD (Phase 2) qui fixe le **quoi**,
- l’architecture qui fixe le **avec quoi** (stack, modules, sécurité, intégrations),
- l’UML Design qui décrit le **comment** (scénarios et modèle métier).

## 2) Position dans la méthode BMAD
- Phase BMAD : **Phase 3 — Solutioning**.
- Rôle : stabiliser la vue C4 servant de pont entre les exigences (PRD) et l’implémentation.
- Dépendances :
  - PRD (Phase 2) : exigences fonctionnelles / non-fonctionnelles.
  - Architecture (Phase 3) : choix technos, modules, sécurité, intégrations.
  - UML Design (Phase 3) : scénarios (pré-op, per-op) et modèle de domaine.
- Sorties attendues :
  - C4 Context + Container rendables en PlantUML.
  - Cartographie claire des échanges et points d’intégration.
  - Liste des décisions à verrouiller avant développement (contrats, sécurité, temps réel).

## 3) System Context Diagram (C4) + explication
### 3.1 Diagramme (PlantUML)
Ce diagramme positionne DAI dans son environnement : utilisateurs, SIH/DPI, dispositifs biomédicaux, auth, services IA.

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

### 3.2 Explication
- **Acteurs humains** : Patient, Anesthésiste, IADE, SSPI, Admin IT.
- **Système cible** : DAI couvre le parcours anesthésique pré/per/post-op, avec persistance et audit.
- **Systèmes externes** :
  - SIH/DPI : identité patient, admissions, (éventuellement) documents.
  - Dispositifs biomédicaux : source des constantes vitales.
  - Auth : gestion des identités et tokens.
  - Services IA : scoring (MVP) puis assistance/détection avancée (évolutions).
- **Point d’attention** : le protocole d’intégration SIH (REST/HL7/FHIR) et le mode de connexion biomédicale doivent être précisés avant implémentation.

## 4) Container Diagram (C4) + explication
### 4.1 Diagramme (PlantUML)
Ce diagramme décompose DAI en conteneurs déployables : UI web, API backend, base de données, gateway biomédical.

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

  Container(frontend, "Frontend Web", "Angular", "Interface utilisateur web pour pré-op, per-op, post-op et administration")

  Container(api, "Backend API", "Spring Boot", "Expose les API REST, applique la logique métier, gère sécurité, alertes et audit")

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

### 4.2 Explication
- **Frontend Web (Angular)** :
  - Écrans pré‑op (questionnaire), per‑op (monitoring + événements + alertes), post‑op (SSPI + Aldrete), admin (RBAC + paramètres).
  - Appels au backend en REST/JSON, avec une stratégie “quasi temps réel” per‑op (MVP : polling/SSE, évolution : WebSocket).
- **Backend API (Spring Boot)** :
  - Orchestration des cas d’usage, règles métier, sécurité (Spring Security, RBAC), audit, alertes, intégrations.
- **Database (PostgreSQL)** :
  - Persistance structurée et historisée (notamment *time-series* per‑op : constantes) + audit.
- **Device Gateway** :
  - Adaptation protocoles biomédicaux, normalisation des mesures, détection d’état de connexion, transmission au backend.

## 5) Description des composants principaux
Cette section décrit les composants principaux **au sens C4** (conteneurs et grands sous-systèmes internes) en cohérence avec l’architecture modulaire.

### 5.1 Frontend Web (Angular)
Découpage fonctionnel (features) attendu :
- **preop** : questionnaire patient, affichage scores, validation/correction anesthésiste.
- **perop** : écran bloc, affichage constantes, saisie événements/médicaments, affichage alertes et acquittement.
- **postop** : SSPI, saisie observations/douleur, calcul/affichage score Aldrete.
- **admin** : gestion utilisateurs/rôles, paramétrage seuils/protocoles/modèles.

Composants transverses :
- **core** : configuration, interceptors (auth, corrélation), gestion erreurs, routage.
- **shared-ui** : composants réutilisables (tableaux, formulaires, timeline, badges d’état, composants d’alerte).

### 5.2 Backend API (Spring Boot — monolithe modulaire)
Modules applicatifs principaux (référence architecture, alignés PRD/UML) :
- **Authentication** : authn/authz (JWT/OIDC), RBAC.
- **Patient / Case** : identité patient + dossier anesthésique + transitions d’état.
- **Pre‑op** : questionnaire, réponses, scoring, validation.
- **Per‑op** : sessions, ingestion constantes, événements/médicaments.
- **Post‑op** : SSPI, douleur, score Aldrete.
- **Alert** : règles/seuils, cycle de vie (ACTIVE → ACK → RESOLVED).
- **Report** : génération synthèse anesthésique, archivage, export.
- **Audit** : journalisation des actions critiques.
- **Integration** : SIH/DPI, services IA, device gateway (anti-corruption layer).

### 5.3 Device Gateway (biomédical)
Responsabilités principales :
- Normaliser les signaux (format, unités, horodatage).
- Identifier l’association mesure → patient/case (selon contexte bloc).
- Publier les mesures au backend de manière robuste (retries, buffering minimal si nécessaire).
- Émettre des événements techniques (ex. déconnexion) pour visibilité UI et audit technique.

### 5.4 Base de données (PostgreSQL)
Axe principal : garantir **intégrité** + **historisation** + **audit**.
- Stockage des entités : patients, dossiers, questionnaire, scores, sessions, événements, alertes, documents, paramètres, audit.
- Indexation ciblée (par `case_id`, horodatage, statut alerte).

## 6) Flux entre systèmes
Les flux ci-dessous se lisent à deux niveaux :
- C4 (qui parle à qui, via quel protocole),
- UML (séquences et activité) pour la dynamique détaillée.

### 6.1 Flux Pré‑op (Patient → DAI → IA scoring → Validation)
1. Patient utilise le Frontend (HTTPS) et soumet le questionnaire.
2. Frontend appelle le Backend API (REST/JSON).
3. Backend :
   - persiste réponses,
   - appelle le service IA (scoring) si externalisé, ou exécute le scoring interne,
   - persiste scores et éventuels “points d’attention”.
4. Anesthésiste consulte et valide/corrige via le Frontend → Backend.
5. Audit : la validation/correction est journalisée.

### 6.2 Flux Per‑op (Dispositifs → Gateway → Backend → UI)
1. Dispositifs biomédicaux envoient les constantes au Device Gateway.
2. Gateway transmet au Backend (REST ou messaging, à préciser).
3. Backend :
   - historise les mesures,
   - évalue règles/seuils (alertes),
   - publie les mises à jour vers l’UI (MVP : polling/SSE ; évolution : WebSocket).
4. IADE acquitte/commente les alertes via UI → Backend ; l’action est auditée.

### 6.3 Flux Post‑op / SSPI (UI → Backend → DB)
1. SSPI saisit observations et douleur via UI.
2. Backend persiste, calcule/stocke le score Aldrete.
3. Les informations restent consultables dans le dossier (historisation).

### 6.4 Flux Documents (Backend → DB → Export → SIH)
1. Anesthésiste déclenche génération de synthèse anesthésique (UI → Backend).
2. Backend génère le document, persiste métadonnées/référence et expose le téléchargement/export.
3. Option : échange avec SIH/DPI pour archivage institutionnel (à préciser).

### 6.5 Flux Sécurité (UI/API ↔ Auth)
1. L’utilisateur s’authentifie (OIDC) ou obtient un token (JWT en phase initiale).
2. Frontend transmet le token au backend.
3. Backend valide le token, applique RBAC et journalise les actions critiques.

## 7) Traçabilité Architecture → C4
Cette traçabilité garantit que la vue C4 est la traduction directe des choix de l’architecture, sans introduire de nouveaux éléments.

| Élément Architecture (Phase 3) | Élément C4 | Commentaire |
|---|---|---|
| Frontend Angular (pré/per/post/admin) | Container `Frontend Web (Angular)` | Même périmètre fonctionnel, mêmes acteurs |
| Backend Spring Boot (monolithe modulaire) | Container `Backend API (Spring Boot)` | Unique API REST, modules internes décrits en composants |
| PostgreSQL (données + audit) | Container `Database (PostgreSQL)` | Persistance structurée, historisation mesures, audit |
| Device Gateway (intégration biomédicale) | Container `Device Gateway` | Anti-corruption layer et normalisation des mesures |
| SIH/DPI (intégration) | System_Ext `SIH / DPI` | Identité patient, documents ; protocole à préciser |
| Auth Service (OIDC/JWT) | System_Ext `Auth Service` | Source de vérité identité ; backend valide tokens |
| Services IA (scoring, assistance) | System_Ext `Service IA` | MVP : scoring ; évolutions : assistance |
| Dispositifs biomédicaux | System_Ext `Dispositifs biomédicaux` | Source des constantes, via gateway |

## 8) Préparation implémentation
Les points suivants matérialisent le passage du C4 (structure) vers l’implémentation (contrats, données, sécurité, exploitation).

### 8.1 Contrats & interfaces à figer
- **OpenAPI** des endpoints (au minimum : pré‑op, per‑op, post‑op, alertes, documents, admin).
- Contrat gateway → backend (payload vitals, id mapping, fréquence, erreurs, retries).
- Contrat SIH/DPI (données d’identité, documents, synchronisation) : REST vs HL7 vs FHIR.
- Stratégie temps réel per‑op : polling/SSE (MVP) + critères de passage WebSocket.

### 8.2 Sécurité & conformité (socle)
- Choix OIDC vs JWT “standalone” pour MVP, règles RBAC par rôle.
- Politique d’audit : quelles actions, quel niveau de détail, rétention.
- Gestion de session et règles d’accès patient (processus et droits).

### 8.3 Données & performance
- Schéma logique minimal (patients, cases, réponses, scores, sessions, vitals, événements, alertes, documents, settings, audit).
- Indexation “time-series” per‑op et stratégie de purge/rétention.
- Stratégie de transactionnalité et de concurrence (écrans always-on).

### 8.4 Découpage de mise en œuvre (guidage)
- Implémenter les **use cases** backend alignés sur les séquences UML :
  - Pré‑op : soumission questionnaire, recalcul scores, validation.
  - Per‑op : start/end session, ingestion vitals, record event, ack alert.
  - Post‑op : observations SSPI, calcul Aldrete.
  - Documents : génération synthèse, export.
- Côté frontend : livrer d’abord le parcours P0 de bout en bout, puis enrichir (alertes P1, temps réel avancé P2).

### 8.5 Tests et critères d’acceptation
- Scénarios d’acceptation dérivés des flux (Given/When/Then) :
  - transitions d’état du dossier,
  - recalcul scores,
  - ingestion vitals et historisation,
  - cycle de vie alertes (ACTIVE → ACK → RESOLVED),
  - génération/export document.

---

## Annexes
- Rendu des diagrammes : les blocs ci-dessus sont compatibles PlantUML + C4-PlantUML (include distant).
- Références : PRD (Phase 2), architecture et UML (Phase 3).

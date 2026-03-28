---
type: interoperability
project: "DAI-BMAD — Dossier d’Anesthésie Intelligent"
phase: "Phase 3 — Solutioning"
language: fr
created: "2026-03-24"
inputs:
  - "../phase-2-planning/prd.md"
  - "./architecture.md"
  - "./backend-module-design.md"
  - "../client-assets/Architecture DMI Anesthésie Hybride (1).docx"
---

# Interopérabilité & standards (HL7 / FHIR / IHE)

## 1) Objectif
Donner une spécification **actionnable** de l’interopérabilité DAI-BMAD, alignée sur la référence client :
- échanges SIH/DPI/HIE,
- intégration dispositifs biomédicaux,
- trajectoire HL7 v2 → FHIR,
- profils IHE (PCD/DEV + ITI) et profils de transition.

Contrainte : rester dans un **monolithe Django modulaire** (apps) avec **anti‑corruption layer**.

## 2) Principes d’architecture (anti‑corruption layer)
- Le **domaine** DAI (dossier anesthésie, workflow, règles) ne doit pas dépendre des formats externes.
- Les ressources FHIR, segments HL7 v2 et transactions IHE sont gérés dans des modules dédiés :
  - `interop` : modèles d’échange, mapping, conformance,
  - `integration` : clients, connecteurs, retries/timeouts, supervision.
- Les modules métier consomment des **DTO internes stables** (ex. `PatientIdentity`, `VitalObservation`, `DocumentReference`).

## 3) Standards & profils (cible de conformité)
### 3.1 HL7 v2 / FHIR : rôle et trajectoire
- **HL7 v2** : très présent côté dispositifs et SIH historiques ; nécessite mapping.
- **HL7 FHIR** : cible pour des API REST modernes (ressources), meilleure sémantique.
- Trajectoire recommandée : **Façade FHIR**
  - convertir les flux entrants (v2, IHE) en **représentations FHIR** (au moins “logiques”),
  - exposer/consommer une API FHIR quand nécessaire,
  - sans imposer que le domaine interne soit “FHIR‑native”.

### 3.2 IHE PCD/DEV (intégration au point de soins)
Profil(s) principaux issus de la référence client :
- **DEC (Device Enterprise Communication)** : transmission des constantes (ex. SpO₂, TA, EtCO₂).
- **PIV (Point‑of‑care Infusion Verification)** : intégration bidirectionnelle avec pompes (vérification perfusion).
- **ACM (Alert Communication Management)** : routage/gestion des alarmes physiologiques/techniques.

Traduction DAI-BMAD :
- ingestion et normalisation des mesures → `perop`/`postop` via `interop` + `integration`.
- alarmes/alerts : `alert` (cycle de vie) + `streaming` (notification UI), alimentés par `interop`.

### 3.3 IHE ITI (télémédecine & partage documentaire)
Profil(s) cités dans la référence client :
- **XCPD** : découverte patient multi‑communautés (identité).
- **XCA** et **XDS.b** : recherche/récupération de documents inter‑communautés.

Traduction DAI-BMAD :
- identité patient : `patient` + `interop` (mappings identifiants, rapprochement, règles de confiance).
- documents : `report` + `integration` + `interop` (publication/récupération, métadonnées).

### 3.4 IHE CT (Consistent Time)
La référence client insiste sur la valeur médico‑légale de l’horodatage.

Traduction DAI-BMAD :
- unifier la **source de temps** (NTP/chrony côté infra),
- signer/horodater de manière cohérente : événements per‑op, administrations médicamenteuses, alarmes, transitions,
- corréler les traces (audit + streaming + intégrations).

### 3.5 Profils de transition : MHD et mXDE
- **MHD** : publication/découverte de documents via API REST (“XDS on FHIR”) ; utile pour clients web/mobiles.
- **mXDE** : extraction d’éléments cliniques depuis des documents structurés.

Traduction DAI-BMAD :
- considérer MHD comme “façade documentaire REST” lorsqu’une intégration XDS classique est trop lourde.
- mXDE comme capacité future (P2) : extraction ciblée (allergies, Hb, etc.) pour alimenter pré‑op et décisions.

### 3.6 Devices on FHIR / SDPi (trajectoire)
La référence client mentionne :
- **Devices on FHIR (DoF)** : mapping IEEE 11073 → ressources FHIR.
- **SDPi** : trajectoire vers une interop plus orientée services.

Traduction DAI-BMAD :
- à court terme : ingestion via gateway + mapping vers FHIR Observation/Device (logique) dans `interop`.
- à moyen terme : remplacer progressivement les adaptateurs HL7 v2 “fragiles” par DoF/SDPi selon équipements.

## 4) Ressources FHIR minimales (recommandation)
Sans imposer un serveur FHIR complet dès le MVP, définir une cartographie minimale :
- `Patient` : identité et identifiants.
- `Device` : source biomédicale.
- `Observation` : constantes (SpO₂, TA, FC, EtCO₂…), horodatées.
- `Encounter` / `Procedure` : contexte intervention.
- `MedicationAdministration` : administrations per‑op.
- `DocumentReference` : documents (synthèse, feuille anesthésie).

## 5) Stratégie d’implémentation (monolithe)
### 5.1 Modules
- `interop`
  - mapping HL7 v2/FHIR/IHE → DTO internes,
  - validations “conformance” (minimal),
  - journalisation technique (correlation id, rejets).
- `integration`
  - connecteurs externes (SIH/DPI/HIE, moteurs d’intégration),
  - timeouts/retries, circuit‑breaker light,
  - supervision.

### 5.2 Contrats internes (exemples)
- `VitalObservationDTO` : `caseId`, `patientId`, `code`, `value`, `unit`, `recordedAt`, `sourceDevice`.
- `ExternalPatientIdentityDTO` : `assigningAuthority`, `identifier`, `demographics`.
- `DocumentExchangeDTO` : `documentType`, `hash`, `createdAt`, `author`, `patientId`, `externalRefs`.

## 6) Tests & validation (sans SIH réel)
- Ajouter des **fixtures** HL7 v2 / FHIR (JSON) dans le repo pour tester la chaîne d’adaptation.
- Tests de mapping : “entrée externe → DTO interne” + “DTO interne → sortie externe”.
- Tests de robustesse : champs manquants, unités inattendues, dates, encodage.

## 7) Livrables attendus (stories)
- “Décision profils IHE” : liste cible + périmètre (P0/P1/P2).
- “Façade FHIR” : mapping minimal Observation/Device/Patient.
- “Conformance minimal” : checklists + rejets/alertes techniques.
- “MHD/MXDE (pré‑design)” : décision et points d’extension.


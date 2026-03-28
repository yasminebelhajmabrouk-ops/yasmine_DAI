---
type: advanced-architecture-alignment
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

# Alignement avancé d’architecture (référence client)

## 1) Objectif
Ce document formalise l’alignement entre les livrables DAI-BMAD (PRD/architecture/module design) et la référence client **« Architecture DMI Anesthésie Hybride (Présentiel & Télémédecine) »**.

But : **ajouter** le niveau de précision manquant (interopérabilité, temps réel, télémédecine, sécurité/conformité, IA/MCP) **sans changer** les choix structurants déjà actés dans DAI-BMAD.

## 2) Contraintes non négociables (rappel)
- Stack : **React + Django + DRF + PostgreSQL**.
- Architecture : **monolithe modulaire** (apps Django), **pas de migration microservices**.
- Parcours clinique : conserver le cœur **pré‑op / per‑op / post‑op (SSPI)**.
- Les apports de la référence client sont traduits en **ajouts compatibles** (frontières internes, jobs async, adaptateurs), pas en refonte.

## 3) Ce que la référence client exige (synthèse)
La référence client va au-delà d’un “interop/temps réel” générique et précise notamment :

### 3.1 Interopérabilité (SIH/DPI/HIE + dispositifs)
- IHE **PCD/DEV** : profils **DEC**, **PIV**, **ACM**.
- IHE **ITI** : **XCPD**, **XCA**, **XDS.b**.
- IHE **CT (Consistent Time)** pour la valeur médico‑légale de l’horodatage.
- Stratégie de transition : **Façade FHIR** + moteur d’intégration/routage, et trajectoire vers **Devices on FHIR** et **SDPi**.
- Accès documentaire : **MHD** et **mXDE** (transition “XDS on FHIR” / extraction d’éléments).

### 3.2 Temps réel et streaming
- Diffusion en quasi temps réel via **WebSockets**.
- Découplage par **Pub/Sub** (broker type Kafka/RabbitMQ) pour absorber pics et éviter couplages.
- Chaîne “device → normalisation → persistance → diffusion” explicitée.

### 3.3 Télémédecine
- Téléconsultation/télé‑expertise : **WebRTC** comme standard ouvert.
- Exigence de sécurité native (DTLS/SRTP) et rejet d’outils grand public non conformes.

### 3.4 Sécurité & conformité
- Chiffrement en transit (TLS 1.2+ / 1.3), chiffrement au repos.
- Fédération d’identité / assertions inter‑établissements (IHE **XUA**).
- Traçabilité et audit (IHE **ATNA**), plus synchronisation temporelle (IHE **CT**).
- Exemple de contraintes locales (cadre tunisien) : consentement, souveraineté d’hébergement, autorisations.

### 3.5 IA gouvernée et MCP
- Risque “data spillage” + hallucinations : besoin d’un cadre.
- Proposition : **MCP** comme middleware sécurisé (“FHIR de l’IA”), où l’IA n’accède pas à la DB mais invoque des **tools** autorisés.
- Cas d’usage : prédiction instabilité hémodynamique, RAG pour comptes rendus, triage/télésurveillance.

## 4) État actuel DAI-BMAD (ce qui est déjà couvert)
Les livrables DAI-BMAD actuels couvrent :
- Une architecture **React / Django** modulaire, avec `integration` + `interop` + `streaming` + `telemedicine` + `security_compliance` + `ai_agent`.
- Une trajectoire progressive pour le **quasi temps réel** (polling/SSE → WebSocket).
- Une mention explicite de l’intégration future **MCP**.

Ce qui manque principalement :
- La **liste des profils IHE** visés et les implications (contrats, traçabilité, temps).
- Une “chaîne de streaming” détaillée (schéma logique, message model, état de flux, résilience).
- Une architecture télémédecine **WebRTC** concrète (signaling, STUN/TURN, audit/consentement).
- Une spécification de sécurité/conformité plus opérationnelle (XUA/ATNA/CT, rétention, souveraineté).
- Une intégration MCP détaillée (catalogue de tools, garde‑fous, audit).

## 5) Additions proposées (monolithe modulaire)
Ces ajouts sont documentaires et de design ; ils restent compatibles avec un backend Django unique.

- Interop & standards : voir [interoperability-and-standards.md](interoperability-and-standards.md)
- Temps réel & streaming : voir [realtime-and-streaming.md](realtime-and-streaming.md)
- Télémédecine : voir [telemedicine-design.md](telemedicine-design.md)
- Sécurité & conformité : voir [security-and-compliance.md](security-and-compliance.md)
- IA & MCP : voir [ai-and-mcp-integration.md](ai-and-mcp-integration.md)

## 6) Traduction “microservices → monolithe modulaire” (règle d’alignement)
La référence client recommande une cible microservices. Pour respecter les contraintes DAI-BMAD :
- On conserve **un seul déploiement Django**, mais on modélise des “services” comme **frontières internes** : apps Django + files de jobs + canaux temps réel.
- On sépare les responsabilités via :
  - **apps** (`interop`, `streaming`, `telemedicine`, `security_compliance`, `ai_agent`),
  - **ports/adapters** (anti-corruption layer),
  - **traitements async** (workers) quand nécessaire.

Résultat : on obtient les bénéfices (découplage, résilience) **sans** imposer une architecture distribuée.

## 7) Décisions à verrouiller (mini‑ADR)
Avant connecteurs réels et industrialisation, il est recommandé de décider explicitement :
1. Profils IHE “cible” (PCD/DEV/ITI) et périmètre (P0/P1/P2).
2. Stratégie FHIR : façade vs stockage natif ; ressources minimales.
3. Temps réel : SSE vs WebSocket ; et si un broker est requis (et lequel).
4. Télémédecine : solution WebRTC (self‑host vs fournisseur) + politique d’enregistrement.
5. MCP : quels tools autoriser, quels flux sont “read‑only” vs “action” (avec approbation).

## 8) Traçabilité PRD
Cet alignement détaillé sert directement les NFR ajoutées :
- NFR‑16 (interop HL7/FHIR/IHE)
- NFR‑17 (quasi temps réel)
- NFR‑18 (télémédecine)
- NFR‑19 (sécurité & conformité)
- NFR‑20 (IA gouvernée)

## 9) Conclusion opérationnelle
L’alignement retenu permet d’augmenter la maturité architecturale du projet DAI-BMAD sans remettre en cause sa faisabilité immédiate.

La base implémentable reste :
- React
- Django
- Django REST Framework
- PostgreSQL

Les capacités avancées identifiées dans la référence client sont intégrées soit comme exigences de conception immédiates, soit comme feuille de route structurée pour les itérations ultérieures.
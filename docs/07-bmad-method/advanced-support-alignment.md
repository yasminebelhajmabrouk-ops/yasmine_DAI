---
type: bmad-method-advanced-alignment
project: "DAI-BMAD — Dossier d’Anesthésie Intelligent"
phase: "BMAD Method"
language: fr
created: "2026-03-24"
inputs:
  - "../phase-2-planning/prd.md"
  - "../phase-3-solutioning/architecture.md"
  - "../phase-3-solutioning/backend-module-design.md"
  - "../phase-3-solutioning/advanced-architecture-alignment.md"
  - "../client-assets/Architecture DMI Anesthésie Hybride (1).docx"
---

# Alignement “support avancé” — BMAD × Référence client

## 1) Objectif
Décrire comment utiliser BMAD pour intégrer les exigences avancées de la référence client (interop IHE/FHIR, streaming, WebRTC, sécurité/conformité, IA/MCP) **sans dévier** des contraintes DAI-BMAD (monolithe Django modulaire, parcours clinique stable).

## 2) Règles d’alignement (garde-fous)
- Ne pas “refaire l’architecture” : ajouter des **frontières internes** (apps, ports/adapters, jobs async) plutôt que des microservices.
- Ne pas modifier le workflow clinique : tout ajout doit s’accrocher au dossier (case) et à l’audit.
- Traçabilité : toute décision structurante doit être consignée (mini‑ADR) et reliée au PRD (NFR‑16..20).

## 3) Où se situe l’alignement dans BMAD
- Phase 2 (Planning) : PRD → exigences NFR explicites (interop/temps réel/télémédecine/sécurité/IA).
- Phase 3 (Solutioning) : architecture & module design → préciser standards/profils et chaînes techniques.
- Phase 4 (Implementation) : plan d’implémentation → vertical slices + POC ciblés (interop/streaming/MCP) derrière feature flags.

## 4) Artefacts “avancés” attendus (à produire / maintenir)
Les documents de solutioning avancés sont :
- [advanced-architecture-alignment.md](../phase-3-solutioning/advanced-architecture-alignment.md)
- [interoperability-and-standards.md](../phase-3-solutioning/interoperability-and-standards.md)
- [realtime-and-streaming.md](../phase-3-solutioning/realtime-and-streaming.md)
- [telemedicine-design.md](../phase-3-solutioning/telemedicine-design.md)
- [security-and-compliance.md](../phase-3-solutioning/security-and-compliance.md)
- [ai-and-mcp-integration.md](../phase-3-solutioning/ai-and-mcp-integration.md)

## 5) Checklists (BMAD-ready)
### 5.1 Interop (NFR-16)
- Profils IHE choisis et périmètre (P0/P1/P2) : PCD/DEV (DEC/PIV/ACM), ITI (XCPD/XCA/XDS.b), CT.
- Stratégie HL7 v2 → FHIR : façade FHIR et mapping minimal.
- Anti‑corruption layer : DTO internes stables.
- Plan de tests : fixtures HL7/FHIR, mapping tests, cas “données manquantes”.

### 5.2 Temps réel / streaming (NFR-17)
- Trajectoire : polling/SSE (MVP) → WS (P1) → broker (P2 si besoin).
- Schéma de messages versionné.
- État de flux (OK/DEGRADED/LOST) défini côté backend et UI.
- Mesures : latence end‑to‑end, reconnexion, multi‑salles.

### 5.3 Télémédecine (NFR-18)
- Modèle session + participants + consentement + audit.
- WebRTC : signaling + STUN/TURN (choix self‑host vs fournisseur).
- Politique d’enregistrement (si applicable) et accès.

### 5.4 Sécurité & conformité (NFR-19)
- TLS/WSS, chiffrement au repos.
- RBAC + éventuellement contraintes établissement/service.
- Audit ATNA‑like : événements normalisés.
- Temps cohérent (CT) : NTP, recorded_at/received_at.
- Rétention & souveraineté : décisions d’infra + validation conformité.

### 5.5 IA gouvernée / MCP (NFR-20)
- Catalogue des tools autorisés + permissions.
- Feature flags + audit IA.
- Séparation recommandation vs décision.
- POC en sandbox avant activation sur données réelles.

## 6) Process “Spec-driven” recommandé
- Une exigence avancée = 1 epic.
- Chaque epic produit :
  - 1 mini‑ADR (décision),
  - 1 design doc (solutioning),
  - 1 vertical slice (implémentation),
  - 1 plan d’évaluation (latence/interop/audit).

## 7) Validation
- Relecture métier (anesthésie/SSPI) : vérifier que rien ne perturbe le workflow.
- Relecture sécurité/compliance : audit, consentement, rétention.
- Relecture interop : profils IHE, mapping, contrats.


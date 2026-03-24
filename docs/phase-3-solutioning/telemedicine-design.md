---
type: telemedicine-design
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

# Télémédecine (téléconsultation / télé‑expertise) — Design cible

## 1) Objectif
Spécifier une extension télémédecine compatible DAI-BMAD (P2) et alignée sur la référence client :
- téléconsultation pré‑anesthésique,
- télé‑expertise inter‑hospitalière,
- supervision distante (télésurveillance).

Contrainte : ne pas perturber le cœur clinique (pré‑op/per‑op/post‑op) et rester sur un **monolithe Django modulaire**.

## 2) Principes
- Utiliser **WebRTC** pour l’audio/vidéo (standard ouvert).
- Sécuriser l’accès : identité, RBAC, et audit.
- Capturer les éléments médico‑légaux : consentement, présence, horodatage, compte rendu.

## 3) Architecture WebRTC (vue logique)
La référence client mentionne :
- WebRTC chiffré (DTLS/SRTP).
- Exclusion d’outils de visio grand public non conformes.

Composants (logiques) :
- Frontend React : UI session, documents, checklists.
- Backend Django (`telemedicine`) :
  - planification, sessions, participants,
  - tokens d’accès,
  - audit + consentement,
  - stockage métadonnées.
- Signaling (peut être un composant externe) : échanges SDP/ICE.
- STUN/TURN : traversée NAT (souvent service dédié).

## 4) Modèle de données (minimal)
- `TeleconsultationSession`
  - `caseId`, `scheduledAt`, `status` (planned/active/ended/cancelled)
  - `createdBy`, `createdAt`
- `TeleconsultationParticipant`
  - `sessionId`, `userId`, `role`, `joinedAt`, `leftAt`
- `ConsentRecord`
  - `patientId`, `caseId`, `scope` (teleconsultation), `signedAt`, `revokedAt`

## 5) Flux principal (téléconsultation pré‑anesthésique)
1. Planification : création session + invitation.
2. Consentement patient : explicite, traçable.
3. Démarrage session : participants rejoignent (audit join/leave).
4. Consultation : accès contrôlé au dossier et aux documents.
5. Clôture : compte rendu (document) + archivage.

## 6) Intégration documentaire et inter‑établissements
- Si parcours territorial : prévoir intégration via IHE ITI (XCPD/XCA/XDS.b) et/ou profils de transition (MHD).
- Les documents générés (synthèse, CR téléconsultation) doivent avoir : hash, auteur, timestamps, et être auditables.

## 7) Sécurité
- WebRTC : DTLS/SRTP.
- Contrôle d’accès : tokens courts, revocation.
- Audit systématique des accès (lecture) pendant une téléconsultation si requis.

Voir aussi [security-and-compliance.md](security-and-compliance.md).

## 8) Stories recommandées
- Modèle session + participants + audit.
- Consentement téléconsultation.
- Point d’extension “provider visio” (self‑host vs fournisseur).
- CR téléconsultation (document) + archivage.


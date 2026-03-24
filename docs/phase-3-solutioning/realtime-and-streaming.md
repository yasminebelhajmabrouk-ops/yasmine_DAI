---
type: realtime-and-streaming
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

# Temps réel & streaming (polling/SSE → WebSockets + Pub/Sub)

## 1) Objectif
Définir une architecture de diffusion quasi temps réel des constantes/événements (per‑op/SSPI) alignée sur la référence client (WebSockets + Pub/Sub), tout en restant compatible avec un **monolithe Django modulaire**.

## 2) Exigences clés
- Faible latence pour supervision (per‑op, télésurveillance).
- Fiabilité (détection perte de flux, reprise).
- Sécurité (auth, RBAC, isolation multi‑salle/multi‑patient).
- Évolutivité (multi‑salles) sans casser le MVP.

## 3) Trajectoire progressive (DAI-BMAD)
- MVP : **polling** ou **SSE** (simple, robuste).
- Évolutions : **WebSockets** pour bidirectionnel et latence plus faible.
- Option (si charge/complexité) : **broker Pub/Sub** interne (Redis/RabbitMQ/Kafka) pour découpler ingestion et diffusion.

## 4) Chaîne logique de la donnée (adaptation monolithe)
La référence client décrit une chaîne “normalisation → broker → persistance + streaming”.

Traduction monolithe : mêmes étapes, mais dans un seul backend avec frontières internes :
1. Ingestion : `integration` reçoit mesures (gateway biomédical).
2. Normalisation : `interop` transforme en DTO stables (option : représentation FHIR logique, ex. Observation).
3. Persistance : `perop`/`postop` stockent en DB (mesures horodatées).
4. Diffusion : `streaming` publie vers UI (SSE/WS) + expose état de flux.

## 5) WebSockets : design minimal
### 5.1 Auth & autorisation
- Connexion WS authentifiée (token) + contrôle d’accès “abonnements” :
  - un client ne peut s’abonner qu’aux `caseId` autorisés.

### 5.2 Modèle de messages (exemple)
Définir un schéma versionné :
- `version`
- `type` : `vital_observation` | `event` | `alert` | `flow_status`
- `caseId`, `patientId`
- `payload`
- `recordedAt`, `sentAt`

### 5.3 Backpressure & quotas
- Limiter fréquence par client (rate limit) et/ou regrouper (batch) selon charge.
- Prévoir “degradation mode” UI : moins de points/secondes si saturation.

## 6) Pub/Sub : quand et pourquoi
La référence client propose un broker (Kafka/RabbitMQ) pour absorber pics et découpler.

Dans DAI-BMAD monolithe :
- option P1/P2 : utiliser un bus interne (Redis pubsub, RabbitMQ via Celery, ou Kafka) si :
  - multi‑salles à forte volumétrie,
  - besoin d’isoler traitements (alerting, persistance, streaming),
  - relecture/retention côté bus.

## 7) État de flux (monitoring clinique)
- Backend : calculer `last_received_at` par source et par case.
- Exposer : `OK / DEGRADED / LOST`.
- Frontend : affichage explicite + alertes techniques (sans noyer l’utilisateur).

## 8) Tests et évaluation
- Mesurer latence end‑to‑end (ingestion → UI).
- Tester perte réseau et reconnexion.
- Tester multi‑salles (abonnements) et isolation RBAC.

## 9) Stories recommandées
- SSE MVP + état de flux.
- WebSocket P1 + message schema versionné.
- Option broker P2 (décision + POC charge).


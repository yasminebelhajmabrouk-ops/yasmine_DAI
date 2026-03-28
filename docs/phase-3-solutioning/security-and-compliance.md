---
type: security-and-compliance
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

# Sécurité & conformité (Security & Privacy by Design)

## 1) Objectif
Spécifier les contrôles de sécurité et les exigences de conformité attendues pour un DMI anesthésie hybride (présentiel + télémédecine), en alignement avec la référence client.

Contrainte : implémentation dans un **monolithe Django modulaire**, sans refonte distribuée.

## 2) Principes
- **Least privilege** : accès minimal par rôle et par contexte clinique.
- **Traçabilité** : audit des actions critiques (écriture) et, si requis, des accès sensibles (lecture).
- **Confidentialité** : chiffrement en transit et au repos.
- **Séparation recommandation vs décision** : notamment pour les usages IA.
- **Horodatage cohérent** : indispensable pour valeur médico‑légale (cf. IHE CT).

## 3) Contrôles techniques (socle)
### 3.1 Chiffrement en transit
- TLS obligatoire pour toutes les communications client ↔ API.
- Politique minimale : TLS 1.2+ (idéalement TLS 1.3).
- Pour WebSockets : utiliser `wss://` avec la même politique TLS.

### 3.2 Chiffrement au repos
- Chiffrer les données “at rest” via capacités DB/infra (PostgreSQL + stockage disque), clés gérées hors code.
- Classer les données sensibles (constantes, médicaments, documents, audit) et définir une politique de sauvegarde/restauration.

### 3.3 Authentification & fédération d’identité
- Stratégie cible : OIDC (SSO) avec RBAC applicatif.
- Alignement IHE : la référence client mentionne **IHE XUA** (assertions inter‑établissements).
  - Traduction : intégrer des “assertions” d’identité/role/établissement dans le jeton (claims) et les propager aux appels d’intégration.

### 3.4 Autorisation (RBAC, et ABAC si nécessaire)
- RBAC : anesthésiste/IADE/SSPI/admin.
- Si réseau multi‑établissements : ajouter des contraintes de type “établissement”, “service”, “relation de soin” (ABAC légère).

### 3.5 Audit & traçabilité (IHE ATNA)
La référence client mentionne **IHE ATNA** pour audit + authentification des nœuds.

Traduction DAI-BMAD :
- `audit` : journal append‑only avec événements normalisés.
- Capturer au minimum : qui/quoi/quand + objet clinique (patient/case) + justification (si workflow le demande) + contexte technique (ip, user agent, correlation id).
- Distinguer :
  - audit “métier” (transitions, validation, acquittement alerte, génération document),
  - audit “sécurité” (échecs auth, changements rôles, export, accès sensibles).

### 3.6 Temps cohérent (IHE CT)
- Synchronisation NTP/chrony au niveau infrastructure.
- Normaliser : `recorded_at` (source mesure) vs `received_at` (serveur) pour les constantes.
- Corréler horodatage : mesure, événement per‑op, alarme, décision, document.

## 4) Exigences télémédecine (WebRTC)
La référence client exige une approche “privacy by design” :
- WebRTC impose le chiffrement média (DTLS/SRTP).
- Interdiction d’outils grand public non conformes pour flux cliniques.

Implications DAI-BMAD :
- `telemedicine` doit gérer : consentements, sessions, participants, audit.
- La solution de visio (self‑host/fournisseur) doit fournir : contrôle d’accès, logs, politique d’enregistrement.

## 5) Conformité locale (exemple tunisien)
La référence client cite l’exemple tunisien (loi 2004‑63) : données de santé “sensibles”, autorisations, transferts transfrontaliers, consentement.

Positionnement DAI-BMAD :
- Ce document n’est **pas** un avis juridique.
- Il formalise les **points d’exigence** à traiter avec le DPO/juridique et l’hébergeur.

Checklist “conformité locale” (à adapter au pays) :
- Base légale + modalités de consentement (e‑consent si requis).
- Règles d’hébergement/souveraineté (où sont les données et sauvegardes).
- Durées de rétention (dossier, mesures, audit).
- Droits des personnes (accès, rectification, suppression selon règles santé).

## 6) IA gouvernée : sécurité et conformité
Voir aussi [ai-and-mcp-integration.md](ai-and-mcp-integration.md).

Exigences :
- Éviter le “data spillage” : limiter strictement ce que l’IA voit.
- Journaliser : entrées (features), sorties (recommandations), version modèle, et **décision clinique finale**.
- Feature flags : activation contrôlée.

## 7) Livrables attendus (stories)
- Politique audit (ATNA‑like) + format d’événements.
- Décision “XUA‑like” : propagation d’identité/role/établissement.
- Consentement : modèle + audit + UI.
- Télémédecine : exigences de sécurité WebRTC + choix d’implémentation.
- Rétention & souveraineté : décisions d’infra (avec équipe conformité).


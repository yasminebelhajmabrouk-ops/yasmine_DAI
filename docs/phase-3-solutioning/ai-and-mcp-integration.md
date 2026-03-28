---
type: ai-and-mcp-integration
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

# IA gouvernée & intégration MCP (Model Context Protocol)

## 1) Objectif
Décrire comment intégrer des agents IA de manière **sécurisée, auditée et gouvernée**, conformément à la référence client qui propose le **MCP** comme middleware (“FHIR de l’IA”).

Contrainte : rester dans un **monolithe Django modulaire** ; l’IA est une extension, pas un remplacement du jugement clinique.

## 2) Problèmes à éviter (référence client)
- **Data spillage** : un LLM ne doit pas avoir accès direct à la base de données.
- **Hallucinations** : l’IA peut inventer des faits médicaux ; il faut une séparation claire entre suggestion et décision.

## 3) Principe MCP (résumé)
- MCP introduit une communication standardisée entre :
  - **MCP clients** : agents IA,
  - **MCP servers** : systèmes hospitaliers exposant des “tools”.
- Au lieu de “lire la DB”, l’agent invoque un **tool** autorisé (ex. récupérer une créatinine récente) et reçoit une réponse structurée.

## 4) Architecture proposée (DAI-BMAD)
### 4.1 Modules
- `ai_agent` :
  - orchestration des appels IA,
  - gouvernance (feature flags, politiques),
  - stockage des recommandations.
- `security_compliance` :
  - règles d’accès, consentement, audits renforcés.
- `integration` :
  - connecteurs vers fournisseurs IA si nécessaire.

### 4.2 MCP server “interne”
Dans un monolithe :
- implémenter un “serveur MCP” comme **API interne** (ou composant applicatif) qui expose des tools stricts.
- chaque tool :
  - valide autorisations,
  - limite les champs retournés,
  - journalise l’appel (acteur, raison, contexte patient/case).

## 5) Catalogue de tools (exemples)
Le catalogue exact est une décision de gouvernance. Exemples alignés sur la logique de la référence client :
- `get_recent_creatinine_level(patientId)` → valeur + date.
- `get_vital_trend(caseId, code, window)` → séries temporelles agrégées.
- `get_active_alerts(caseId)` → alertes actives/acquittées.
- `draft_anesthesia_report(caseId)` → brouillon structuré (jamais publié automatiquement).

Règle : les tools sont **minimaux** et “least data”.

## 6) Gouvernance clinique (obligatoire)
- Toute recommandation IA est :
  - identifiée comme telle,
  - historisée,
  - révisable/confirmable par un clinicien.
- La décision finale (validation anesthésiste) est stockée séparément et auditée.

## 7) Cas d’usage (référence client)
- Prédiction instabilité hémodynamique (ex. post‑induction) : alertes et points d’attention, jamais action automatique.
- RAG pour rédaction de comptes rendus : génération de brouillons + sources internes, validation humaine.
- Télésurveillance/triage : aider à prioriser des signaux, avec politiques strictes.

## 8) Sécurité & conformité
- Authentifier et autoriser chaque appel tool.
- Rétention/audit : conserver les appels IA (sans stocker inutilement des données sensibles dans des logs).
- Privacy by design : minimiser les prompts, redacter.

Voir aussi :
- [security-and-compliance.md](security-and-compliance.md)

## 9) Stories recommandées
- “Tool registry” + permission model.
- “Audit IA” : schéma stockage recommandations + décisions.
- “RAG brouillon rapport” (P2) avec validation.
- “Pilot hemodynamics” (POC) en sandbox.


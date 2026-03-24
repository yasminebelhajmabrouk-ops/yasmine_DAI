---
type: product-brief
project: "DAI-BMAD — Dossier d’Anesthésie Intelligent"
phase: "Phase 1 — Analysis & Discovery"
language: fr
created: "2026-03-16"
context: "Hôpital / santé publique — parcours périopératoire"
sources:
  - "DAI-Project/README.md"
  - "DAI-Project/docs/01-vision/vision.md (L1)"
  - "DAI-Project/docs/02-requirements/requirements.md (L2)"
  - "DAI-Project/docs/03-uml/l3-uml-overview.md (L3)"
  - "DAI-Project/docs/04-architecture/l4-architecture-overview.md (L4)"
  - "DAI-Project/docs/04-architecture/adr/ADR-001-tech-stack.md"
  - "DAI-Project/docs/05-domain/questionnaire-scoring-model.md (L5a)"
  - "Documents client: questionnaires préanesthésiques FR/AR, document des scores (non versionnés dans ce repo)"
---

# Product Brief — DAI-BMAD (Dossier d’Anesthésie Intelligent)

## 1) Résumé exécutif
DAI (Dossier d’Anesthésie Intelligent) est une plateforme hospitalière couvrant l’ensemble du parcours anesthésique **pré‑opératoire**, **per‑opératoire (bloc)** et **post‑opératoire (SSPI)**.

L’objectif est d’améliorer **sécurité**, **traçabilité** et **performance des soins** via :
- la **collecte structurée** (questionnaires, constantes, événements),
- le **calcul automatique de scores cliniques**,
- des **alertes intelligentes** (à valider cliniquement),
- la **génération de documents standardisés**,
- l’**interopérabilité** avec le SIH/DPI et des dispositifs biomédicaux.

## 2) Contexte & problème
En contexte périopératoire, la donnée est :
- hétérogène (papier/numérique, sources multiples),
- sensible (confidentialité, exigences hospitalières),
- critique en temps (bloc/SSPI),
- soumise à des exigences fortes de **traçabilité** (audit: qui/quoi/quand).

DAI répond à la nécessité de **centraliser** le dossier d’anesthésie et de **réduire les risques** liés à la saisie manuelle, aux informations incomplètes et à l’absence de consolidation temps réel.

## 3) Vision
Mettre à disposition des équipes d’anesthésie une plateforme unique, fiable et intégrée qui :
- accompagne la préparation pré‑opératoire (questionnaire + scores + points d’attention),
- supporte le suivi per‑opératoire (constantes, événements, alertes),
- facilite le post‑opératoire (SSPI, score de sortie, synthèse),
- tout en garantissant la conformité opérationnelle (sécurité, disponibilité, audit).

## 4) Objectifs
### Objectif général
Construire une plateforme DAI capable de centraliser les informations anesthésiques et de soutenir la décision clinique via des calculs/alertes, **avec validation médicale systématique**.

### Objectifs spécifiques
- Réduire les erreurs de saisie et améliorer la complétude du dossier anesthésique.
- Accélérer la préparation pré‑op grâce à un questionnaire numérique.
- Assurer un suivi patient en environnement critique (bloc/SSPI) avec historisation horodatée.
- Détecter des anomalies (ex. hypotension prolongée) et tracer les alertes (création, affichage, acquittement).
- Standardiser la donnée pour l’échange et l’audit.

## 5) Périmètre
### Inclus (IN)
**Pré‑opératoire**
- Questionnaire patient numérique (bilingue FR/AR, même modèle métier).
- Calcul automatique de scores (au minimum ASA, RCRI/Lee, Apfel, Mallampati; extensible).
- Affichage de points d’attention / alertes nécessitant validation.
- Consultation pré‑anesthésique par anesthésiste avec décision : autoriser l’anesthésie, demander des examens complémentaires, demander un avis spécialisé, ou récuser l’anesthésie.

**Per‑opératoire (bloc)**
- Interface de suivi quasi temps réel.
- Collecte et enregistrement des constantes (FC, TA, SpO₂, EtCO₂, etc.) via dispositifs/passerelles.
- Saisie des actes/médicaments/événements.
- Alertes intelligentes + traçabilité (apparition, acquittement, résolution).

**Post‑opératoire (SSPI)**
- Suivi des constantes, douleur, observations.
- Score de sortie (ex. Aldrete).
- Génération d’un rapport anesthésique et archivage.

**Traçabilité & données**
- Stockage structuré, historisation horodatée.
- Journalisation des actions critiques.

### Hors périmètre (OUT) — à confirmer
- Dossier médical global hors anesthésie.
- Gestion administrative hospitalière.
- Remplacement total du SIH/DPI.
- Intégration de dispositifs biomédicaux non validés.

## 6) Utilisateurs & parties prenantes
- **Patient** : saisie du questionnaire pré‑op.
- **Anesthésiste** : consultation pré‑anesthésique, décision (autoriser / examens / avis / récuser), prescriptions, synthèse.
- **IADE / infirmier anesthésiste** : suivi per‑op, événements/médicaments, alertes.
- **Équipe SSPI** : suivi post‑op et sortie.
- **Admin / IT hospitalier** : sécurité, rôles, intégrations, exploitation.
- **Systèmes externes** : SIH/DPI, dispositifs biomédicaux, services IA (selon phasage).

## 7) Parcours & cas d’usage clés
### Pré‑op (questionnaire → scores → décision)
- Le patient complète un questionnaire structuré.
- Le système calcule des scores et identifie des points d’attention.

- L’anesthésiste réalise la consultation pré‑anesthésique et prend une décision : autoriser l’anesthésie, demander des examens complémentaires, demander un avis spécialisé, ou récuser l’anesthésie.
- Le dernier contrôle d’anesthésie est effectué juste avant l’intervention (généralement la veille ou le jour même ; en cas d’anesthésie ambulatoire, le jour même).

### Per‑op (monitoring → événements → alertes)
- L’IADE suit les constantes, enregistre actes/médicaments.
- Le système détecte des anomalies via règles/seuils.
- Les alertes sont acquittées avec traçabilité.

### Post‑op (SSPI → Aldrete → synthèse)
- Suivi post‑op + score de sortie.
- Génération/archivage du rapport anesthésique.

## 8) Fonctionnalités (priorisation)
### MVP (P0)
- Dossier anesthésie patient (création/consultation/mise à jour).
- Couverture parcours Pré‑op / Per‑op / Post‑op.
- Questionnaire pré‑op numérique (contenu minimal: antécédents, allergies, traitements, symptômes, facteurs de risque).
- Calcul automatique des scores prioritaires.
- Interface per‑op et collecte des constantes (via dispositif/passerelle) + historisation.
- Saisie événements/médicaments.
- SSPI + calcul score de sortie.
- Génération d’un document de synthèse.
- RBAC + authentification + audit.

### V1/V1.1 (P1)
- Alertes intelligentes (ex. hypotension prolongée) avec état et acquittement.
- Export PDF / format établissement.
- Paramétrage (protocoles, seuils, modèles de documents).
- SSO/MFA selon politique.

### Évolutions (P2)
- Communication temps réel (WebSocket) et monitoring avancé.
- Intégration IA élargie (recommandations, détection d’anomalies avancée), sous gouvernance clinique.

## 9) Données métier (questionnaire & scoring)
### Questionnaire préanesthésique — sections (modèle métier)
Le questionnaire est structuré par sections, incluant notamment :
- Identité & contexte opératoire
- Antécédents médicaux
- Dialyse / néphrologie
- Traitements en cours
- Antécédents chirurgicaux / anesthésiques
- Allergies & habitudes
- Risque hémorragique
- Antécédents familiaux
- Capacité fonctionnelle
- Sommeil / SAOS
- Signes complémentaires
- Autonomie
- Satisfaction (patient / médecin)

### Scores à supporter (socle)
Le moteur doit supporter des scores tels que : Duke/METs, RCRI/Lee, STOP‑BANG, Apfel, Child‑Pugh, NYHA, CHA2DS2‑VASc, ARISCAT, ASA (logique à valider), Mallampati, et **Aldrete** en post‑op.

### Règles de gestion
- Une réponse peut alimenter plusieurs scores.
- Les scores doivent conserver le détail du calcul et être recalculables après correction.
- La validation finale revient au médecin.
- FR/AR partagent le même modèle métier.
- Le système doit pouvoir tracer la date/heure (prévue et/ou réalisée) du dernier contrôle d’anesthésie avant l’intervention.

## 10) Architecture cible (haut niveau)
### Stack (décision ADR)
- Frontend : **React**
- Backend : **Django**
- Base de données : **PostgreSQL**
- API : **Django REST Framework (REST)**
- Sécurité : **authentification Django** + **JWT et/ou OIDC** selon le contexte (SSO/MFA selon politique)

### Décomposition logique
- Frontend : formulaires pré‑op, vue per‑op, suivi SSPI, consultation.
- Backend : modules patient/dossier, questionnaire, scoring, per‑op, post‑op, alertes, audit, intégration.
- Intégrations : dispositifs biomédicaux (via passerelle), SIH/DPI, services IA (phase avancée).

## 11) Exigences non fonctionnelles (NFR)
- **Sécurité** : authentification, RBAC, TLS, audit; SSO/MFA selon politique.
- **Performance** : interface per‑op réactive en continu; mise à jour proche du temps réel (cible à valider).
- **Disponibilité** : adapté à un environnement critique (bloc/SSPI).
- **Interopérabilité** : intégration SIH/DPI; données structurées et standardisées.
- **Exploitabilité** : logs, supervision/monitoring, documentation.

## 12) Indicateurs de succès (KPI)
- Réduction des erreurs de saisie.
- Diminution du temps de préparation pré‑op.
- Amélioration de la complétude des dossiers.
- Taux de disponibilité en conditions d’exploitation.
- Satisfaction des utilisateurs.

## 13) Hypothèses & questions ouvertes (à verrouiller)
- Liste des dispositifs biomédicaux, protocoles et formats d’échange.
- Modalités d’intégration SIH/DPI (identité patient, admissions, documents).
- Politique de sécurité (SSO, badges, MFA) et exigences d’audit/conservation.
- Seuils d’alertes et protocoles cliniques de référence.
- Définition précise du périmètre MVP (liste finale des P0).

## 14) Notes de traçabilité
Ce Product Brief consolide la matière issue des livrables amont (Vision L1, Requirements L2, UML L3, Architecture L4, modèle domaine L5a). Il sert de base à la suite de la démarche BMAD (planification, backlog, conception détaillée, implémentation).

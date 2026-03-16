---
type: prd
project: "DAI-BMAD — Dossier d’Anesthésie Intelligent"
phase: "Phase 2 — Planning"
language: fr
created: "2026-03-16"
inputs:
  - "../phase-1-analysis/project-brief.md"
  - "DAI-Project/docs/02-requirements/requirements.md (L2 historique)"
---

# PRD — DAI-BMAD (Dossier d’Anesthésie Intelligent)

## 1) Objectif du document
Ce PRD traduit le Product Brief (Phase 1) en exigences produit actionnables pour planification et réalisation.

Il sert à :
- définir le **MVP** (périmètre P0) et les incréments P1/P2,
- cadrer **fonctionnel** et **non‑fonctionnel** (sécurité, temps réel, audit),
- fournir des **critères d’acceptation** testables,
- expliciter les **dépendances**, risques et décisions à verrouiller.

## 2) Contexte & vision (rappel)
DAI est une plateforme hospitalière couvrant le parcours anesthésique : **pré‑op**, **per‑op (bloc)**, **post‑op (SSPI)**.
Le système vise sécurité, traçabilité et performance via questionnaire numérique, calcul de scores, historisation des constantes/événements, alertes (validées cliniquement), génération de documents et intégrations.

## 3) Objectifs produit
### 3.1 Objectifs (mesurables)
- Réduire les erreurs de saisie et améliorer la complétude du dossier anesthésique.
- Réduire le temps de préparation pré‑opératoire.
- Améliorer la traçabilité (audit « qui/quoi/quand ») et l’accessibilité des informations.
- Assurer un suivi per‑op et SSPI utilisable en contexte critique.

### 3.2 Indicateurs de succès (KPI)
- Diminution des champs manquants / incohérents sur le dossier.
- Temps moyen de complétion du questionnaire patient.
- Taux d’utilisation des écrans per‑op / SSPI pendant intervention.
- Disponibilité du service en exploitation.
- Satisfaction utilisateurs (anesthésistes, IADE, SSPI, IT).

## 4) Personae & parties prenantes
### Personae principales
- **Patient** : renseigne le questionnaire pré‑op.
- **Anesthésiste** : valide/corrige, décide, génère la synthèse.
- **IADE** : suit per‑op, saisit événements/médicaments, gère alertes.
- **Équipe SSPI** : suivi post‑op, score de sortie, observations.
- **Admin / IT** : gestion accès, sécurité, exploitation, intégrations.

## 5) Périmètre & priorisation

### 5.1 MVP (P0) — livré en priorité
Le MVP vise une chaîne complète « pré‑op → per‑op → post‑op » avec données structurées, audit et génération de synthèse.

Inclut au minimum :
- Gestion du dossier anesthésique patient et transitions d’état.
- Questionnaire pré‑op numérique (contenu minimal défini) + calcul scores socle.
- Écran per‑op : capture/affichage constantes + saisie événements/médicaments + historisation horodatée.
- SSPI : suivi + score Aldrete.
- Génération document de synthèse.
- Authentification + RBAC + audit (journalisation actions critiques).

### 5.2 V1/V1.1 (P1)
- Alertes intelligentes (ex. hypotension prolongée) avec cycle de vie et acquittement.
- Export PDF / format établissement.
- Paramétrage (protocoles, seuils, modèles) + configuration.
- SSO/MFA selon politique établissement.

### 5.3 Évolutions (P2)
- Temps réel avancé (WebSocket), monitoring enrichi.
- IA élargie (recommandations / anomalies avancées) avec gouvernance clinique.

### 5.4 Hors périmètre (OUT)
- Dossier médical global hors anesthésie.
- Gestion administrative.
- Remplacement total SIH/DPI.
- Dispositifs biomédicaux non validés.

## 6) Parcours utilisateur (user journeys)

### 6.1 Pré‑op : questionnaire → scores → validation
1. Le patient ouvre le questionnaire pré‑op (FR/AR selon langue).
2. Le patient soumet ses réponses.
3. Le système calcule les scores et marque les points d’attention.
4. L’anesthésiste consulte, corrige si nécessaire, puis valide.

### 6.2 Per‑op : monitoring → événements → historisation
1. L’IADE démarre la session per‑op pour un dossier.
2. Le système reçoit/affiche les constantes et les historise.
3. L’IADE saisit les événements (actes, médicaments, incidents).

### 6.3 Post‑op : SSPI → Aldrete → synthèse
1. L’équipe SSPI renseigne constantes/observations.
2. Le système calcule le score Aldrete.
3. Le système génère et archive la synthèse anesthésique.

## 7) Exigences fonctionnelles (détaillées)
Les exigences ci‑dessous reprennent la base L2 (EF‑xx) et les rendent testables.

### 7.1 Dossier anesthésique & parcours

**FR-01 — Gestion dossier anesthésique (EF-01, P0)**
- Description : Créer/consulter/mettre à jour un dossier anesthésique.
- Critères d’acceptation :
  - Un utilisateur autorisé peut créer un dossier et l’associer à un patient.
  - Les modifications sont horodatées et auditées.

**FR-02 — Couverture parcours (EF-02, P0)**
- Description : Le système couvre Pré‑op / Per‑op / Post‑op (SSPI).
- Critères d’acceptation :
  - Chaque dossier a un état courant appartenant à {pré‑op, per‑op, post‑op, clos} (noms à confirmer).
  - L’état est visible et persistant.

**FR-03 — Statuts & transitions (EF-03, P0)**
- Description : Gérer transitions d’état du patient sur le parcours.
- Critères d’acceptation :
  - Les transitions sont contraintes (ex. pas de passage direct pré‑op → post‑op sans per‑op, à valider).
  - Chaque transition est tracée (qui/quoi/quand).

**FR-04 — Historique anesthésique (EF-04, P1)**
- Description : Consulter l’historique anesthésique (périmètre anesthésie).
- Critères d’acceptation :
  - Afficher la liste des dossiers anesthésiques existants d’un patient.

### 7.2 Pré‑opératoire

**FR-05 — Questionnaire patient (EF-05, P0)**
- Description : Permettre au patient de compléter un questionnaire pré‑op numérique.
- Critères d’acceptation :
  - Le questionnaire est accessible selon un mécanisme d’accès défini (à valider).
  - Les réponses sont sauvegardées et versionnées (au minimum horodatées).

**FR-06 — Contenu minimal questionnaire (EF-06, P0)**
- Description : Couvrir antécédents, allergies, traitements, symptômes, facteurs de risque.
- Critères d’acceptation :
  - Les sections minimales existent et sont complétables.

**FR-07 — Calcul scores (EF-07, P0)**
- Description : Calculer automatiquement ASA, RCRI/Lee, Apfel, Mallampati (socle).
- Critères d’acceptation :
  - Après soumission, les scores sont calculés et associés au dossier.
  - Le calcul est recalculable après modification d’une réponse.
  - Le détail de calcul est conservé (au moins inputs + résultat; niveau de détail à préciser).

**FR-08 — Validation anesthésiste (EF-08, P1)**
- Description : Valider/corriger les informations collectées.
- Critères d’acceptation :
  - Les corrections sont historisées et auditées.
  - Un statut « validé » (ou équivalent) est visible.

**FR-09 — Alertes d’attention clinique (EF-09, P1)**
- Description : Afficher des alertes de type « attention clinique » nécessitant validation.
- Critères d’acceptation :
  - Les alertes sont visibles, contextualisées (raison), et liées aux données.

### 7.3 Per‑opératoire (bloc)

**FR-10 — Écran per‑op (EF-10, P0)**
- Description : Interface per‑op pour suivi patient.
- Critères d’acceptation :
  - Affichage continu sans blocage (voir NFR performance).

**FR-11 — Collecte constantes (EF-11, P0)**
- Description : Collecter et enregistrer FC, TA, SpO₂, EtCO₂, etc. via dispositifs/passerelles.
- Critères d’acceptation :
  - Les constantes arrivent horodatées et sont persistées.
  - Une perte de flux est détectable (mécanisme à préciser).

**FR-12 — Saisie événements (EF-12, P0)**
- Description : Enregistrer actes, médicaments, incidents.
- Critères d’acceptation :
  - Chaque événement est horodaté et audité.

**FR-13 — Historique horodaté (EF-13, P0)**
- Description : Conserver historique des constantes et événements.
- Critères d’acceptation :
  - Consultation possible a posteriori.

**FR-14 — Alertes intelligentes per‑op (EF-14, P1)**
- Description : Alertes (ex. hypotension prolongée) avec traçabilité.
- Critères d’acceptation :
  - États d’alerte au minimum {active, acquittée, résolue}.
  - Audit sur création/acquittement.

### 7.4 Post‑opératoire (SSPI)

**FR-15 — Suivi SSPI (EF-15, P0)**
- Description : Suivi constantes, douleur, observations.
- Critères d’acceptation :
  - Les observations sont persistées et auditées.

**FR-16 — Score Aldrete (EF-16, P0)**
- Description : Calcul et affichage du score de sortie.
- Critères d’acceptation :
  - Le score est calculé à partir des données SSPI.
  - Le résultat est historisé.

**FR-17 — Support postop (EF-17, P1)**
- Description : Protocoles/recommandations avec validation clinique.
- Critères d’acceptation :
  - Les recommandations ne remplacent pas la validation médicale.

### 7.5 Documents

**FR-18 — Génération synthèse (EF-18, P0)**
- Description : Générer une synthèse anesthésique.
- Critères d’acceptation :
  - Document généré à partir des données du dossier.
  - Document consultable ultérieurement.

**FR-19 — Export (EF-19, P1)**
- Description : Export PDF ou format établissement.

**FR-20 — Archivage/consultation documents (EF-20, P1)**
- Description : Archiver et permettre la consultation des documents.

### 7.6 Utilisateurs & administration

**FR-21 — Rôles utilisateurs (EF-21, P0)**
- Description : Gérer rôles anesthésiste, IADE, SSPI, admin.

**FR-22 — RBAC (EF-22, P0)**
- Description : Appliquer contrôle d’accès basé sur les rôles.

**FR-23 — Paramétrage (EF-23, P1)**
- Description : Paramètres (protocoles, seuils alertes, modèles documents).

## 8) Exigences non fonctionnelles (NFR)
### 8.1 Sécurité & conformité
- **NFR-01 (P0)** : authentification obligatoire.
- **NFR-02 (P0)** : RBAC.
- **NFR-03 (P0)** : TLS.
- **NFR-04 (P0)** : audit des actions critiques.
- **NFR-05 (P1)** : SSO/badges/MFA selon établissement.

### 8.2 Performance & temps quasi réel
- **NFR-06 (P0)** : interface per‑op réactive en continu.
- **NFR-07 (P0)** : mise à jour proche temps réel (cible à valider).
- **NFR-08 (P1)** : multi‑salles / multi‑patients.

### 8.3 Disponibilité
- **NFR-09 (P0)** : adapté environnement critique.
- **NFR-10 (P1)** : sauvegarde/restauration.

### 8.4 Interopérabilité
- **NFR-11 (P0)** : intégration SIH/DPI (modalités à définir).
- **NFR-12 (P1)** : données structurées/standardisées.

### 8.5 Exploitation
- **NFR-13 (P0)** : documentation.
- **NFR-14 (P0)** : Git/PR/traçabilité.
- **NFR-15 (P1)** : logs + supervision.

## 9) Données & modèle questionnaire/scoring (références)
Le modèle métier questionnaire/scores doit garantir :
- sections structurées (identité, antécédents, allergies, traitements, capacité fonctionnelle, SAOS, etc.),
- compatibilité FR/AR via un même modèle,
- réutilisation des réponses dans plusieurs scores,
- conservation du détail de calcul et recalcul après correction.

## 10) Dépendances & décisions à verrouiller
- Dispositifs biomédicaux : liste, protocoles, formats.
- SIH/DPI : identité patient, admissions, documents.
- Politique sécurité : SSO/MFA, exigences audit et conservation.
- Seuils/protocoles cliniques pour alertes.

## 11) Risques
- Accès patient au questionnaire (process et sécurité) non défini.
- Intégrations biomédicales et SIH dépendantes du contexte établissement.
- Contraintes « quasi temps réel » à quantifier.
- Gouvernance clinique requise pour IA/alertes.

## 12) Plan de livraison (proposition)
### Incrément 1 — Socle (P0)
- Auth + RBAC + audit.
- Dossier anesthésie + parcours + pré‑op questionnaire + scores socle.

### Incrément 2 — Per‑op (P0)
- Écran per‑op, constantes, événements, historisation.

### Incrément 3 — Post‑op + documents (P0)
- SSPI + Aldrete + synthèse.

### Incrément 4 — Améliorations (P1)
- Alertes intelligentes, export, paramétrage, SSO/MFA.

## 13) Matrice de traçabilité (L2 → PRD)
### EF
- EF-01 → FR-01
- EF-02 → FR-02
- EF-03 → FR-03
- EF-04 → FR-04
- EF-05 → FR-05
- EF-06 → FR-06
- EF-07 → FR-07
- EF-08 → FR-08
- EF-09 → FR-09
- EF-10 → FR-10
- EF-11 → FR-11
- EF-12 → FR-12
- EF-13 → FR-13
- EF-14 → FR-14
- EF-15 → FR-15
- EF-16 → FR-16
- EF-17 → FR-17
- EF-18 → FR-18
- EF-19 → FR-19
- EF-20 → FR-20
- EF-21 → FR-21
- EF-22 → FR-22
- EF-23 → FR-23

### NFR
- NFR-01..NFR-15 → Section 8


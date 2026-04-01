# C4 — DAI-BMAD

Ce dossier contient les diagrammes C4 principaux du projet DAI-BMAD.

## Fichiers
- `system-context.puml` : contexte global du système
- `container-diagram.puml` : vue des conteneurs principaux
- `component-backend.puml` : vue des composants backend Django

## Objectif
Ces diagrammes servent à documenter l’architecture du Dossier d’Anesthésie Intelligent :
- acteurs humains
- systèmes externes
- frontend React
- backend Django modulaire
- base PostgreSQL
- intégrations biomédicales et SIH

## Backend actuellement implémenté
Le backend déjà réalisé couvre principalement :
- `patient`
- `casefile`
- `preop`
- `perop`
- `postop`
- `audit`

## Backend cible complète
L’architecture cible complète prévoit également :
- `alert`
- `report`
- `settings`
- `integration`
- `interop`
- `streaming`
- `telemedicine`
- `security_compliance`
- `ai_agent`

## But
Le C4 complète les diagrammes UML :
- UML = logique métier et séquences
- C4 = vue d’architecture et de déploiement logique
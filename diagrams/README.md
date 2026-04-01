# UML — DAI-BMAD

Ce dossier contient les diagrammes UML principaux du projet DAI-BMAD.

## Fichiers
- `source/use-case.puml` : acteurs et cas d’utilisation globaux
- `source/sequence-preop.puml` : flux pré-opératoire
- `source/sequence-perop.puml` : flux per-opératoire
- `source/sequence-postop.puml` : flux postopératoire / SSPI
- `source/activity-workflow.puml` : workflow global patient
- `source/class-domain-model.puml` : modèle métier principal

## Objectif
Ces diagrammes servent à :
- documenter le parcours périopératoire complet
- aligner le backend avec le PRD et l’architecture
- préparer la soutenance, le rapport et l’évolution du frontend

## Parcours couvert
- Pré-op : questionnaire, réponses, scores, validation
- Per-op : session bloc, constantes, événements
- Post-op : séjour SSPI, observations, score Aldrete

## Remarque
Les diagrammes ont été mis à jour pour refléter l’état réel du backend implémenté :
- `preop`
- `perop`
- `postop`
- `audit`
- `casefile`
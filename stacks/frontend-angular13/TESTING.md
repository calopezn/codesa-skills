---
title: Testing frontend-angular13
version: 1.0.0
last_updated: 2026-05-25
applies_to: frontend-angular13
---

# Testing — Frontend Angular 13

Canonical: `codesa-sdd-templates/shared/standards/testing-standards-frontend.md`  
(copiado a `codesa-specs/specs/testing-standards-frontend.md` en el repo).

## Niveles

| Nivel | Herramienta | SDD |
|-------|-------------|-----|
| Unit componente/servicio | Jasmine + Karma | Criterios de `proposal.md` |
| Lint | ESLint (`@angular-eslint`) | Preset Codesa en `.codesa/config/` |
| E2E | Proyecto (Cypress/Protractor si aplica) | Pasos en PR "¿Cómo probarlo?" |

## Reglas

- Mockear `HttpClient` en tests de servicios.
- No commitear `fdescribe` / `fit`.
- Cobertura mínima en features nuevas según Sonar del proyecto (~60% referencia base-standards).

## Relación con backend

Si el change incluye nuevo endpoint, el test E2E o manual debe usar la ruta documentada en `api-catalog.md` y el contrato del `api-spec.yml` del MS.

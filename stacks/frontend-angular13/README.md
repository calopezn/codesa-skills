---
title: Stack frontend-angular13
version: 1.0.0
last_updated: 2026-05-25
status: stable
owner: Arquitectura Codesa
applies_to: frontend-angular13
type: stack-index
---

# Frontend — Angular 13+ (`frontend-angular13`)

Template SDD: `codesa-sdd-templates/templates/frontend-angular13/`

## Cuándo aplica

- SPAs POS y back-office (ej. `sf-pos-web-unificado`).
- Angular 13+, PrimeNG 13, RxJS 7, ngx-translate.
- Consumo de APIs vía Gateway: `/api/v1/<dominio>/**`.

## Documentación en codesa-skills

| Tema | Archivo |
|------|---------|
| Artefactos SDD (`api-catalog`, `ui-inventory`) | [ARTIFACTS-SDD.md](ARTIFACTS-SDD.md) |
| Stack | [TECH_STACK.md](TECH_STACK.md) |
| Arquitectura UI | [../../frontend/ARCHITECTURE.md](../../frontend/ARCHITECTURE.md) |
| Convenciones | [../../frontend/CONVENTIONS.md](../../frontend/CONVENTIONS.md) |
| Testing | [TESTING.md](TESTING.md) |

## Fuente de verdad en el repo del frontend

| Archivo | Ruta |
|---------|------|
| Standards | `codesa-specs/specs/frontend-standards.md` |
| Catálogo de MS consumidos | `codesa-specs/specs/api-catalog.md` |
| Inventario UI | `codesa-specs/specs/ui-inventory.md` |
| Agente IA | `codesa-specs/agents/frontend-developer.md` |
| Presets lint | `.codesa/config/.eslintrc.frontend-codesa.json` |

## Instalación

```powershell
.\scripts\install-codesa-sdd.ps1 -Stack frontend-angular13 ...
```

Canonical: `codesa-sdd-templates/templates/frontend-angular13/codesa-specs/specs/frontend-standards.md`

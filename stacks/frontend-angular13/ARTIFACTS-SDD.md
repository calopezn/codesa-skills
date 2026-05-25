---
title: Artefactos SDD frontend
version: 1.0.0
last_updated: 2026-05-25
applies_to: frontend-angular13
---

# Artefactos SDD — Frontend Angular

Equivalente backend de `api-spec.yml` / `data-model.md`.

## `api-catalog.md`

**Ubicación:** `codesa-specs/specs/api-catalog.md`

Documenta los microservicios y rutas Gateway que consume la SPA.

```markdown
# API Catalog — <nombre-app>

| MS | Ruta pública Gateway | Spec OpenAPI (repo MS) |
|----|----------------------|-------------------------|
| sf-venta-ms-core | /api/v1/ventas/* | link o path a api-spec.yml |
| sf-cliente-ms | /api/v1/clientes/* | ... |
```

Reglas:

- La **fuente de verdad del contrato REST** sigue siendo `api-spec.yml` del MS backend.
- El frontend tipa servicios HTTP según DTOs alineados a ese contrato.
- Cambios cross-repo: mismo ticket, ramas `feature/<ticket>-backend` y `feature/<ticket>-frontend`.

Plantilla inicial: `codesa-sdd-templates/templates/frontend-angular13/codesa-specs/specs/api-catalog.md`

## `ui-inventory.md`

**Ubicación:** `codesa-specs/specs/ui-inventory.md`

Inventario de:

- Feature modules y lazy routes
- Guards (`RouteGuard`, `UrlAccessGuard`, etc.)
- Pantallas principales y flujos
- Claves i18n críticas por feature

Actualizar cuando se añade ruta, guard o pantalla en un change OpenSpec.

Plantilla: `codesa-sdd-templates/templates/frontend-angular13/codesa-specs/specs/ui-inventory.md`

## Change OpenSpec

```
openspec/changes/<ticket>/
├── proposal.md
├── design.md      ← rutas, servicios, i18n, librerías @superflex/*
└── tasks.md       ← Step 0: feature/<ticket>-frontend
```

## Checklist pre-merge

- [ ] `api-catalog.md` si nuevo MS o ruta Gateway
- [ ] `ui-inventory.md` si nueva pantalla o guard
- [ ] Sin textos hardcodeados (ngx-translate)
- [ ] `takeUntil` en suscripciones que sobreviven al componente

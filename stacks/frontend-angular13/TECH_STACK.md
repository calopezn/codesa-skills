---
title: TECH_STACK frontend-angular13
version: 1.0.0
last_updated: 2026-05-25
applies_to: frontend-angular13
---

# Stack técnico — Angular 13+

Resumen alineado al template `frontend-angular13`. Detalle ampliado: [../../frontend/TECH_STACK.md](../../frontend/TECH_STACK.md).

| Área | Tecnología |
|------|------------|
| Framework | Angular ~13, TypeScript ~4.4 |
| UI | PrimeNG 13, PrimeFlex, PrimeIcons |
| HTTP | HttpClient + interceptores (JWT, loader) |
| i18n | ngx-translate (`assets/i18n/*.json`) |
| Formularios | Reactive Forms (preferido) |
| Estado | Servicios + RxJS (no NgRx mandatorio) |
| Alertas | AlertService / SweetAlert2 (según proyecto) |
| Lint / formato | ESLint + Prettier (presets `.codesa/config/`) |
| Tests | Jasmine/Karma; E2E según proyecto |

## SDD

- No hay `api-spec.yml` en el frontend; usar **api-catalog.md**.
- Inventario de UI: **ui-inventory.md**.

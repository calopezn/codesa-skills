---
title: Paridad de stacks — codesa-skills ↔ codesa-sdd-templates
version: 1.0.0
last_updated: 2026-05-25
status: stable
owner: Arquitectura Codesa
applies_to: all
type: index
---

# Paridad de stacks

Este documento mapea cada **template** de [codesa-sdd-templates](https://gitlab.codesa.com.co/arquitectura/ia/codesa-sdd-templates) con la documentación y skills de **codesa-skills**.

## Templates SDD (fuente de verdad corporativa)

| Template SDD | Stack | Documentación skills | Standards en template (repo MS instanciado) |
|--------------|-------|----------------------|---------------------------------------------|
| `backend-java11-sb27` | Java 11, Spring Boot 2.7, Springfox 3, Sleuth+Zipkin | [stacks/backend-java11-sb27/](stacks/backend-java11-sb27/README.md) | `codesa-specs/specs/backend-standards.md` |
| `backend-java17-sb3` | Java 17, Spring Boot 3, springdoc 2.x, Micrometer Tracing | [stacks/backend-java17-sb3/](stacks/backend-java17-sb3/README.md) | `codesa-specs/specs/backend-standards.md` |
| `frontend-angular13` | Angular 13+, PrimeNG, RxJS | [stacks/frontend-angular13/](stacks/frontend-angular13/README.md) | `codesa-specs/specs/frontend-standards.md` |

## Standards compartidos (`shared/standards/`)

| Standard en templates | Cubierto en skills |
|----------------------|-------------------|
| `base-standards.md` | Skills transversales + § en cada stack |
| `testing-standards-backend.md` | [backend/TESTING.md](backend/TESTING.md) + stacks backend |
| `testing-standards-frontend.md` | [frontend/](frontend/) + [stacks/frontend-angular13/TESTING.md](stacks/frontend-angular13/TESTING.md) |
| `openapi-standards.md` | [stacks/backend-java11-sb27/OPENAPI.md](stacks/backend-java11-sb27/OPENAPI.md), [stacks/backend-java17-sb3/OPENAPI.md](stacks/backend-java17-sb3/OPENAPI.md) |
| `java-style-guide.md` | Referenciado en skills; detalle en template |
| `typescript-style-guide.md` | [frontend/CONVENTIONS.md](frontend/CONVENTIONS.md) |
| `documentation-standards.md` | [stacks/README.md](stacks/README.md#documentación) |
| `api-gateway-standards.md` | [stacks/README.md](stacks/README.md#api-gateway) |
| `backend-developer-agent.md` | Instanciado en template → `codesa-specs/agents/backend-developer.md` |
| `frontend-developer-agent.md` | Instanciado en template → `codesa-specs/agents/frontend-developer.md` |

## Documentación transversal (agnóstica de versión)

| Tema | Ubicación skills |
|------|------------------|
| Capas Controller → Service → DAO | [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md) |
| Skills agénticos (planes, TDD, review) | [skills/](skills/) |
| Arquitectura UI Angular (módulos, RxJS) | [frontend/ARCHITECTURE.md](frontend/ARCHITECTURE.md) |

## Cómo elegir stack al usar un agente

1. Identificar el template del repo (`openspec/config.yaml` o `backend-standards.md`).
2. Abrir el README del stack en `stacks/<template>/`.
3. Leer `codesa-specs/specs/` del repo antes de implementar (regla `use-codesa-standards.mdc`).

## Historial de brechas cerradas (2026-05-25)

- Añadidos `stacks/backend-java17-sb3` y documentación springdoc / jakarta.
- Añadidos `stacks/frontend-angular13` con `api-catalog` y `ui-inventory`.
- Corregidas rutas erróneas `.codesa/specs/` en convenciones backend.
- `backend/TESTING.md` alineado con prohibición de H2 del template.

---
title: Stack backend-java17-sb3
version: 1.0.0
last_updated: 2026-05-25
status: stable
owner: Arquitectura Codesa
applies_to: backend-java17-sb3
type: stack-index
---

# Backend — Java 17 + Spring Boot 3 (`backend-java17-sb3`)

Template SDD: `codesa-sdd-templates/templates/backend-java17-sb3/`

## Cuándo aplica

- Microservicios nuevos o ya migrados (ej. `sf-cliente-ms` en arquitectura de referencia).
- OpenAPI con **springdoc-openapi 2.x** (`@Tag`, `@Operation`, `@Schema`).
- Trazabilidad: **Micrometer Tracing + OpenTelemetry** (no Sleuth).
- Namespace **`jakarta.*`** — prohibido `javax.*` en código nuevo.
- Seguridad: **Spring Security 6** (`SecurityFilterChain`; no `WebSecurityConfigurerAdapter`).

## Documentación en codesa-skills

| Tema | Archivo |
|------|---------|
| Stack y diferencias vs SB 2.7 | [TECH_STACK.md](TECH_STACK.md) |
| OpenAPI (springdoc) | [OPENAPI.md](OPENAPI.md) |
| Convenciones específicas | [CONVENTIONS.md](CONVENTIONS.md) |
| Arquitectura en capas (común) | [../../backend/ARCHITECTURE.md](../../backend/ARCHITECTURE.md) |
| Testing (común + notas SB3) | [TESTING.md](TESTING.md) |

## Fuente de verdad en el repo del MS

| Archivo | Ruta |
|---------|------|
| Standards del stack (diff vs SB 2.7) | `codesa-specs/specs/backend-standards.md` |
| Agente IA | `codesa-specs/agents/backend-developer.md` |
| OpenAPI | `codesa-specs/specs/api-spec.yml` |
| Reglas Cline | `.clinerules/backend-java17-sb3.md` (ver [../../cline/rules/backend-java17-sb3.md](../../cline/rules/backend-java17-sb3.md)) |

## Exportar `api-spec.yml`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=localvault
curl -s http://localhost:<puerto>/api-docs.yaml > codesa-specs/specs/api-spec.yml
```

## Instalación

```powershell
.\scripts\install-codesa-sdd.ps1 -Stack backend-java17-sb3 ...
```

## Migración desde SB 2.7

1. Instalar template `backend-java17-sb3` (no mezclar Springfox y springdoc).
2. Reemplazar imports `javax.*` → `jakarta.*`.
3. Reanotar controllers/DTOs según [OPENAPI.md](OPENAPI.md).
4. Actualizar tests de seguridad (`@WebMvcTest` + filtro JWT mock).
5. Regenerar `api-spec.yml` desde `/api-docs.yaml`.

Canonical: `codesa-sdd-templates/templates/backend-java17-sb3/codesa-specs/specs/backend-standards.md`

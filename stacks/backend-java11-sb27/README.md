---
title: Stack backend-java11-sb27
version: 1.0.0
last_updated: 2026-05-25
status: stable
owner: Arquitectura Codesa
applies_to: backend-java11-sb27
type: stack-index
---

# Backend — Java 11 + Spring Boot 2.7 (`backend-java11-sb27`)

Template SDD: `codesa-sdd-templates/templates/backend-java11-sb27/`

## Cuándo aplica

- Mayoría de microservicios Superflex en producción (ej. `sf-venta-ms-core`).
- OpenAPI con **Springfox 3**.
- Trazabilidad: **Spring Cloud Sleuth + Zipkin**.
- Namespace **`javax.*`** (validation, persistence, servlet).

## Documentación en codesa-skills

| Tema | Archivo |
|------|---------|
| Stack y dependencias | [TECH_STACK.md](TECH_STACK.md) |
| OpenAPI (Springfox) | [OPENAPI.md](OPENAPI.md) |
| Arquitectura en capas (común) | [../../backend/ARCHITECTURE.md](../../backend/ARCHITECTURE.md) |
| Convenciones naming (común) | [../../backend/CONVENTIONS.md](../../backend/CONVENTIONS.md) |
| Testing | [../../backend/TESTING.md](../../backend/TESTING.md) |

## Fuente de verdad en el repo del MS

Tras instalar el template:

| Archivo | Ruta |
|---------|------|
| Standards del stack | `codesa-specs/specs/backend-standards.md` |
| Agente IA | `codesa-specs/agents/backend-developer.md` |
| OpenAPI export | `codesa-specs/specs/api-spec.yml` |
| Reglas Cursor | `.cursor/rules/backend-standards.mdc` |

## Exportar `api-spec.yml`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=localvault
curl -s http://localhost:<puerto>/v3/api-docs.yaml > codesa-specs/specs/api-spec.yml
```

## Instalación

```powershell
.\scripts\install-codesa-sdd.ps1 -Stack backend-java11-sb27 ...
```

Ver [piloto backend](https://gitlab.codesa.com.co/arquitectura/ia/codesa-sdd-templates/-/blob/main/docs/piloto-sf-venta-ms-core.md).

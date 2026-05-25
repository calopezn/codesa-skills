---
title: OpenAPI Springfox — backend-java11-sb27
version: 1.0.0
last_updated: 2026-05-25
applies_to: backend-java11-sb27
---

# OpenAPI — Springfox 3 (SB 2.7)

## URLs típicas

| Recurso | Path |
|---------|------|
| Swagger UI | `/swagger-ui.html` |
| OpenAPI YAML | `/v3/api-docs.yaml` |

## Anotaciones obligatorias

| Elemento | Anotación |
|----------|-----------|
| Controller | `@Api` |
| Método | `@ApiOperation`, `@ApiResponses` |
| Parámetro | `@ApiParam` (legacy) o documentar en operation |
| DTO | `@ApiModel`, `@ApiModelProperty` |

## Regla SDD

- Fuente de verdad del contrato: `codesa-specs/specs/api-spec.yml`.
- Si código y spec difieren → **actualizar código o spec en el mismo PR**; no dejar drift.

## Equivalencia al migrar a SB 3

Ver tabla Springfox → springdoc en  
`codesa-sdd-templates/shared/standards/openapi-standards.md` §5  
y [../backend-java17-sb3/OPENAPI.md](../backend-java17-sb3/OPENAPI.md).

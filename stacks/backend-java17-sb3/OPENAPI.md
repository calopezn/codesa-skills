---
title: OpenAPI springdoc — backend-java17-sb3
version: 1.0.0
last_updated: 2026-05-25
applies_to: backend-java17-sb3
---

# OpenAPI — springdoc-openapi 2.x (SB 3)

## URLs típicas

| Recurso | Path |
|---------|------|
| Swagger UI | `/swagger-ui.html` |
| OpenAPI YAML | `/api-docs.yaml` |

## Anotaciones obligatorias

| Elemento | Anotación |
|----------|-----------|
| Controller | `@Tag(name = "...", description = "...")` |
| Método | `@Operation`, `@ApiResponses` |
| Parámetro | `@Parameter` (no `@ApiParam`) |
| DTO / campo | `@Schema` |
| JWT | `@SecurityRequirement(name = "bearerAuth")` |

## Imports típicos

```java
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Schema;
```

## Regla SDD

- Contrato canónico: `codesa-specs/specs/api-spec.yml`.
- Plugin opcional: `springdoc-openapi-maven-plugin` (ver INSTALL.md del template).

## Tabla de migración desde Springfox

| Springfox 3 | springdoc 2 |
|-------------|-------------|
| `@Api` | `@Tag` |
| `@ApiOperation` | `@Operation` |
| `@ApiModel` | `@Schema` (clase) |
| `@ApiModelProperty` | `@Schema` (campo) |
| `@ApiParam` | `@Parameter` |

Detalle: `codesa-sdd-templates/shared/standards/openapi-standards.md`.

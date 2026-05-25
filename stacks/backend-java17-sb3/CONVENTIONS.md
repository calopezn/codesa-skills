---
title: Convenciones backend-java17-sb3
version: 1.0.0
last_updated: 2026-05-25
applies_to: backend-java17-sb3
---

# Convenciones — Java 17 + Spring Boot 3

Las convenciones de **naming, paquetes y capas** son las mismas que en SB 2.7. Ver [../../backend/CONVENTIONS.md](../../backend/CONVENTIONS.md).

Este documento solo lista lo **específico de SB 3**.

## Imports

```java
// Prohibido en código nuevo SB 3
import javax.validation.Valid;
import javax.persistence.Entity;

// Correcto
import jakarta.validation.Valid;
import jakarta.persistence.Entity;
```

## Seguridad (Spring Security 6)

```java
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    // configuración explícita; no extender WebSecurityConfigurerAdapter
    return http.build();
}
```

En `@WebMvcTest`, mockear el filtro JWT del proyecto (equivalente a `JwtAuthenticationFilter` en SB 2.7).

## OpenAPI

Seguir [OPENAPI.md](OPENAPI.md). Prohibido mezclar dependencias Springfox y springdoc en el mismo `pom.xml`.

## Records y Java 17

- Preferir **records** para DTOs inmutables de solo lectura cuando el equipo del MS lo adopte (documentar en ADR del repo si es política local).
- `var` local permitido cuando el tipo sea obvio (ver `java-style-guide.md` del template).

## Trazabilidad

- Propagar `traceId` / `spanId` vía Micrometer Tracing (no Sleuth).
- Logs con correlation id del Gateway (`X-Correlation-Id`).

Canonical: `codesa-sdd-templates/templates/backend-java17-sb3/codesa-specs/specs/backend-standards.md`

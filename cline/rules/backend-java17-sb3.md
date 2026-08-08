<!--
title: Regla Cline — backend-java17-sb3
version: 1.0.0
applies_to: backend-java17-sb3
type: cline-rule
-->

# Stack: backend-java17-sb3

Java 17, Spring Boot 3.x, springdoc-openapi 2.x, Micrometer Tracing + OpenTelemetry (no Sleuth), Spring Security 6, namespace `jakarta.*` — **prohibido `javax.*` en código nuevo**. Microservicios nuevos o migrados.

## Naming

Igual que `backend-java11-sb27` (ver [backend-java11-sb27.md](backend-java11-sb27.md) § Naming) — no cambia entre versiones de Spring Boot.

## No negociable (además de lo común a todo backend)

- `import jakarta.*`, nunca `import javax.*`.
- Seguridad con `SecurityFilterChain` explícito — nunca extender `WebSecurityConfigurerAdapter` (removido en SB3).
- No mezclar dependencias Springfox y springdoc en el mismo `pom.xml`.
- En `@WebMvcTest`, mockear el filtro JWT del proyecto (equivalente a `JwtAuthenticationFilter`).
- `traceId`/`spanId` se propagan vía Micrometer Tracing, no Sleuth.
- Records permitidos para DTOs inmutables de solo lectura si el equipo del MS ya lo adoptó (documentar en ADR si es política local).

## Migración desde backend-java11-sb27

No mezclar templates en el mismo repo. Ver checklist completo en `stacks/backend-java17-sb3/README.md` § Migración.

Detalle completo: [`stacks/backend-java17-sb3/`](../../stacks/backend-java17-sb3/) en el repo `codesa-skills`, o recurso MCP `codesa://stacks/backend-java17-sb3/`.

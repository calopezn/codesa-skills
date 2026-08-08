---
title: TECH_STACK backend-java17-sb3
version: 1.0.0
last_updated: 2026-05-25
applies_to: backend-java17-sb3
---

# Stack técnico — Java 17 + Spring Boot 3

## Diferencias clave vs `backend-java11-sb27`

| Aspecto | SB 2.7 (java11) | SB 3 (java17) |
|---------|-----------------|---------------|
| JDK mínimo | 11 | **17** |
| Persistence / validation | `javax.*` | **`jakarta.*`** |
| OpenAPI | Springfox 3 | **springdoc-openapi 2.5+** |
| Trazabilidad | Sleuth + Zipkin | **Micrometer Tracing + OTLP** |
| Spring Security | 5.x | **6.x** (`SecurityFilterChain`) |
| Oracle en tests | `gvenzl/oracle-xe:11-slim` + ojdbc6 | Mismo patrón; driver **ojdbc8/11** en runtime |
| Actuator / observación | Micrometer 1.x | Observation API |

## Stack completo (template oficial)

| Área | Tecnología |
|------|------------|
| Lenguaje | Java 17 |
| Framework | Spring Boot 3.x |
| OpenAPI | springdoc-openapi-starter-webmvc-ui 2.x |
| Persistencia | JPA/Hibernate 6, `jakarta.persistence` |
| BD | Oracle 19c/21c (ojdbc8/11) |
| Caché | Hazelcast + Caffeine |
| Mensajería | Kafka |
| Integración MS | OpenFeign |
| Discovery / secretos | Consul, Vault |
| Métricas | Micrometer → Prometheus → Grafana |
| Build | Maven, Checkstyle, SpotBugs |
| Tests | JUnit 5, Mockito, `@WebMvcTest`, Testcontainers (sin H2) |

## application.yml — springdoc (referencia)

```yaml
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    try-it-out-enabled: true
    operations-sorter: alpha
    tags-sorter: alpha
```

## Reglas absolutas para agentes IA

- No usar anotaciones Springfox (`@Api`, `@ApiOperation`) en proyectos SB 3.
- No reintroducir `WebSecurityConfigurerAdapter`.
- No usar H2 en pruebas de persistencia.

Ver [CONVENTIONS.md](CONVENTIONS.md) y la regla Cline condensada:  
[`cline/rules/backend-java17-sb3.md`](../../cline/rules/backend-java17-sb3.md).

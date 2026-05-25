---
title: TECH_STACK backend-java11-sb27
version: 1.0.0
last_updated: 2026-05-25
applies_to: backend-java11-sb27
---

# Stack técnico — Java 11 + Spring Boot 2.7

| Área | Tecnología |
|------|------------|
| Lenguaje | Java 11 |
| Framework | Spring Boot 2.7.x |
| Cloud | Spring Cloud 2021.x (Consul, OpenFeign, Sleuth) |
| OpenAPI | Springfox 3 (`springfox-boot-starter`) |
| Persistencia | JPA/Hibernate 5, `javax.persistence` |
| BD | Oracle 11g/19c (ojdbc6/8) |
| Caché | Hazelcast + Caffeine |
| Mensajería | Apache Kafka |
| Secretos | HashiCorp Vault |
| Trazas | Sleuth + Zipkin |
| Métricas | Micrometer → Prometheus |
| Build | Maven, Checkstyle, SpotBugs |
| Tests | JUnit 5, Mockito, `@WebMvcTest`, Testcontainers Oracle 11 |

Detalle ampliado (piloto Superflex): [../../backend/TECH_STACK.md](../../backend/TECH_STACK.md) — sección **Stack A**.

Canonical: `codesa-sdd-templates/templates/backend-java11-sb27/codesa-specs/specs/backend-standards.md`

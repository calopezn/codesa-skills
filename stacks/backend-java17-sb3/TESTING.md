---
title: Testing backend-java17-sb3
version: 1.0.0
last_updated: 2026-05-25
applies_to: backend-java17-sb3
---

# Testing — notas Spring Boot 3

Las reglas generales (AAA, nomenclatura, sin H2, sin `@SpringBootTest` unitario) están en [../../backend/TESTING.md](../../backend/TESTING.md) y en  
`codesa-sdd-templates/shared/standards/testing-standards-backend.md`.

## Específico SB 3

| Tema | SB 2.7 | SB 3 |
|------|--------|------|
| `@WebMvcTest` | Mock `JwtAuthenticationFilter` | Igual: mock del filtro de seguridad del MS |
| JPA tests | `javax.persistence` en entidades de test | Entidades con `jakarta.persistence` |
| Testcontainers Oracle | `gvenzl/oracle-xe:11-slim` | Misma imagen (compatible protocolo con ojdbc del MS) |
| Dialecto Hibernate | `Oracle10gDialect` / equivalente 5.x | Dialecto según versión Hibernate 6 del BOM SB 3 |

## Dependencias de test típicas

- `spring-boot-starter-test` (JUnit 5, AssertJ, Mockito)
- `spring-security-test` para `@WithMockUser`
- `testcontainers-oracle-xe` + JUnit Jupiter extension

## Antipatrones (igual que SB 2.7)

- `@SpringBootTest` en tests unitarios de servicio.
- H2 para validar SQL Oracle (`ROWNUM`, `SYSDATE`, etc.).

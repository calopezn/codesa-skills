---
title: Stack Tecnológico Backend
version: 2.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: tech_stack
---

# Stack Tecnológico — Backend (Java/Spring Boot)

> **Alcance**: Stack tecnológico y herramientas para microservicios Java/Spring Boot en Codesa.
>
> **Dos templates SDD** (elegir uno por repo — ver [STACKS.md](../STACKS.md)):
> - **Stack A** — [backend-java11-sb27](../stacks/backend-java11-sb27/README.md): Java 11, SB 2.7, Springfox 3
> - **Stack B** — [backend-java17-sb3](../stacks/backend-java17-sb3/README.md): Java 17, SB 3, springdoc-openapi 2.x
>
> **Filosofía SDD**: El stack soporta los contratos definidos en specs. Cada tecnología se selecciona para cumplir con los requisitos del design.md.
>
> **Fuente de verdad**: [codesa-sdd-templates](https://gitlab.codesa.com.co/arquitectura/ia/codesa-sdd-templates) — `shared/standards/base-standards.md`, `java-style-guide.md`, y `templates/<stack>/codesa-specs/specs/backend-standards.md`

---

## 0. Stack y SDD

### Herramientas Soportadas por SDD

| Herramienta | Rol en SDD | Stack A (SB 2.7) | Stack B (SB 3) |
|-------------|------------|------------------|----------------|
| **OpenAPI** | Contrato + UI de prueba | Springfox → `/v3/api-docs.yaml` | springdoc → `/api-docs.yaml` |
| **Swagger UI** | Explorar API en dev | `/swagger-ui.html` | `/swagger-ui.html` |
| **MapStruct** | Genera código de mapeo basado en spec de DTOs | Ambos | Ambos |
| **Checkstyle** | Verifica standards del spec | Ambos | Ambos |
| **SpotBugs** | Análisis estático | Ambos | Ambos |
| **SonarQube** | Quality gate del change | Ambos | Ambos |
| **JaCoCo** | Cobertura mínima | Ambos | Ambos |

---

## 1. Frameworks y Librerías Core

> La tabla siguiente describe el **Stack A (piloto legacy)**. Para Stack B ver [stacks/backend-java17-sb3/TECH_STACK.md](../stacks/backend-java17-sb3/TECH_STACK.md).

### Core — Stack A (`backend-java11-sb27`)

| Tecnología | Versión | Propósito | Propiedad SDD |
|-----------|---------|-----------|---------------|
| **Spring Boot** | 2.7.8 | Framework principal de aplicación | Define estructura del MS |
| **Spring Cloud** | 2021.0.5 | Microservicios (discovery, config, tracing) | Integración entre bounded contexts |
| **Java** | 11 | Lenguaje de programación | Tipado estricto (base-standards) |

### Core — Stack B (`backend-java17-sb3`) — resumen

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Spring Boot** | 3.x | Framework principal |
| **Java** | 17 | Lenguaje (mínimo JDK 17) |
| **springdoc-openapi** | 2.5+ | OpenAPI 3 |
| **Micrometer Tracing** | BOM SB 3 | Trazas (reemplaza Sleuth) |
| **Spring Security** | 6.x | JWT / Resource Server |

### Spring Boot Starters

| Dependencia | Propósito |
|------------|-----------|
| `spring-boot-starter-web` | API REST |
| `spring-boot-starter-data-jpa` | ORM y acceso a datos |
| `spring-boot-starter-data-rest` | Exposición automática de repositorios como REST |
| `spring-boot-starter-security` | Autenticación y autorización |
| `spring-boot-starter-actuator` | Health checks y métricas |
| `spring-boot-starter` | Dependencias core de Spring Boot |

### Spring Cloud

| Dependencia | Propósito |
|------------|-----------|
| `spring-cloud-starter-consul-discovery` | Service discovery (Consul) |
| `spring-cloud-starter-openfeign` | Cliente HTTP declarativo |
| `spring-cloud-starter-sleuth` | Trazabilidad distribuida |
| `spring-cloud-sleuth-zipkin` | Exportación de traces a Zipkin |
| `spring-cloud-vault-config` | Integración con HashiCorp Vault |

---

## 2. Base de Datos y ORM

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Oracle JDBC** | 21.5.0.0 | Driver de conexión a Oracle |
| **Spring Data JPA** | Incluido en 2.7.8 | ORM y acceso a datos |
| **MapStruct** | 1.4.2.Final | Mapeo automático entre entidades y DTOs |
| **H2** | Incluido | Base de datos en memoria para tests |
| **Testcontainers Oracle XE** | 1.15.2 | Oracle para tests de integración |

### Consultas

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| **Spring Data JPA method naming** | Consultas simples | `findBy*`, `countBy*` |
| **JPQL** | Consultas complejas | `@Query("SELECT t FROM Turno t WHERE t.estado = :estado")` |
| **Native SQL** | Consultas nativas | `@Query(nativeQuery = true, value = "...")` |

---

## 3. Seguridad y Autenticación

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Spring Security** | Incluido | Autenticación y autorización |
| **JJWT (jsonwebtoken)** | 0.11.2 | Generación y validación de JWT |
| **Spring Vault Core** | 2.3.2 | Gestión de secretos |
| **Vault Java Driver** | 5.1.0 | Driver nativo de Vault |
| **sf-util-seguridad** | 2.0.34 | Utilidades de seguridad internas de Codesa |

---

## 4. Mensajería y Cache

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Spring Kafka** | Incluido | Mensajería asíncrona |
| **Caffeine** | Incluido | Cache local |
| **Hazelcast** | Incluido | Cache distribuido |

### Eventos de Dominio

- **Nombramiento en pasado**: `ClienteRegistrado`, `PagoProcesado`, `ApuestaAnulada`
- **Contrato definido en spec**: Cada evento debe tener su contrato en `api-spec.yml` o en un spec de mensaje separado

---

## 5. Logging y Monitoreo

| Tecnología | Versión | Propósito | Propiedad SDD |
|-----------|---------|-----------|---------------|
| **Logback Classic** | 1.2.3 | Framework de logging | Observabilidad desde el día uno |
| **Logstash Logback Encoder** | 6.6 | Logging estructurado para ELK | Logs JSON estructurados |
| **Micrometer + Prometheus** | Incluido | Métricas para monitoreo | Métricas de dominio en spec |
| **Spring Boot Actuator** | Incluido | Health checks y endpoints de métricas | Health check obligatorio |
| **OpenTelemetry** | 1.20.1 | Observabilidad | Traces distribuidos |

---

## 6. API Documentation

| Stack | Librería | Doc skills |
|-------|----------|------------|
| A — SB 2.7 | Springfox 3 | [stacks/backend-java11-sb27/OPENAPI.md](../stacks/backend-java11-sb27/OPENAPI.md) |
| B — SB 3 | springdoc-openapi 2.x | [stacks/backend-java17-sb3/OPENAPI.md](../stacks/backend-java17-sb3/OPENAPI.md) |

### Relación con SDD

- La **fuente de verdad** es `codesa-specs/specs/api-spec.yml`, no la UI de Swagger.
- Si hay discrepancia entre UI generada y `api-spec.yml` → alinear en el mismo PR.

---

## 7. Utilidades

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Lombok** | Incluido | Reducción de boilerplate (@Data, @Builder, etc.) |
| **Apache Commons Lang3** | 3.12.0 | Utilidades de texto y objetos |
| **Joda-Time** | 2.10.13 | Manejo de fechas (pre-java.time) |
| **OkHttp** | Incluido | Cliente HTTP |
| **Jackson Dataformat XML** | Incluido | Serialización/deserialización XML |
| **Reflections** | 0.9.12 | Reflexión para escaneo de clases |
| **Java Snapshot Testing (JUnit 5)** | 3.2.5 | Tests snapshot |

---

## 8. Librerías Internas de Codesa/Superflex

| Librería | Versión | Propósito |
|---------|---------|-----------|
| `sf-util-core` | 2.0.37 | Utilidades core del framework Superflex |
| `sf-util-db-persistencia` | 2.0.1999 | Utilidades de persistencia |
| `sf-util-db-oracle` | 2.0.6 | Utilidades específicas para Oracle |
| `sf-util-vault` | 0.0.2 | Utilidades para integración con Vault |
| `sf-util-trazabilidad` | 2.0.18 | Utilidades de trazabilidad |
| `sf-clientes-feign` | 2.0.577 | Cliente Feign para microservicio de clientes |
| `sf-comun-dtos` | 2.0.739 | DTOs comunes compartidos entre microservicios |
| `sf-admin-comun-dtos` | 2.0.263 | DTOs de administración compartidos |

---

## 9. Herramientas de Testing

| Tecnología | Versión/Propósito |
|-----------|------------------|
| **JUnit 5** | Framework principal de tests |
| **Spring Boot Test** | `@SpringBootTest`, `@WebMvcTest`, `@DataJpaTest` |
| **Mockito** | Mocking de dependencias |
| **Testcontainers** | Oracle XE (`gvenzl/oracle-xe:11-slim`) — **obligatorio** para tests de persistencia; **no H2** |
| **Java Snapshot Testing** | 3.2.5 | Tests snapshot para comparar resultados |
| **Kafka Test** | `spring-kafka-test` para tests de mensajería |

### Estructura de Tests

| Aspecto | Detalle |
|---------|---------|
| **Carpeta** | `src/test/java/co/com/codesa/superflex/ms/core/` |
| **Naming** | `*Test.java` → `TurnosControllerTest.java` |
| **Tests de controller** | `ValidaHoraControllerTest`, `UtilsControllerTest`, `TurnosControllerTest`, etc. |
| **Tests de DAO** | `MensajeInformacionDAOImplTest` |

---

## 10. Herramientas de Build y Gestión de Dependencias

| Tecnología | Versión/Propósito |
|-----------|------------------|
| **Maven** | Gestor de dependencias y build |
| **spring-boot-maven-plugin** | Empaquetado como executable JAR |
| **maven-compiler-plugin** | 3.8.1 | Compilación con Java 11 |
| **maven-dependency-plugin** | Desempaquetado del artifact durante package |
| **spring-banner-plugin** | 1.3 | Generación de banner de arranque |
| **spotbugs-maven-plugin** | 4.2.0 | Análisis estático de bugs |
| **maven-checkstyle-plugin** | 3.0.0 | Verificación de estilo de código |
| **dockerfile-maven-plugin** | 1.4.13 | Construcción de imágenes Docker |

### Perfiles Maven

| Perfil | Descripción |
|--------|-------------|
| **docker** | Construye imagen Docker (no activo por defecto) |
| **fast-build** | Skip de checkstyle, spotbugs y tests (no activo por defecto) |

### Repositorios

| Repositorio | URL |
|-------------|-----|
| **Spring Milestones** | `https://repo.spring.io/milestone` |
| **Spring Snapshots** | `https://repo.spring.io/snapshot` |
| **Nexus interno** | `harbordt.codesa.com.co` (para librerías internas y Docker images) |

---

## 11. Checklist SDD para Stack Tecnológico

Al seleccionar tecnologías para un change SDD:

- [ ] **design.md** justifica la selección de tecnologías
- [ ] Las tecnologías seleccionadas soportan los contratos del spec
- [ ] Las dependencias nuevas pasan los quality gates de SonarQube
- [ ] Las dependencias nuevas no introducen CVEs críticos
- [ ] Las herramientas de testing soportan los criterios de aceptación
---
title: Arquitectura Backend
version: 2.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: architecture
---

# Arquitectura — Backend (Java/Spring Boot)

> **Alcance**: Arquitectura y patrones de diseño para microservicios Java/Spring Boot en Codesa.
>
> **Filosofía SDD**: La arquitectura se define en `design.md` ANTES de la implementación. Los cambios arquitectónicos requieren ADR.
>
> **Fuente de verdad**: [codesa-sdd-templates](https://gitlab.codesa.com.co/arquitectura/ia/codesa-sdd-templates) — `shared/standards/base-standards.md`, `docs/architecture.md`

---

## 0. Arquitectura SDD (Spec-Driven)

### Principio Fundamental

```
Arquitectura definida en specs → Código implementa specs → Code review verifica compliance
```

### Artefactos Arquitectónicos SDD

| Artefacto | Propósito | Ubicación |
|-----------|-----------|-----------|
| `design.md` | Decisiones técnicas del change | `openspec/changes/<ticket>/design.md` |
| `api-spec.yml` | Contrato API del microservicio | `codesa-specs/specs/api-spec.yml` |
| `data-model.md` | Modelo de datos | `codesa-specs/specs/data-model.md` |
| `ADR-XXXX-*.md` | Decisiones arquitectónicas | `codesa-specs/specs/adrs/` |
| Diagrama C4 | Vista del sistema | `codesa-specs/specs/architecture.md` |

---

## 1. Arquitectura Identificada

### Layered Architecture con Módulos Verticales (DDD-Lite)

**No es Clean Architecture/Hexagonal pura** — es una adaptación práctica con:

1. **Capas horizontales claras**:
   - `controllers/` → capa de presentación/API
   - `services/` → capa de negocio
   - `persistencia/` + `repository/` → capa de datos
   - `dto/` → capa de transferencia
   - `models/` → capa de entidad

2. **Módulos verticales por bounded context**:
   ```
   turnos/
   ├── controller/
   ├── services/
   ├── persistencia/
   ├── dto/
   ├── mapper/
   └── converter/
   ```

3. **No es hexagonal pura**: No hay puertos/adaptadores explícitos. La dependencia fluye de forma tradicional: Controller → Service → DAO/Repository → BD

---

## 2. Capas del Microservicio

### Responsabilidad de Cada Capa

| Capa | Responsabilidad | Regla SDD |
|------|-----------------|-----------|
| **controllers/** | Solo orquesta. Recibe → valida básico → delega → retorna. | Los endpoints del controller deben coincidir con el spec OpenAPI |
| **services/** | Lógica de negocio. Interfaces definen contratos. | La lógica debe cumplir los criterios de aceptación del proposal.md |
| **persistencia/** | Acceso directo a BD. Implementación de DAOs. | El modelo de datos debe coincidir con data-model.md |
| **repository/** | Interfaces Spring Data JPA. | Consultas nombradas siguiendo convenciones JPA |
| **dto/** | Transferencia entre capas y con frontend. | DTOs compatibles con spec OpenAPI |
| **models/** | Entidades JPA mapeadas a tablas. | Entidades reflejan el dominio del bounded context |

---

## 3. Patrones de Diseño

### Patrones Detectados en el Código

| Patrón | Dónde | Evidencia | Propósito SDD |
|--------|-------|-----------|---------------|
| **Strategy** | Servicios | `TurnosService` (interface) + `TurnosServiceImpl` | Permite cambiar implementación sin cambiar contrato API |
| **DAO** | Persistencia | `TurnosDAO` / `TurnosDAOImpl` | Abstrae acceso a datos del contrato API |
| **DTO** | Transferencia | `RegistrarTurnosRequest`, `TurnoResponseDTO` | Separa entidad interna del contrato público |
| **Mapper** | Conversión | MapStruct: `MultiMonedaMapper` | Conversión automática entidad↔DTO |
| **Factory** | Configuración | `spring/factory/config/` | Creación centralizada de beans |
| **Singleton** | Spring Beans | `@Service`, `@Controller`, `@Repository` | Gestión de ciclo de vida por Spring |
| **Template Method** | Repositorios | Hereda de `JpaRepository` | Métodos genéricos: `save()`, `findById()`, `findAll()` |
| **DI** | Todos los beans | Constructor con `@RequiredArgsConstructor` + `final` | Inversión de control para testing y flexibilidad |

---

## 4. Flujo de una Request (SDD-Aligned)

```
1. Spec OpenAPI definido (ANTES del código) ← SDD: api-spec.yml
2. Proposal aprobado ← SDD: proposal.md
3. Cliente (Frontend Angular)
   ↓ HTTP POST/GET/PUT/DELETE
4. Controller (@RestController)
   - Recibe la petición
   - Valida inputs básicos (@Valid)
   - Delega al Service
   ↓
5. Service Interface (*Service.java)
   - Define el contrato ← SDD: spec.md capability
   ↓
6. Service Implementation (*ServiceImpl.java)
   - Lógica de negocio
   - Puede llamar a otros servicios (Feign)
   ↓
7. DAO Implementation (*DAOImpl.java) o Repository
   - Acceso directo a datos
   ↓
8. Database (Oracle)
   ↓
9. Response: BD → Repository/DAO → Service → Controller → JSON al Frontend
```

**Verificación SDD**: Cada paso del flujo debe ser verificable contra los artefactos SDD.

---

## 5. Inyección de Dependencias

| Aspecto | Detalle |
|---------|---------|
| **Framework** | Spring Boot (Spring IoC) |
| **Mecanismo** | Constructor con `@RequiredArgsConstructor` + `final` |
| **Scopes** | Singleton (por defecto para beans de Spring) |
| **Configuración** | Clases `@Configuration` en `configurations/` |
| **Propiedades** | `application.yml` o `application.properties` |

---

## 6. Transacciones

| Aspecto | Detalle |
|---------|---------|
| **Framework** | Spring Transaction Management (`@Transactional`) |
| **Propagación** | Por defecto `REQUIRED` |
| **Aislamiento** | Por defecto del motor de BD (Oracle) |
| **Rollback** | Automático en `RuntimeException` |
| **Regla SDD** | Los criterios de aceptación del proposal.md definen comportamiento transaccional |

---

## 7. Integraciones Externas

### Integraciones del Microservicio

| Integración | Propósito | Propiedad SDD |
|-------------|-----------|---------------|
| **Spring Cloud OpenFeign** | Cliente HTTP para otros MS | Contrato definido en spec |
| **Spring Kafka** | Mensajería asíncrona | Contrato de mensaje definido en spec |
| **Spring Vault** | Gestión de secretos | Configuración en design.md |
| **Spring Cloud Consul** | Service discovery | Configuración en design.md |
| **Spring Cloud Sleuth + Zipkin** | Trazabilidad distribuida | Observabilidad desde el día uno |
| **Micrometer + Prometheus** | Métricas y monitoreo | Métricas de dominio en spec |
| **Hazelcast** | Cache distribuido | Estrategia de caché en design.md |
| **JWT (JJWT)** | Autenticación sin estado | Contrato de token en spec |

### Microservicios Externos

| Servicio | Propósito |
|----------|-----------|
| `sf-clientes-feign` | Microservicio de clientes |
| `sf-comun-dtos` | DTOs comunes compartidos |
| `sf-admin-comun-dtos` | DTOs de administración compartidos |

---

## 8. Abstracciones Clave

| Patrón | Abstrae | Propósito SDD |
|--------|---------|---------------|
| **Feign Clients** | Llamar HTTP a otros MS | Contrato de integración definido en spec |
| **Repository Pattern** | Acceso a BD | Implementación oculta al contrato API |
| **DAO Pattern** | Lógica de acceso a datos | Separación de responsabilidades |
| **DTO Pattern** | Estructura interna de entidades | Contrato público estable |

---

## 9. Checklist SDD para Arquitectura

Antes de iniciar cualquier cambio arquitectónico:

- [ ] **design.md** describe las alternativas arquitectónicas consideradas
- [ ] **Diagrama C4** actualizado si hay cambios en la estructura del sistema
- [ ] **ADR** creado si la decisión es relevante para otros equipos/proyectos
- [ ] **api-spec.yml** actualizado con los nuevos endpoints/contratos
- [ ] **data-model.md** actualizado si hay cambios de entidad/tabla
- [ ] **proposal.md** incluye impacto arquitectónico del cambio
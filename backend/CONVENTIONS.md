---
title: Convenciones y Contratos Backend
version: 2.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: convention
---

# Convenciones y Contratos — Backend (Java/Spring Boot)

> **Alcance**: Convenciones de código y contratos API para microservicios Java/Spring Boot en Codesa.
>
> **Filosofía SDD**: Contrato primero, luego código. Cada cambio significativo debe tener un change OpenSpec con `proposal.md`, `design.md` y `tasks.md`.
>
> **Fuente de verdad**: `codesa-sdd-templates/shared/standards/base-standards.md`, `openapi-standards.md`, `backend-standards.md`

---

## 0. Contrato Primero (API-First)

### Regla Fundamental

```
ANTES de escribir cualquier línea de código:
1. Spec OpenAPI actualizado (api-spec.yml o capability spec)
2. Data model definido (data-model.md)
3. Proposal aprobado (proposal.md)
4. Design técnico escrito (design.md)
5. Tasks desglosadas (tasks.md)
```

### Ubicación de Contratos

```
<repo>/
├── codesa-specs/
│   ├── specs/
│   │   ├── api-spec.yml              ← OpenAPI 3.0 del microservicio
│   │   ├── data-model.md             ← Modelo de datos
│   │   ├── backend-standards.md      ← SB 2.7 o SB 3 (según template instalado)
│   │   ├── base-standards.md
│   │   ├── testing-standards-backend.md
│   │   ├── openapi-standards.md
│   │   └── adrs/
│   └── agents/
│       └── backend-developer.md
├── openspec/
│   ├── config.yaml
│   └── changes/<ticket>/
│       ├── proposal.md
│       ├── design.md
│       ├── specs/                    ← delta specs (opcional)
│       └── tasks.md
└── .codesa/config/                   ← solo Checkstyle / SpotBugs (no specs)
```

**Template por stack:** `backend-java11-sb27` (Springfox) o `backend-java17-sb3` (springdoc). Ver [STACKS.md](../STACKS.md).

### Reglas de Contrato

1. **Cada endpoint debe estar en el spec ANTES de la implementación**
2. **Los DTOs deben ser compatibles con el spec OpenAPI**
3. **Los eventos de dominio se nombran en pasado**: `ClienteRegistrado`, `PagoProcesado`, `ApuestaAnulada`
4. **Los cambios de API breaking requieren ADR**
5. **El spec es la fuente de verdad** — si el código no cumple el spec, el spec es correcto

---

## 1. Convenciones de Naming

### Paquete Raíz (Genérico para Todos los Proyectos)

```
co.com.codesa.<proyecto>.<dominio>.<ms>
```

| Proyecto | Ejemplo de Paquete Raíz |
|----------|------------------------|
| Superflex | `co.com.codesa.superflex.ms.core` |
| Otro proyecto | `co.com.codesa.otroproyecto.dominio.ms` |

### Clases

| Responsabilidad | Sufijo | Ejemplo |
|-----------------|--------|---------|
| Controladores | `*Controller.java` | `TurnosController`, `MedioPagoController` |
| Servicios (interface) | `*Service.java` | `TurnosService`, `SesionTokenService` |
| Servicios (implementación) | `*ServiceImpl.java` | `TurnosServiceImpl`, `SesionTokenServiceImpl` |
| DAOs (interface) | `*DAO.java` | `TurnosDAO`, `SesionTokenDAO` |
| DAOs (implementación) | `*DAOImpl.java` | `TurnosDAOImpl`, `SesionTokenDAOImpl` |
| Repositorios Spring Data | `*Repository.java` | `TurnosRepository` |
| DTOs | `*DTO.java` | `VentaDTO`, `PapeleriaDTO` |
| DTOs Request | `*Request.java` o `*RequestDTO.java` | `RegistrarTurnosRequest` |
| DTOs Response | `*ResponseDTO.java` | `TurnoResponseDTO` |
| Entidades JPA | Nombre de dominio | `DiaSemana`, `Cliente` |
| Mappers MapStruct | `*Mapper.java` | `MultiMonedaMapper` |
| Excepciones | `*Exception.java` | `NegocioException`, `NotFoundException` |

### Métodos

- **camelCase**, verbos de acción en presente
- **En español** cuando el proyecto ya lo está: `consultarTurnos()`, `registrarTurnos()`, `validarHora()`
- Métodos privados/auxiliares: `obtenerParametrosIniciales()`, `procesarResultado()`

### Variables

- **camelCase** estándar Java
- Constantes: `UPPER_SNAKE_CASE`
- Variables en español cuando el proyecto ya lo está: `turno`, `codigo`, `parametros`

### Archivos y Carpetas

| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Clases Java | `PascalCase.java` | `TurnosController.java` |
| Paquetes/Carpets | `lowercase` | `co.com.codesa.superflex.ms.core.turnos` |
| Recursos | `kebab-case` | `application-dev.yml` |

---

## 2. Estructura de Paquetes

### Estructura Horizontal (por capa)

```
co.com.codesa.superflex.ms.core/
├── MsVentaCoreApplication.java          # @SpringBootApplication
├── controllers/                         # @RestController
├── services/                            # @Service interfaces
├── persistencia/                        # DAOs (*DAO.java / *DAOImpl.java)
├── repository/                          # Spring Data JPA repositories
├── dto/
│   ├── request/                         # DTOs de entrada
│   └── response/                        # DTOs de salida
├── models/                              # Entidades JPA
├── mappers/                             # MapStruct mappers
├── exceptions/                          # Excepciones personalizadas
└── configurations/                      # @Configuration classes
```

### Estructura Vertical (por módulo/bounded context)

```
turnos/
├── controller/
├── services/
├── persistencia/
├── dto/
├── mapper/
└── converter/
```

### Responsabilidad de Cada Capa

1. **controllers/**: Solo orquesta. Recibe → valida básico → delega → retorna. Sin lógica de negocio.
2. **services/**: Lógica de negocio. Interfaces definen contratos.
3. **persistencia/**: Acceso directo a BD. Implementación de DAOs.
4. **repository/**: Interfaces Spring Data JPA.
5. **dto/**: Transferencia entre capas y con frontend.
6. **models/**: Entidades JPA mapeadas a tablas.
7. **mappers/**: Conversión entidad↔DTO (MapStruct).

---

## 3. Convenciones de API REST

### Verbos HTTP Semánticos

| Método | Uso | Ejemplo de Método |
|--------|-----|-------------------|
| `GET` | Consultar/obtener | `consultarTurnos()`, `obtenerCodigoToken()` |
| `POST` | Registrar/crear | `registrarTurnos()`, `crearApuesta()` |
| `PUT` | Actualizar | `actualizarTurno()`, `editarConfiguracion()` |
| `DELETE` | Eliminar | `eliminarTurno()` |

### Códigos HTTP

| Código | Uso | Ejemplo |
|--------|-----|---------|
| `200 OK` | Éxito | Consulta exitosa |
| `201 Created` | Recurso creado | `POST` exitoso |
| `204 No Content` | Éxito sin contenido | `DELETE` exitoso |
| `400 Bad Request` | Validación fallida | DTO inválido |
| `404 Not Found` | Recurso no existe | ID no encontrado |
| `409 Conflict` | Conflicto de negocio | Turno ya existe |
| `500 Internal Server Error` | Error del servidor | Excepción no manejada |

### Formato de Respuesta

- **JSON** como formato estándar
- **DTOs** como respuesta, nunca entidades JPA directamente
- **Clases wrapper** para estandarizar respuestas de error (si existen en el proyecto)

---

## 4. Convenciones de Idioma

| Elemento | Idioma | Ejemplo |
|----------|--------|---------|
| Paquetes y clases (responsabilidad) | Inglés técnico | `Controller`, `Service`, `DAO` |
| Entidades y DTOs (dominio) | Español | `Turnos`, `ConfiguraEmpresa` |
| Métodos | Español (cuando proyecto lo está) | `consultarTurnos`, `registrarTurnos` |
| Comentarios y Javadoc | Español | `// Consulta los turnos activos` |
| Variables | Español (cuando proyecto lo está) | `turno`, `codigo`, `parametros` |
| Configuraciones | Inglés | `spring.datasource.url` |

---

## 5. Comentarios y Documentación

### Javadoc

- **En español** para clases y métodos públicos no triviales
- Explicar el **"por qué"**, no el "qué"

```java
// BAD: comenta lo obvio
// incrementa el contador
counter++;

// GOOD: explica la razón no evidente
// SFV-1234: el backend legacy espera contador 1-indexed, no 0-indexed
counter++;
```

### Código Comentado

- **No dejar código comentado en `main`**
- Si se quiere preservar: `// TODO [ticket]: reactivar cuando…`
- O eliminarlo directamente (el historial git lo conserva)

---

## 6. Manejo de Excepciones

### Excepciones del Core Corporativo

- `NegocioException` — Reglas de negocio violadas
- `NotFoundException` — Recurso no encontrado
- `ConflictException` — Conflicto de datos

### Reglas

1. **`@Transactional(rollbackFor = Exception.class)`** en métodos que escriben
2. **`@Transactional(readOnly = true)`** en métodos que solo leen
3. **NO hay `@Transactional` en `@Repository`**
4. **No hay `catch (Exception e)` genérico** sin justificación
5. **Mensajes de excepción con clave i18n** + contexto serializable
6. **NO hay `RuntimeException` genéricas** sin clave i18n

---

## 7. Patrones de Diseño Detectados

| Patrón | Dónde | Evidencia |
|--------|-------|-----------|
| **Strategy** | Servicios | `TurnosService` (interface) + `TurnosServiceImpl` |
| **DAO** | Persistencia | `TurnosDAO` / `TurnosDAOImpl` |
| **DTO** | Transferencia | `RegistrarTurnosRequest`, `TurnoResponseDTO` |
| **Mapper** | Conversión | MapStruct: `MultiMonedaMapper` |
| **Factory** | Configuración | `spring/factory/config/` |
| **Singleton** | Spring Beans | `@Service`, `@Controller`, `@Repository` |
| **Template Method** | Repositorios | Hereda de `JpaRepository` |
| **Dependency Injection** | Todos los beans | Constructor con `@RequiredArgsConstructor` + `final` |

---

## 8. Flujo de una Request (SDD-Aligned)

```
1. Spec OpenAPI definido (ANTES del código) ← SDD
2. Proposal aprobado ← SDD
3. Cliente (Frontend Angular)
   ↓ HTTP POST/GET/PUT/DELETE
4. Controller (@RestController)
   - Recibe la petición
   - Valida inputs básicos (@Valid)
   - Delega al Service
   ↓
5. Service Interface (*Service.java)
   - Define el contrato
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

---

## 9. Checklist SDD para Backend

Antes de iniciar cualquier implementación backend:

- [ ] **Spec OpenAPI** actualizado con los nuevos endpoints
- [ ] **Data model** actualizado si hay cambios de entidad
- [ ] **proposal.md** escrito y aprobado
- [ ] **design.md** escrito con alternativas consideradas
- [ ] **tasks.md** desglosado en tareas ≤ 2 horas cada una
- [ ] **Step 0** de tasks.md: Crear rama `feature/[ticket]-backend`
- [ ] **ADR** si hay cambio arquitectónico
- [ ] **Agente IA** configurado con `backend-developer.md`
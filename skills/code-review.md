---
title: Code Review
version: 3.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: skill
---

# Code Review — Skills de Codesa

> **Alcance**: Cuando un desarrollador solicite revisar código, debes ejecutar este skill. Aplica a todos los proyectos Codesa (backend Java/Spring Boot y frontend Angular).
>
> **Versión**: 3.0.0 — Alineado con `codesa-sdd-templates` y referenciando [obra/superpowers](https://github.com/obra/superpowers)
> **Fuente de verdad**: `codesa-sdd-templates/shared/standards/base-standards.md`, `java-style-guide.md`, `typescript-style-guide.md`, `testing-standards-backend.md`, `testing-standards-frontend.md`

---

## 0. Referencia: Superpowers

### Repositorio de Referencia

[obra/superpowers](https://github.com/obra/superpowers) es un repositorio de "superpowers" — skills y herramientas para mejorar la productividad de desarrollo con agentes IA.

### Skill de Code Review en superpowers

El skill de code review de superpowers se enfoca en revisión general de código. El skill de Codesa extiende este concepto con:

- Standards específicos de Codesa (naming, arquitectura, seguridad)
- Verificación de compliance con specs OpenSpec
- Antipatrones documentados en `codesa-sdd-templates`
- Checklist SDD por template: [STACKS.md](../STACKS.md) y carpeta `stacks/<template>/`

### Integración con SDD

El code review verifica que la implementación cumple con los contratos definidos en SDD:

```
Code Review Workflow:
  proposal.md → design.md → spec.md → code-review → verification
```

---

## 1. Revisar en Este Orden

### 1.1 Correctitud (¿El código hace lo que debería?)

- [ ] La lógica de negocio es correcta
- [ ] Los datos se mapean correctamente entre entidades y DTOs
- [ ] Las validaciones cubren todos los casos necesarios
- [ ] Las excepciones se lanzan en los casos adecuadas
- [ ] No hay lógica duplicada
- [ ] Si hay un change OpenSpec asociado, el código cumple con lo definido en `proposal.md` y `design.md`

### 1.2 Seguridad (¿El código es seguro?)

- [ ] No hay credenciales hardcodeadas
- [ ] No hay SQL injection (usar parámetros preparados, no concatenación)
- [ ] No hay exposición de datos sensibles en logs o respuestas
- [ ] La autenticación/autorización se verifica en endpoints sensibles
- [ ] No hay JWT tokens expuestos en URLs o logs
- [ ] Si hay PII en logs, está enmascarado (`****1234` para tarjetas)

### 1.3 Performance (¿El código es eficiente?)

- [ ] No hay N+1 queries (usar JOIN FETCH en JPQL)
- [ ] No hay bucles innecesarios
- [ ] Las consultas a BD están optimizadas (índices, paginación)
- [ ] No hay carga innecesaria de datos (select columns específicas)
- [ ] El caching se usa apropiadamente (Caffeine, Hazelcast)
- [ ] No hay `Thread.sleep()` para sincronización

### 1.4 Legibilidad (¿El código es fácil de entender?)

- [ ] Los nombres de variables y métodos son descriptivos
- [ ] El código sigue las convenciones de Codesa (standards)
- [ ] Hay comentarios en español para lógica compleja (explican el "por qué", no el "qué")
- [ ] No hay código duplicado
- [ ] Las funciones/métodos son pequeños y con una sola responsabilidad (< 30 líneas servicio, < 300 líneas clase)

---

## 2. Qué Patrones Verificar Específicamente

### Backend (Java + Spring Boot)

#### Naming

- [ ] Controladores: `*Controller.java`
- [ ] Servicios: `*Service.java` (interface) y `*ServiceImpl.java` (implementación)
- [ ] DTOs: `*DTO.java`, `*Request.java`, `*Response.java`, separados en `request/` y `response/`
- [ ] DAOs: `*DAO.java` y `*DAOImpl.java`
- [ ] Repositorios Spring Data: `*Repository`
- [ ] Mappers: `*Mapper.java` (MapStruct)
- [ ] Métodos en español cuando el proyecto ya lo está: `consultarTurnos()`, no `getTurnos()`

#### Arquitectura (Clean Architecture / Hexagonal)

- [ ] La lógica de negocio está en Services, NO en Controllers
- [ ] Los Controllers solo orquestan: reciben → delegan → retornan
- [ ] Se usan DTOs, NO entidades JPA directamente en Controllers
- [ ] Se usa MapStruct para mapeo entidad-DTO, no conversiones manuales
- [ ] Los DAOs/Repositories abstraen el acceso a datos
- [ ] Un MS no comparte BD con otro MS
- [ ] Los eventos de dominio se nombran en pasado: `ClienteRegistrado`, `PagoProcesado`

#### Inyección de Dependencias

- [ ] Inyección por constructor con `@RequiredArgsConstructor` + `final`
- [ ] NO hay `@Autowired` en campos ni setters

#### Transacciones

- [ ] `@Transactional` solo en `*ServiceImpl`
- [ ] Métodos que escriben: `@Transactional(rollbackFor = Exception.class)`
- [ ] Métodos que solo leen y navegan LAZY: `@Transactional(readOnly = true)`
- [ ] NO hay `@Transactional` en `@Repository`

#### Excepciones

- [ ] Se usan excepciones del core corporativo (`NegocioException`, `NotFoundException`, etc.)
- [ ] No hay `RuntimeException` genéricas sin clave i18n
- [ ] No hay `catch (Exception e)` genérico sin justificación
- [ ] Mensajes de excepción con clave i18n + contexto serializable

#### Optional

- [ ] `Optional<T>` solo para tipos de retorno, NO en parámetros ni campos
- [ ] No hay `List<Optional<T>>`

#### Streams

- [ ] `Stream` para transformar/filtrar sin efectos secundarios
- [ ] `for` para efectos laterales o con `break`/`continue`
- [ ] No hay `forEach` con lógica larga (usar `for`)
- [ ] No hay `.peek()` para efectos laterales

#### Lombok

- [ ] `@RequiredArgsConstructor` para servicios/DAOs con dependencias
- [ ] `@Data` NO en entidades JPA
- [ ] `@Getter`/`@Setter` solo en DTOs simples
- [ ] Entidades JPA tienen `equals/hashCode` explícitos basados en PK

#### Null-safety

- [ ] Interfaces con `@Nullable`/`@NonNull` de Spring
- [ ] No hay `any` en TypeScript sin justificación

#### Logs

- [ ] SLF4J con placeholders (`{}`), no concatenación
- [ ] NO hay `System.out.println()` ni `console.log()`
- [ ] Exception al final del mensaje de error, sin `{}`
- [ ] No hay PII en logs

#### Constantes

- [ ] No hay magic numbers ni magic strings
- [ ] Constantes en `UPPER_SNAKE_CASE` o en clases `*Constants`

#### Colecciones

- [ ] Se devuelven interfaces (`List<T>`, `Set<T>`), no implementaciones
- [ ] No hay `null` como colección (devolver `List.of()` o `Collections.emptyList()`)

#### Java.time

- [ ] Se usa `java.time.*` (`LocalDateTime`, `Instant`), NO `new Date()` ni `SimpleDateFormat`

#### Paquete raíz

- [ ] Patrón: `co.com.codesa.<proyecto>.<dominio>.<ms>`

### Frontend (Angular + TypeScript)

#### Naming

- [ ] Componentes: `*Component.ts`
- [ ] Servicios: `*Service.ts`
- [ ] Pipes: `*Pipe.ts`
- [ ] Carpentas de features: kebab-case (`carro-compras`, no `carroCompras`)
- [ ] Archivos: `kebab-case.component.ts`

#### Arquitectura

- [ ] La lógica de negocio está en Services, NO en Components
- [ ] Los Components solo presentan datos y manejan eventos
- [ ] Se usan Reactive Forms para formularios complejos
- [ ] Se usan Observables para datos asíncronos
- [ ] No hay HTTP calls directamente en Components
- [ ] No hay código inline en templates cuando debería estar en el component

#### Enums y tipos

- [ ] Se usan `enums` en lugar de magic strings
- [ ] `Record<Enum, X>` para mapeos exhaustivos
- [ ] No hay `any` sin justificación

#### Programación funcional

- [ ] `.map()`, `.filter()`, `.reduce()` sobre bucles `for` para transformaciones
- [ ] Early return / Guard clauses en lugar de pirámide de `if`

#### Nullish coalescing

- [ ] `??` para `null`/`undefined`
- [ ] `||` solo cuando se quieran tratar `0`, `''`, `false` como default

#### Scope de variables

- [ ] Variables locales con `const`/`let` por defecto
- [ ] Solo `this.x` si se comparte entre métodos o se usa en template

#### HTTP Interceptors

- [ ] Loader y JWT interceptors configurados correctamente
- [ ] No hay `alert()` (usar SweetAlert2 o AlertService)

#### RxJS

- [ ] Suscripciones RxJS con `takeUntil`, `async pipe`, o cleanup
- [ ] No hay memory leaks por suscripciones sin unsubscribe

#### Documentación

- [ ] JSDoc en métodos públicos de servicios, guards, interceptors, resolvers
- [ ] Textos visibles internacionalizados (ngx-translate)
- [ ] No hay textos hardcodeados en español en el código

#### Estilos

- [ ] Estilos en archivos SCSS separados
- [ ] No hay estilos inline (excepto casos muy específicos)

---

## 3. Antipatrones a Detectar (de codesa-sdd-templates)

### Backend

| Anti-patrón | Acción |
|---|---|
| `catch (Exception e) { /* vacío */ }` | Prohibido. Loguear, envolver o dejar propagar. |
| `catch (Exception e) { throw new RuntimeException(e); }` | Usar excepción del core con clave i18n. |
| `public Turno toEntity(TurnoDTO)` dentro del controller | Los mapeos van en `*Mapper`, no en el controller. |
| Entidad JPA devuelta desde un controller | Mapear a `*Response` antes de retornar. |
| `@Autowired` en campo | Inyección por constructor. |
| `new Date()` / `SimpleDateFormat` | Usar `java.time.*`. |
| `BigDecimal` sin escala explícita | Definir escala y modo de redondeo. |
| Métodos con > 30 líneas | Descomponer. |
| Clase con > 300 líneas (servicio) | Dividir por responsabilidad. |
| Parámetros `boolean` que cambian comportamiento | Dividir en dos métodos. |
| `@SpringBootTest` para pruebas unitarias | Prohibido; solo para integración. |
| H2 como base de datos de prueba | Prohibido; usar Testcontainers con Oracle. |

### Frontend

| Anti-patrón | Acción |
|---|---|
| `// @ts-ignore` sin comentario | Eliminar o justificar con ticket + fecha. |
| Casts agresivos `(x as Foo).bar` | Validar con type guard. |
| Tipos primitivos boxed (`String`, `Number` con mayúscula) | Usar `string`, `number`. |
| Retornos implícitos `undefined` | Tipar el retorno y devolver explícitamente. |
| `console.log()` en producción | Eliminar. |
| `debugger;` en código | Eliminar. |
| `alert()` en código | Usar SweetAlert2 o AlertService. |
| Código comentado sin explicación | Eliminar o documentar con ticket. |

---

## 4. Cómo Reportar Hallazgos

### Severidad

#### BLOCKER (Debe corregirse antes de merge)

- Código que no compila
- Tests que fallan
- Credenciales hardcodeadas
- SQL Injection vulnerability
- Lógica de negocio incorrecta que causa pérdida de datos
- Archivos de configuración local commiteados
- `@SpringBootTest` en pruebas unitarias
- H2 como base de datos de prueba
- Anti-patrones prohibidos explícitamente

#### MAJOR (Debe corregirse antes de merge)

- Lógica de negocio en Controllers (debe estar en Services)
- DTOs expuestos directamente al frontend (deben ser DTOs)
- Falta de validación en inputs críticos
- N+1 query problem
- Excepciones no manejadas que causan crash
- `console.log()` o `System.out.println()` en producción
- Inyección por campo con `@Autowired`
- `Optional` como parámetro o campo
- Entidad JPA devuelta desde controller
- `@Data` en entidades JPA

#### MINOR (Recomendado corregir, pero no bloquea merge)

- Naming que no sigue convenciones
- Código comentado sin explicación
- Faltan comentarios en lógica compleja
- Tests faltantes para casos edge
- Código duplicado que podría extraerse
- Magic numbers/strings
- Falta de JSDoc/JavaDoc en métodos públicos
- Logs con concatenación en vez de placeholders

### Formato de Reporte

```
## Code Review: [Nombre del archivo/pull request]

### ✅ Lo que está bien
- [Ejemplo: La validación de fecha de nacimiento es correcta y cubre casos edge]
- [Ejemplo: El naming sigue las convenciones de Codesa]
- [Ejemplo: Los tests cubren los casos principales]

### ❌ Hallazgos

#### [BLOCKER/MAJOR/MINOR] - [Título del problema]
**Archivo**: `ruta/al/archivo.java`
**Línea**: [número de línea, si aplica]
**Justificación**: [Por qué es un problema, referenciar standard específico]
**Fix propuesto**: 
```java
// Código corregido
```

### 📝 Resumen
- [Número] Blockers
- [Número] Majors
- [Número] Minors
- [Resultado]: [APROBADO / APROBADO CON OBSERVACIONES / RECHAZADO]
```

---

## 5. Proponer el Fix Concreto, No Solo Señalar el Problema

### Ejemplo de Fix para Backend

**Problema**: Lógica de negocio en Controller

```java
// ANTES (incorrecto)
@PostMapping("/turnos")
public TurnoResponseDTO registrarTurnos(@RequestBody RegistrarTurnosRequest request) {
    // ❌ Lógica de negocio en Controller
    if (request.getNombre() == null || request.getNombre().isEmpty()) {
        throw new IllegalArgumentException("El nombre no puede estar vacío");
    }
    return turnoDAO.registrar(request);
}

// DESPUÉS (correcto)
@PostMapping("/turnos")
public TurnoResponseDTO registrarTurnos(@RequestBody RegistrarTurnosRequest request) {
    // ✅ Solo orquestación en Controller
    return turnosServices.registrarTurnos(request);
}
```

### Ejemplo de Fix para Frontend

**Problema**: HTTP call directamente en Component

```typescript
// ANTES (incorrecto)
export class TurnosComponent {
  constructor(private http: HttpClient) {}
  
  registrarTurnos(request: any) {
    // ❌ HTTP call en Component
    this.http.post('/api/turnos', request).subscribe(...);
  }
}

// DESPUÉS (correcto)
export class TurnosComponent {
  constructor(private turnosService: TurnosService) {}
  
  registrarTurnos(request: any) {
    // ✅ Delegar al Service
    this.turnosService.registrarTurnos(request).subscribe(...);
  }
}
```

---

## 6. Reconocer Explícitamente lo que Está Bien Hecho

**Siempre comenzar el review reconociendo lo positivo:**

- "La validación de inputs es completa y correcta"
- "El naming sigue perfectamente las convenciones de Codesa"
- "Los tests cubren los casos edge que muchos pasan por notan"
- "La separación de capas es clara y sigue el patrón DAO"
- "El uso de MapStruct para mapeo es correcto y eficiente"

**Esto es importante porque:**

- Motiva al desarrollador
- Refuerza buenas prácticas
- Hace el review más constructivo

---

## 7. No Proponer Cambios de Estilo Personal si el Código Sigue los Standards

### Regla de Oro

- **Si el código sigue los standards de Codesa**, NO proponer cambios de estilo personal.
- **Ejemplo**: Si Codesa usa español para nombres de métodos, no proponer cambiar a inglés.
- **Ejemplo**: Si Codesa usa `*ServiceImpl.java`, no proponer cambiar a `*ServiceImplementation.java`.

### Cuándo Sugerir Cambios de Estilo

- **Solo** si el código viola los standards documentados
- **Siempre** con referencia al standard específico que se está violando
- **Con un fix concreto** que siga los standards

### Ejemplo

```
❌ INCORRECTO: "Cambia 'consultarTurnos' a 'getTurnos' porque su mejor"
✅ CORRECTO: "Cambia 'getTurnos' a 'consultarTurnos' porque los standards de Codesa 
             requieren métodos en español (ver base-standards.md, sección Naming)"
```

---

## 8. Checklist Rápido de Code Review

### Backend

- [ ] Naming sigue standards (Controller, Service, DTO, DAO, Repository, Mapper)
- [ ] Lógica de negocio en Services, no en Controllers
- [ ] Se usan DTOs, no entidades JPA en Controllers
- [ ] MapStruct para mapeo, no conversiones manuales
- [ ] Inyección por constructor con `@RequiredArgsConstructor` + `final`
- [ ] `@Transactional` solo en `*ServiceImpl`
- [ ] Excepciones del core corporativo con clave i18n
- [ ] `Optional<T>` solo para tipos de retorno
- [ ] SLF4J con placeholders, no concatenación
- [ ] Constantes nombradas, no magic numbers/strings
- [ ] `java.time.*`, no `new Date()`
- [ ] Colecciones como interfaces, no implementaciones
- [ ] No hay anti-patrones prohibidos
- [ ] Paquete raíz sigue `co.com.codesa.<proyecto>.<dominio>.<ms>`

### Frontend

- [ ] Naming sigue standards (Component, Service, Pipe)
- [ ] Lógica de negocio en Services, no en Components
- [ ] Reactive Forms para formularios complejos
- [ ] Enums en lugar de magic strings
- [ ] `??` vs `||` correcto
- [ ] Early return / Guard clauses
- [ ] Estilos en SCSS separados
- [ ] Textos internacionalizados (ngx-translate)
- [ ] JSDoc en métodos públicos de servicios/guards/interceptors
- [ ] Suscripciones RxJS con cleanup
- [ ] No hay `console.log()` ni `debugger;`
- [ ] No hay código comentado sin explicación
- [ ] Naming de carpetas en kebab-case

---

## Reglas de Oro para Code Review

1. **Revisar en orden**: Correctitud → Seguridad → Performance → Legibilidad
2. **Ser específico**: No "esto está mal", sino "esto está mal aquí porque..."
3. **Proponer fixes concretos**: No solo señalar el problema, mostrar la solución
4. **Reconocer lo positivo**: Siempre empezar con lo que está bien
5. **Respetar los standards**: No imponer estilo personal si se siguen los standards
6. **Clasificar severidad**: BLOCKER, MAJOR, MINOR con justificación clara
7. **Ser constructivo**: El objetivo es mejorar el código, no criticar al desarrollador
8. **Referenciar standards**: Siempre citar el standard específico violado
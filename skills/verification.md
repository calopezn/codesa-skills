---
title: Verification Before Completion
version: 3.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: skill
---

# Verification Before Completion — Skills de Codesa

> **Alcance**: Cuando se te pida verificar que una tarea está completa, debes ejecutar este skill antes de declararla como terminada. Aplica a todos los proyectos Codesa (backend Java/Spring Boot y frontend Angular).
>
> **Versión**: 3.0.0 — Alineado con `codesa-sdd-templates` y referenciando [obra/superpowers](https://github.com/obra/superpowers)
> **Fuente de verdad**: `codesa-sdd-templates/shared/standards/base-standards.md`, `testing-standards-backend.md`, `testing-standards-frontend.md`
>
> **Principio fundamental**: Evidence before claims, always. Si no ejecutaste el comando de verificación en este mensaje, no puedes afirmar que pasa.

---

## 0. Referencia: Superpowers

### Repositorio de Referencia

[obra/superpowers](https://github.com/obra/superpowers) es un repositorio de "superpowers" — skills y herramientas para mejorar la productividad de desarrollo con agentes IA.

### Skill de Verification en superpowers

El skill de verification de superpowers se enfoca en verificación general de implementación. El skill de Codesa extiende este concepto con:

- Verificación de compliance con specs OpenSpec
- Quality gates de SonarQube específicos de Codesa
- Verificación de standards corporativos (naming, arquitectura, seguridad)
- Checklist SDD específico por stack (backend/frontend)

### Integración con SDD

La verification verifica que la implementación cumple con los contratos definidos en SDD:

```
Verification Workflow:
  proposal.md → design.md → spec.md → implementation → code-review → verification → archive
```

---

## ✅ The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

---

## ✅ Checklist de Verificación

### 1. El Código Compila sin Errores ni Warnings Relevantes

**Backend (Maven):**

```bash
# Build completo (con checkstyle y spotbugs)
mvn clean compile

# Build rápido (sin verificaciones de estilo)
mvn clean compile -P fast-build

# Verificar quality gate de SonarQube
# → Revisar dashboard de SonarQube del proyecto
```

- [ ] No hay errores de compilación
- [ ] No hay warnings de MapStruct (problemas de mapeo entre entidades y DTOs)
- [ ] No hay warnings de Lombok (problemas con @Data, @Builder, etc.)
- [ ] Checkstyle pasa (si se ejecuta)
- [ ] SpotBugs no reporta bugs críticos (si se ejecuta)
- [ ] SonarQube Quality Gate passed: 0 bugs, 0 vulnerabilities, duplicación < 3%

**Frontend (Angular):**

```bash
# Build completo
npm run build-superflex

# Solo linting
npm run lint
```

- [ ] No hay errores de TypeScript
- [ ] No hay errores de ESLint
- [ ] No hay warnings de Angular Compiler
- [ ] Build de producción se genera correctamente en `dist/`
- [ ] SonarQube Quality Gate passed

### 2. Los Tests Existentes Siguen Pasando

**Backend:**

```bash
# Ejecutar todos los tests
mvn test

# Verificar cobertura JaCoCo
mvn verify
```

- [ ] Todos los tests de controllers pasan (`*ControllerTest.java`)
- [ ] Todos los tests de DAOs pasan (`*DAOImplTest.java`)
- [ ] No hay tests fallidos nuevos
- [ ] Cobertura no disminuyó significativamente
- [ ] JaCoCo: ServiceImpl ≥ 80%, Controller ≥ 70%, DAOImpl queries complejas ≥ 70%

**Frontend:**

```bash
# Ejecutar tests unitarios
npm run test

# Verificar cobertura
# → Verificar cobertura en Karma/Jasmine
```

- [ ] Todos los tests de Karma pasan
- [ ] No hay tests fallidos nuevos
- [ ] No hay tests descriptivos (`describe`, `it`) comentados
- [ ] Cobertura mínima: 60% en features nuevas

### 3. El Nuevo Código Tiene Tests que Cubren los Casos Principales

**Backend:**

- [ ] Si se agregó un nuevo endpoint, hay un `*ControllerTest.java` correspondiente
- [ ] Si se agregó lógica de negocio, hay un test para el service
- [ ] Si se modificó un DAO, hay un test para el `*DAOImplTest.java`
- [ ] Los tests cubren casos positivos Y negativos (validaciones, excepciones)
- [ ] Los tests siguen la convención de naming: `metodoBajoTest_estadoDeEntrada_resultadoEsperado()`
- [ ] Cada test tiene bloques `// Arrange`, `// Act`, `// Assert`
- [ ] No hay `@SpringBootTest` en pruebas unitarias
- [ ] No hay H2 como base de datos de prueba
- [ ] Tests de repositorio extienden `OracleTestBase` y llaman `em.clear()` después de `em.flush()`

**Frontend:**

- [ ] Si se agregó un nuevo componente, hay un `*component.spec.ts` correspondiente
- [ ] Si se modificó un servicio, hay un test para el service
- [ ] Los tests cubren estados válidos, inválidos y de error
- [ ] Los tests no tienen `skip()` o `xit()` sin justificación

### 4. Se Respeta los Standards de Codesa Identificados

**Backend:**

- [ ] Naming de clases: `*Controller`, `*Service`, `*ServiceImpl`, `*DTO`, `*Request`, `*Response`, `*DAO`, `*DAOImpl`, `*Repository`, `*Mapper`
- [ ] Naming de métodos: español, camelCase (`consultarTurnos`, `registrarTurnos`)
- [ ] Naming de paquetes: `co.com.codesa.<proyecto>.<dominio>.<ms>`
- [ ] Comentarios en español para clases y métodos públicos (JavaDoc)
- [ ] DTOs separados en `request/` y `response/`
- [ ] No se usan entidades JPA directamente en controllers (se usan DTOs)
- [ ] Inyección por constructor con `@RequiredArgsConstructor` + `final`
- [ ] `@Transactional` solo en `*ServiceImpl`
- [ ] Excepciones del core corporativo con clave i18n
- [ ] `Optional<T>` solo para tipos de retorno
- [ ] SLF4J con placeholders, no concatenación
- [ ] Constantes nombradas, no magic numbers/strings
- [ ] `java.time.*`, no `new Date()`

**Frontend:**

- [ ] Naming de componentes: `*Component.ts`
- [ ] Naming de servicios: `*Service.ts`
- [ ] Naming de pipes: `*Pipe.ts`
- [ ] Naming de carpetas de features: kebab-case (`carro-compras`, `recargas`)
- [ ] Estilos en SCSS junto a cada componente (`*.component.scss`)
- [ ] No hay código inline en templates cuando debería estar en el component
- [ ] Enums en lugar de magic strings
- [ ] `??` vs `||` correcto
- [ ] Early return / Guard clauses
- [ ] Suscripciones RxJS con cleanup
- [ ] JSDoc en métodos públicos de servicios/guards/interceptors

### 5. No Hay Código Comentado, console.log, o Prints de Debugging

**Backend:**

- [ ] No hay `// TODO` sin ticket asociado
- [ ] No hay `System.out.println()` en el código
- [ ] No hay `@Disabled` en tests sin fecha y ticket
- [ ] No hay código comentado sin explicación de por qué está comentado
- [ ] No hay `Thread.sleep()` para sincronización

**Frontend:**

- [ ] No hay `console.log()` en el código
- [ ] No hay `// TODO` sin ticket asociado
- [ ] No hay `debugger;` en el código
- [ ] No hay `alert()` en el código
- [ ] No hay código comentado sin explicación de por qué está comentado
- [ ] No hay `// @ts-ignore` sin comentario

### 6. Los Nombres de Variables y Métodos son Descriptivos

- [ ] Variables: `turno`, `request`, `response`, `codigo` (descriptivos, no `a`, `b`, `x`)
- [ ] Métodos: verbos de acción en español (`consultarTurnos`, no `getTurnos`)
- [ ] Clases: sufijo de responsabilidad claro (`Controller`, `Service`, `DTO`)
- [ ] Interfaces: sin sufijo `Interface`, solo nombre (`TurnosService`)

### 7. Si Hay Cambios en API, la Documentación Refleja el Cambio

**Backend:**

- [ ] Si se agregó/modificó un endpoint, está documentado en Swagger (`@ApiOperation`, `@ApiImplicitParam`)
- [ ] Los DTOs de request/response reflejan los campos correctos
- [ ] Los códigos HTTP son correctos (200, 201, 400, 404, 500)
- [ ] Se actualizó la descripción del endpoint si cambió la funcionalidad

**OpenAPI:**

- [ ] Si cambió la API, se actualizó el `api-spec.yml` en `codesa-specs/specs/`

### 8. Si Hay Cambios en BD, Hay Migración Correspondiente

**Backend:**

- [ ] Si se agregó/modificó una tabla, hay un script de migración SQL
- [ ] Si se modificó una entidad JPA, se verificó que no rompa datos existentes
- [ ] Si se agregó un índice, está documentado
- [ ] Las migraciones están versionadas y ordenadas

### 9. Si Hay un Change OpenSpec, Se Cumplen los Criterios de Aceptación

**OpenSpec:**

- [ ] El change existe en `openspec/changes/<ticket-o-nombre>/`
- [ ] `proposal.md` define qué y por qué
- [ ] `design.md` define cómo técnicamente
- [ ] `tasks.md` tiene el desglose accionable
- [ ] Todos los tasks marcados con `[x]` están completados y verificados
- [ ] Los criterios de aceptación del `proposal.md` se cumplen

### 10. Observabilidad

- [ ] Logs estructurados JSON con campos mínimos: `timestamp`, `level`, `traceId`, `spanId`, `service`, `message`
- [ ] Correlation ID propagado en headers `X-Correlation-Id`
- [ ] Métricas Prometheus expuestas vía Micrometer
- [ ] Health checks en `/actuator/health`

---

## 🚫 Red Flags (No aprobar si se encuentran)

- [ ] **Código que no compila** → BLOCKER
- [ ] **Tests que fallan** → BLOCKER
- [ ] **console.log() o System.out.println() en producción** → MAJOR
- [ ] **Código comentado sin explicación** → MINOR
- [ ] **Naming que no sigue convenciones** → MINOR
- [ ] **DTOs expuestos directamente al frontend** → MAJOR (deberían ser DTOs)
- [ ] **Lógica de negocio en controllers** → MAJOR (debe estar en services)
- [ ] **Credenciales hardcodeadas** → BLOCKER
- [ ] **Archivos de configuración local commiteados** → BLOCKER
- [ ] **SonarQube Quality Gate failed** → BLOCKER
- [ ] **Cobertura por debajo del mínimo** → MAJOR
- [ ] **`@SpringBootTest` en pruebas unitarias** → BLOCKER
- [ ] **H2 como base de datos de prueba** → BLOCKER

---

## 📋 Proceso de Verificación

1. **Compilar el código** → `mvn clean compile` o `npm run build-superflex`
2. **Ejecutar tests** → `mvn test` o `npm run test`
3. **Ejecutar linting** → `npm run lint` (frontend), checkstyle (backend)
4. **Verificar standards** → Comparar con standards de codesa-sdd-templates
5. **Verificar tests nuevos** → ¿Cubren los casos principales?
6. **Verificar documentación** → ¿Swagger/README actualizado?
7. **Verificar migraciones** → ¿Hay scripts de BD si se modificó esquema?
8. **Limpiar código** → ¿No hay console.log, código comentado, etc.?
9. **Verificar OpenSpec** → ¿Se cumplen los criterios de aceptación?
10. **Verificar observabilidad** → ¿Logs estructurados, correlation ID, métricas?

---

## 🏁 Resultado

Si **todos** los checks pasan → ✅ **TAREA COMPLETA**

Si **algún check falla** → ❌ **RECHAZAR** con explicación específica de qué falta.

---

## Ejemplo de Interacción

```
Desarrollador: Ya terminé la feature de agregar fecha de nacimiento.

IA: Voy a verificar el checklist de verification...

[Verifica cada punto del checklist]

✅ Compilación exitosa
✅ Tests pasando (45/45)
✅ Cobertura JaCoCo: 82% (≥ 80%)
✅ Standards seguidos
✅ Sin console.log o System.out.println
✅ Documentación actualizada
✅ Migración SQL presente
✅ OpenSpec criteria met

🎉 ¡Tarea verificada! Todo está completo.
```

---

## Reglas de Oro para Verification

1. **NUNCA afirmar que algo pasa sin ejecutar la verificación**. Evidence before claims.
2. **Siempre ejecutar los comandos completos**, no confiar en afirmaciones del desarrollador.
3. **Contar los tests**, no solo afirmar que "pasan".
4. **Verificar cobertura**, no solo que los tests pasan.
5. **Comparar con standards**, no solo con convenciones personales.
6. **Ser estricto con los blockers**. No comprometer la calidad por presión de tiempo.
7. **Documentar el resultado de verificación** con evidencia concreta.
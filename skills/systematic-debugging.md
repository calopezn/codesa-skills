---
title: Systematic Debugging
version: 3.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: skill
---

# Systematic Debugging — Skills de Codesa

> **Alcance**: Cuando te pidan ayudar a depurar un problema (bug, test failure, comportamiento inesperado), debes ejecutar este skill ANTES de proponer soluciones. Aplica a todos los proyectos Codesa (backend Java/Spring Boot y frontend Angular).
>
> **Versión**: 3.0.0 — Alineado con `codesa-sdd-templates` y referenciando [obra/superpowers](https://github.com/obra/superpowers)
> **Fuente de verdad**: `codesa-sdd-templates/shared/standards/base-standards.md`, `testing-standards-backend.md`, `testing-standards-frontend.md`
>
> **Principio fundamental**: SIEMPRE encontrar la causa raíz antes de intentar fixes. Fixes de síntomas son fracaso.

---

## 0. Referencia: Superpowers

### Repositorio de Referencia

[obra/superpowers](https://github.com/obra/superpowers) es un repositorio de "superpowers" — skills y herramientas para mejorar la productividad de desarrollo con agentes IA.

### Skill de Systematic Debugging en superpowers

El skill de systematic debugging de superpowers se enfoca en depuración sistemática con 4 fases. El skill de Codesa extiende este concepto con:

- Logs y puntos de inspección específicos del stack de Codesa (Spring Boot, Angular, Oracle)
- Integración con herramientas corporativas (SonarQube, Kibana, Zipkin)
- Hipótesis ordenadas por probabilidad según el stack
- Checklist de verificación post-fix específico de Codesa
- Referencia a otros superpowers (TDD, verification)

### Integración con SDD

El debugging se integra con el flujo SDD cuando el bug está relacionado con un change OpenSpec:

```
Debugging Workflow:
  bug report → Phase 1 (Root Cause) → Phase 2 (Pattern) → Phase 3 (Hypothesis) → Phase 4 (Implementation) → code-review → verification
```

---

## ✅ The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

Si no has completado la Fase 1, no puedes proponer fixes.

---

## 1. Cuándo Usar

**Usar para CUALQUIER problema técnico:**
- Tests que fallan
- Bugs en producción
- Comportamiento inesperado
- Problemas de performance
- Failures de build
- Issues de integración

**Usar ESPECIALMENTE cuando:**
- Bajo presión de tiempo (las emergencias hacen tentador adivinar)
- "Un quick fix" parece obvio
- Ya intentaste múltiples fixes
- El fix anterior no funcionó
- No entiendes completamente el issue

**No saltar cuando:**
- El issue parece simple (los bugs simples tienen root causes también)
- Estás apurado (apurarse garantiza rework)
- El manager quiere que se arregle YA (debugging sistemático es más rápido que thrashing)

---

## 2. Las Cuatro Fases

### Fase 1: Root Cause Investigation

**ANTES de intentar CUALQUIER fix:**

#### 1.1 Leer Mensajes de Error Completamente

- [ ] No saltar sobre errores o warnings
- [ ] Leer stack traces completamente
- [ ] Nota line numbers, file paths, error codes
- [ ] En backend: leer logs de Spring Boot (`/actuator/logs`, Kibana)
- [ ] En frontend: leer consola del navegador (F12), Network tab

**Backend (Spring Boot):**
```
Ejemplo de stack trace que NO ignorar:
  org.springframework.dao.DataIntegrityViolationException: 
  ORA-01400: cannot insert NULL into ("SCHEMA"."TABLE"."COLUMN")
      at org.hibernate.exception.internal.SQLStateConversionDelegate.convert(...)
  → La columna X no puede ser NULL, revisar el INSERT/UPDATE
```

**Frontend (Angular):**
```
Ejemplo de error que NO ignorar:
  ERROR TypeError: Cannot read properties of undefined (reading 'id')
      at TurnoComponent.getTurnoNombre (turno.component.ts:42)
  → El turno es undefined, revisar el servicio o el template
```

#### 1.2 Reproducir Consistentemente

- [ ] ¿Se puede trigger de forma confiable?
- [ ] ¿Cuáles son los pasos exactos?
- [ ] ¿Ocurre cada vez?
- [ ] Si no es reproducible → gather más data, no adivinar

**Backend:**
```bash
# Reproducir con curl
curl -X POST http://localhost:8080/api/turnos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"vendedorId": "42", "monto": "100000"}'

# Verificar logs en tiempo real
tail -f LOG_PATH_IS_UNDEFINED/*.log | grep -i error
```

**Frontend:**
```bash
# Reproducir con Cypress/Playwright
npm run e2e -- --spec="cypress/e2e/turnos.spec.cy.ts"

# O manualmente: F12 → Network → reproducir paso a paso
```

#### 1.3 Check Recent Changes

- [ ] ¿Qué cambió que podría causar esto?
- [ ] Git diff, recent commits
- [ ] Nuevas dependencias, config changes
- [ ] Diferencias ambientales

```bash
# Backend: ver cambios recientes
git log --oneline -10
git diff HEAD~3 -- src/main/java/

# Frontend: ver cambios recientes
git log --oneline -10
git diff HEAD~3 -- src/app/
```

#### 1.4 Gather Evidence en Sistemas Multi-Componente

**CUANDO el sistema tiene múltiples componentes (Frontend → Backend → BD):**

**ANTES de proponer fixes, agregar instrumentación diagnóstica:**

```
Para CADA boundary de componente:
  - Loggear qué data entra al componente
  - Loggear qué data sale del componente
  - Verificar environment/config propagation
  - Check state en cada layer

Ejecutar una vez para gather evidence mostrando DÓNDE se rompe
Luego analizar evidence para identificar failing component
Luego investigar ese component específico
```

**Ejemplo (sistema multi-layer de Codesa):**

```bash
# Layer 1: Frontend - Verificar que el component está enviando data correcta
# Revisar en consola del navegador:
console.log('Request payload:', JSON.stringify(payload, null, 2));

# Layer 2: Frontend → Backend - Verificar que la petición HTTP llega
# Network tab: verificar status code, headers, response body

# Layer 3: Backend - Verificar que el endpoint recibe y procesa
curl -v http://localhost:8080/api/turnos 2>&1 | grep -i error

# Layer 4: Backend → BD - Verificar que la query JPQL se ejecuta
# Logs de Hibernate:
# DEBUG org.hibernate.SQL - INSERT INTO turnos (vendedor_id, monto) VALUES (?, ?)
```

**Esto revela:** Qué layer falla (Frontend ✓ → Backend ✗)

#### 1.5 Trace Data Flow

**CUANDO el error está deep en call stack:**

- [ ] ¿Dónde origina el bad value?
- [ ] ¿Qué llamó con bad value?
- [ ] Seguir tracing up hasta encontrar la source
- [ ] Fix en la source, no en el symptom

### Ejemplo de Data Flow Tracing (Backend):

```
Síntoma: 500 Internal Server Error en /api/turnos
  ↓
Controller recibe: AperturaTurnoRequest(monto=null)
  ↓
Service recibe: monto=null
  ↓
Validation falla: BigDecimal debe ser positivo
  ↓
CAUSA RAÍZ: Frontend envía monto=null en lugar de monto="0"
  ↓
FIX: En el componente frontend, default monto a "0" en lugar de null
```

---

### Fase 2: Pattern Analysis

**Encontrar el patrón antes de fixear:**

#### 2.1 Find Working Examples

- [ ] ¿Hay código similar que SÍ funciona en el mismo codebase?
- [ ] ¿Qué funciona que es similar a lo que está roto?

**Backend - Ejemplo de patrón que funciona:**
```java
// Si este endpoint funciona correctamente:
@PostMapping("/clientes")
public ClienteResponseDTO crearCliente(@RequestBody CrearClienteRequest request) {
    validarRequest(request);
    Cliente cliente = mapper.toEntity(request);
    Cliente saved = clienteRepository.save(cliente);
    return mapper.toResponse(saved);
}

// Comparar con el que NO funciona:
@PostMapping("/turnos")
public TurnoResponseDTO crearTurno(@RequestBody AperturaTurnoRequest request) {
    // ¿Qué es diferente? ¿Validación? ¿Mapeo? ¿Transacción?
}
```

**Frontend - Ejemplo de patrón que funciona:**
```typescript
// Si este service funciona correctamente:
export class ClientesService {
  crearCliente(request: CrearClienteRequest): Observable<ClienteResponseDTO> {
    return this.http.post<ClienteResponseDTO>(this.apiUrl, request)
      .pipe(catchError(this.handleError));
  }
}

// Comparar con el que NO funciona:
export class TurnosService {
  // ¿Qué es diferente? ¿URL? ¿Interceptors? ¿Error handling?
}
```

#### 2.2 Compare Against References

- [ ] Si implementando un patrón, leer la referencia COMPLETAMENTE
- [ ] No hacer skim — leer cada línea
- [ ] Entender el patrón completamente antes de aplicar

**Referencias de Codesa:**
- `codesa-sdd-templates/shared/standards/base-standards.md`
- `codesa-sdd-templates/shared/standards/java-style-guide.md`
- `codesa-sdd-templates/shared/standards/typescript-style-guide.md`

#### 2.3 Identify Differences

- [ ] ¿Qué es diferente entre working y broken?
- [ ] Listar cada diferencia, por pequeña que sea
- [ ] No asumir "eso no puede importar"

#### 2.4 Understand Dependencies

- [ ] ¿Qué otros componentes necesita esto?
- [ ] ¿Qué settings, config, environment?
- [ ] ¿Qué assumptions hace?

**Backend dependencies:**
- [ ] Vault (credentials)
- [ ] Consul (config)
- [ ] Oracle DB (conexión, esquemas)
- [ ] Kafka (eventos)
- [ ] Redis (cache)

**Frontend dependencies:**
- [ ] JWT Interceptor (autenticación)
- [ ] Loader Interceptor (spinner)
- [ ] Environment config (apiBaseUrl)
- [ ] ngx-translate (internacionalización)

---

### Fase 3: Hypothesis and Testing

**Método científico:**

#### 3.1 Form Single Hypothesis

- [ ] Declarar claramente: "Creo que X es la root cause porque Y"
- [ ] Escribirlo
- [ ] Ser específico, no vago

**Ejemplo de hipótesis bien formada:**
```
Hipótesis: El endpoint /api/turnos retorna 500 porque el campo 
'monto' llega como null desde el frontend. 
Evidencia: El log muestra "BigDecimal must not be null" y el 
Network tab muestra payload {"vendedorId": "42", "monto": null}
```

#### 3.2 Test Minimally

- [ ] Hacer el CAMBIO MÁS PEQUEÑO posible para testear hipótesis
- [ ] Una variable a la vez
- [ ] No fixear múltiples cosas a la vez

#### 3.3 Verify Before Continuing

- [ ] ¿Funcionó? Sí → Fase 4
- [ ] ¿No funcionó? Formar NUEVA hipótesis
- [ ] NO agregar más fixes encima

#### 3.4 Cuando No Se Sabe

- [ ] Decir "No entiendo X"
- [ ] No fingir que se sabe
- [ ] Pedir ayuda
- [ ] Investigar más

---

### Fase 4: Implementation

**Fixear la root cause, no el symptom:**

#### 4.1 Create Failing Test Case

- [ ] Reproducción más simple posible
- [ ] Test automatizado si es posible
- [ ] Script de prueba si no hay framework
- [ ] DEBE tener antes de fixear

**Backend - Ejemplo de test de regresión:**
```java
@Test
@DisplayName("Aperturar turno con monto null lanza ValidationException")
void aperturarTurno_montoNull_lanzaValidationException() {
    // Arrange
    AperturaTurnoRequest request = new AperturaTurnoRequest(42L, null);
    
    // Act & Assert
    assertThatThrownBy(() -> service.aperturar(request))
        .isInstanceOf(ValidationException.class)
        .hasMessageContaining("monto");
}
```

**Frontend - Ejemplo de test de regresión:**
```typescript
it('deberiaMostrarErrorSiMontoEsNulo', () => {
    // Arrange
    component.formGroup.patchValue({ monto: null });
    
    // Act
    component.registrarTurno();
    
    // Assert
    expect(component.error).toBe('El monto es requerido');
});
```

#### 4.2 Implement Single Fix

- [ ] Address the root cause identified
- [ ] UN cambio a la vez
- [ ] No "mientras estoy aquí" improvements
- [ ] No bundled refactoring

#### 4.3 Verify Fix

- [ ] ¿El test pasa ahora?
- [ ] ¿No se broke otros tests?
- [ ] ¿El issue realmente se resolvió?

#### 4.4 Si el Fix No Funciona

- [ ] STOP
- [ ] Contar: ¿Cuántos fixes intentaste?
- [ ] Si < 3: Volver a Fase 1, re-analizar con nueva información
- [ ] **Si ≥ 3: STOP y cuestionar la arquitectura (ver paso 5 abajo)**
- [ ] NO intentar Fix #4 sin discusión arquitectónica

#### 4.5 Si 3+ Fixes Fallaron: Cuestionar Arquitectura

**Patrón indicando problema arquitectónico:**
- [ ] Cada fix revela nuevo shared state/coupling/problem en lugar diferente
- [ ] Fixes requieren "massive refactoring" para implementar
- [ ] Cada fix crea nuevos symptoms en otro lugar

**STOP y cuestionar fundamentals:**
- [ ] ¿Este pattern es fundamentalmente sound?
- [ ] ¿Estamos "quedándonos con él por inercia"?
- [ ] ¿Deberíamos refactorizar la arquitectura vs continuar fixeando symptoms?

**Discutir con el desarrollador antes de intentar más fixes**

Esto NO es una hipótesis fallida — es una arquitectura wrong.

---

## 3. Logs y Puntos de Inspección Según el Stack de Codesa

### Frontend (Angular)

| Capa | Punto de Inspección | Cómo Verificar |
|------|---------------------|----------------|
| **Consola** | `F12 → Console` | Errores de TypeScript, `console.log` |
| **Network** | `F12 → Network` | Peticiones HTTP, headers, payload, response |
| **Angular DevTools** | Extensión de Chrome | Inspeccionar componentes, estado, eventos |
| **Interceptores** | `LoaderInterceptorService`, `JwtInterceptor` | `src/app/core/interceptors/` |
| **Servicios** | `src/app/core/services/` | Punto central de consumo de API |
| **Estado reactivo** | `BehaviorSubject`, `Observable` | `MonedaService`, `ThemeService` |

### Backend (Spring Boot)

| Capa | Punto de Inspección | Cómo Verificar |
|------|---------------------|----------------|
| **Logs** | Directorio `LOG_PATH_IS_UNDEFINED/` | `tail -f *.log \| grep -i error` |
| **Actuator** | `/actuator/logs`, `/actuator/health`, `/actuator/metrics` | `curl localhost:8080/actuator/health` |
| **Prometheus** | `/actuator/prometheus` | Métricas en tiempo real |
| **Swagger** | `/swagger-ui.html` | Probar endpoints directamente |
| **ELK Stack** | Kibana | Logs estructurados con Logstash |
| **Zipkin** | Trazabilidad entre microservicios | Spring Cloud Sleuth |
| **IDE Debug** | Breakpoints en IntelliJ/Eclipse | Debug mode |

### Base de Datos (Oracle)

| Capa | Punto de Inspección | Cómo Verificar |
|------|---------------------|----------------|
| **Vistas de sistema** | `V$SESSION`, `V$SQL`, `V$LOCK` | SQL*Plus, DBeaver |
| **AWR Reports** | Oracle Automatic Workload Repository | Análisis de performance |
| **Testcontainers** | Oracle XE en tests | Reproducir problemas localmente |

---

## 4. Qué Preguntar si la Información es Insuficiente

### Si el desarrollador solo dice "no funciona":

- [ ] "¿Qué esperabas que pasara?"
- [ ] "¿Qué está pasando en su lugar?"
- [ ] "¿Hay algún error en la consola del navegador (F12)?"
- [ ] "¿Hay algún error en los logs del backend?"
- [ ] "¿Ocurre siempre o solo en ciertas condiciones?"

### Si el error es en el frontend:

- [ ] "¿Se ve algún error en la consola del navegador?"
- [ ] "¿La petición HTTP se envía? (revisar Network tab)"
- [ ] "¿El componente se renderiza parcialmente o completamente?"
- [ ] "¿Qué datos espera el componente y qué datos recibe?"

### Si el error es en el backend:

- [ ] "¿Qué endpoint se está llamando?"
- [ ] "¿Qué payload se está enviando?"
- [ ] "¿Hay algún stack trace en los logs?"
- [ ] "¿El endpoint retorna 4xx o 5xx?"
- [ ] "¿La conexión a BD está activa?"

### Si el error es intermitente:

- [ ] "¿Cuántas veces ha ocurrido?"
- [ ] "¿En qué entorno ocurre? (local, dev, staging, prod)"
- [ ] "¿Hay algún patrón? (cierto usuario, cierto dato, cierta hora)"
- [ ] "¿Los logs muestran algo diferente en los casos de fallo?"

---

## 5. Verificar que el Fix Realmente Resuelve el Problema

### Checklist post-fix

- [ ] El síntoma original desaparece
- [ ] No se introdujeron nuevos errores en la consola del navegador o logs del backend
- [ ] Los tests existentes siguen pasando (`npm run test` para frontend, `mvn test` para backend)
- [ ] El build de producción funciona (`npm run build-superflex` para frontend, `mvn clean package` para backend)
- [ ] El linting pasa (`npm run lint` para frontend, checkstyle para backend)
- [ ] Se probó en al menos el entorno local y dev

### Verificación específica por capa

- [ ] **Frontend**: No hay errores en consola, datos se muestran correctamente, formularios validan
- [ ] **Backend**: Logs limpios, respuesta HTTP correcta (200/201), datos en BD correctos
- [ ] **BD**: Datos persistidos correctamente, no locks ni deadlocks

---

## 6. Red Flags - STOP y Seguir el Proceso

Si te catches pensando:

- [ ] "Quick fix for now, investigate later"
- [ ] "Just try changing X and see if it works"
- [ ] "Add multiple changes, run tests"
- [ ] "Skip the test, I'll manually verify"
- [ ] "It's probably X, let me fix that"
- [ ] "I don't fully understand but this might work"
- [ ] "Pattern says X but I'll adapt it differently"
- [ ] "Here are the main problems: [lists fixes without investigation]"
- [ ] Proposing solutions before tracing data flow
- [ ] **"One more fix attempt" (when already tried 2+)**
- [ ] **Each fix reveals new problem in different place**

**TODO estas significan: STOP. Volver a Fase 1.**

**Si 3+ fixes fallaron:** Cuestionar la arquitectura (ver Fase 4.5)

---

## 7. Common Rationalizations

| Excusa | Realidad |
|--------|----------|
| "El issue es simple, no necesito el proceso" | Los issues simples tienen root causes. El proceso es rápido para bugs simples. |
| "Es emergencia, no hay tiempo para el proceso" | Debugging sistemático es MÁS RÁPIDO que guess-and-check thrashing. |
| "Intentaré esto primero, luego investigo" | El primer fix establece el patrón. Hacerlo bien desde el inicio. |
| "Escribiré el test después de confirmar que el fix funciona" | Fixes sin test no se quedan. El test primero demuestra que funciona. |
| "Múltiples fixes a la vez ahorra tiempo" | No se puede aislar qué funcionó. Causa nuevos bugs. |
| "La referencia es muy larga, adaptaré el patrón" | Understanding parcial garantiza bugs. Leerlo completamente. |
| "Veo el problema, déjame arreglarlo" | Ver symptoms ≠ entender root cause. |
| "Un intento más de fix" (después de 2+ fallidos) | 3+ fallidos = problema arquitectónico. Cuestionar el pattern, no fixear más. |

---

## 8. Quick Reference

| Fase | Actividades Clave | Criterio de Éxito |
|------|-------------------|-------------------|
| **1. Root Cause** | Leer errores, reproducir, check cambios, gather evidence | Entender QUÉ y POR QUÉ |
| **2. Pattern** | Find working examples, compare | Identificar diferencias |
| **3. Hypothesis** | Form theory, test minimally | Confirmed o nueva hipótesis |
| **4. Implementation** | Create test, fix, verify | Bug resuelto, tests pasan |

---

## 9. Integración con Otros Superpowers

Este skill se integra con:

- **superpowers:test-driven-development** — Para crear failing test case (Fase 4, Paso 1)
- **superpowers:verification-before-completion** — Para verificar que el fix funcionó antes de afirmar que pasó

---

## Reglas de Oro para Systematic Debugging

1. **SIEMPRE completar Fase 1 antes de proponer fixes**
2. **Una hipótesis a la vez** — No múltiples cambios simultáneos
3. **Fixear la root cause, no el symptom**
4. **Crear test de regresión ANTES de fixear**
5. **Un fix a la vez** — No bundled refactoring
6. **Si 3+ fixes fallan, cuestionar la arquitectura** — No intentar fix #4
7. **Verificar el fix en al menos 2 entornos**
8. **Documentar la causa raíz** — No solo el fix, sino por qué ocurrió
9. **Decir "No entiendo" cuando sea el caso** — No fingir
10. **Seguir el proceso, no saltarse fases** — El proceso existe por razón
---
title: Writing Plans
version: 3.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: skill
---

# Writing Plans — Skills de Codesa

> **Alcance**: Cuando se te pida crear un plan de implementación, debes ejecutar este skill. Aplica a todos los proyectos Codesa (backend Java/Spring Boot y frontend Angular).
>
> **Versión**: 3.0.0 — Alineado con `codesa-sdd-templates` y referenciando [obra/superpowers](https://github.com/obra/superpowers)
> **Fuente de verdad**: `codesa-sdd-templates/shared/standards/base-standards.md`, `testing-standards-backend.md`, `testing-standards-frontend.md`
>
> **Filosofía**: Un contrato primero, luego el código. Una spec por microservicio, cambios rastreables (OpenSpec).

---

## 0. Referencia: Superpowers

### Repositorio de Referencia

[obra/superpowers](https://github.com/obra/superpowers) es un repositorio de "superpowers" — skills y herramientas para mejorar la productividad de desarrollo con agentes IA.

### Skills Relevantes de superpowers

| Skill | Propósito | Uso en Codesa |
|-------|-----------|---------------|
| `executing-plans` | Ejecutar planes paso a paso | Referenciado en headers de planes |
| `writing-plans` | Crear planes de implementación | Este skill |
| `code-review` | Revisión de código | Ver `skills/code-review.md` |
| `tdd` | Test-Driven Development | Ver `skills/tdd.md` |
| `verification` | Verificación de implementación | Ver `skills/verification.md` |

### Integración con SDD

Los superpowers se integran con el flujo SDD de Codesa:

```
SDD Workflow:
  proposal.md → design.md → tasks.md → executing-plans → code-review → verification
```

---

## 1. Antes de Crear el Plan

### Preguntar al Desarrollador

Antes de escribir cualquier plan, verificar:

- [ ] ¿Existe un ticket (Jira/GitLab) asociado?
- [ ] ¿Existe un change OpenSpec (`proposal.md` + `design.md`) asociado?
- [ ] ¿El change OpenSpec está aprobado (status: `Accepted`)?
- [ ] ¿Se conoce el template SDD del repo? (`backend-java11-sb27`, `backend-java17-sb3`, `frontend-angular13` — ver [STACKS.md](../STACKS.md))
- [ ] ¿Se conoce el proyecto, dominio y microservicio objetivo?
- [ ] ¿Se conoce el spec OpenAPI del backend (api-spec.yml)?

### Cuándo Usar SDD

| Situación | ¿SDD completo? |
|---|---|
| Nuevo endpoint REST | ✅ Sí, siempre |
| Nuevo MS | ✅ Sí, con diseño C4 |
| Bug fix en lógica de negocio | ⚠️ SDD ligero (proposal + tasks) |
| Typo o texto | ❌ PR directo |
| Refactor estructural | ✅ Sí, con design.md detallado |
| Cambio de configuración (Vault, Consul) | ⚠️ PR con nota, sin SDD |

---

## 2. Estructura del Plan

### Plan Document Header

**Todo plan DEBE comenzar con este header:**

```markdown
# <Nombre del Change> Implementation Plan

> **Para agentes agéntricos:** SUB-SKILL REQUERIDO: Usar superpowers:executing-plans para implementar este plan paso a paso.

**Objetivo:** [Una frase describiendo qué se construye]

**Arquitectura:** [2-3 frases sobre el enfoque técnico]

**Stack:** [Tecnologías clave: Java 11/17, Spring Boot 2.7/3.x, Angular 13+]

**Ticket:** [ID del ticket: MTQ-1234, SFL-5678, etc.]

**Change OpenSpec:** [ruta al change en openspec/changes/<nombre>/]

**Rama:** `feature/<ticket>-[back|front]`

---
```

---

## 3. Desglose de Tareas

### Reglas de Tareas

- [ ] **Cada tarea debe ser completable en ≤ 2 horas**
- [ ] **Si una tarea crece más, dividirla antes de empezar**
- [ ] **Step 0: Crear rama `feature/[ticket]-backend` o `feature/[ticket]-frontend` antes de cualquier cambio**
- [ ] **Incluir: pruebas unitarias nuevas/actualizadas, pruebas manuales (curl backend / E2E frontend), actualización de docs**
- [ ] **Marcar `[x]` solo cuando el paso esté completo y verificado**
- [ ] **No placeholders: cada paso debe tener código concreto**

### Orden de Implementación

Para cambios que involucran backend y frontend:

```
1. [x] Step 0: Crear rama feature/<ticket>-backend
2. [x] Step 1: Actualizar data model (entidades, migraciones SQL)
3. [x] Step 2: Crear DTOs (Request/Response)
4. [x] Step 3: Implementar Repository/DAO
5. [x] Step 4: Implementar Service (lógica de negocio)
6. [x] Step 5: Implementar Controller (endpoints REST)
7. [x] Step 6: Escribir tests de Service
8. [x] Step 7: Escribir tests de Controller
9. [x] Step 8: Escribir tests de Repository/DAO
10. [x] Step 9: Actualizar documentación (Swagger, README)
11. [x] Step 10: Verificar build y tests
12. [x] Step 11: Commit con mensaje conventional
13. [x] Step 12: Crear PR con descripción completa

# Si hay frontend:
14. [x] Step 13: Crear rama feature/<ticket>-frontend
15. [x] Step 14: Crear/actualizar componentes
16. [x] Step 15: Crear/actualizar services HTTP
17. [x] Step 16: Actualizar guards/interceptors si aplica
18. [x] Step 17: Escribir tests de componentes
19. [x] Step 18: Actualizar documentación
20. [x] Step 19: Verificar build y tests
21. [x] Step 20: Commit con mensaje conventional
22. [x] Step 21: Crear PR con descripción completa
```

---

## 4. Ejemplo de Plan para Backend

```markdown
### Task 1: Actualizar Data Model

**Archivos:**
- Modificar: `src/main/java/co/com/codesa/<proyecto>/<dominio>/<ms>/domain/model/<Entity>.java`
- Crear: `src/main/resources/db/migration/V<version>__<descripción>.sql`

- [ ] **Step 1: Agregar campo a la entidad**

```java
@Entity
@Table(name = "turnos")
@Getter
@NoArgsConstructor
public class Turno {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    
    @Column(name = "vendedor_id", nullable = false)
    private String vendedorId;
    
    // SFV-1234: nuevo campo para fecha de apertura
    @Column(name = "fecha_apertura")
    private LocalDateTime fechaApertura;
}
```

- [ ] **Step 2: Crear migración SQL**

```sql
-- V2__add_fecha_apertura_to_turnos.sql
ALTER TABLE turnos ADD COLUMN fecha_apertura TIMESTAMP;
UPDATE turnos SET fecha_apertura = fecha_creacion WHERE fecha_apertura IS NULL;
ALTER TABLE turnos MODIFY COLUMN fecha_apertura TIMESTAMP NOT NULL;
```
```

---

## 5. Ejemplo de Plan para Frontend

```markdown
### Task 2: Crear Componente de Turnos

**Archivos:**
- Crear: `src/app/features/turnos/turnos.component.ts`
- Crear: `src/app/features/turnos/turnos.component.html`
- Crear: `src/app/features/turnos/turnos.component.scss`
- Crear: `src/app/features/turnos/turnos.component.spec.ts`
- Crear: `src/app/features/turnos/services/turnos.service.ts`

- [ ] **Step 1: Crear el componente**

```typescript
@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {
  turnos$ = this.turnosService.obtenerTurnos();
  
  constructor(private turnosService: TurnosService) {}
}
```

- [ ] **Step 2: Crear el servicio**

```typescript
@Injectable({ providedIn: 'root' })
export class TurnosService {
  private apiUrl = `${environment.apiBaseUrl}/turnos`;
  
  obtenerTurnos(): Observable<PaginaTurnoDTO> {
    return this.http.get<PaginaTurnoDTO>(this.apiUrl);
  }
}
```
```

---

## 6. Mensajes de Commit

**Usar Conventional Commits:**

```
feat(turnos): agrega fecha de apertura al modelo de turnos
fix(mensajes): corrige paginación cuando lista está vacía
refactor(persistencia): extrae query de jerarquías a método separado
test(apuestas): cubre caso de saldo insuficiente
docs(api): actualiza spec con nuevo endpoint /turnos/resumen
chore(deps): actualiza ojdbc8 a 21.5.0.0
```

---

## 7. Descripción de PR

**Cada PR debe incluir:**

```markdown
## PR: [Título del cambio]

### ¿Qué?
Resumen técnico del cambio.

### ¿Por qué?
Ticket/contexto de negocio.

### ¿Cómo probarlo?
1. [Pasos de verificación backend]
2. [Pasos de verificación frontend]

### Impacto
- **BD:** [Migraciones, nuevas tablas/columnas]
- **API:** [Nuevos endpoints, cambios en responses]
- **Dependencias:** [Nuevas librerías]
- **Rendimiento:** [Impacto esperado]
```

---

## 8. Flujo Ideal de un Cambio (Resumen)

```
1. Recibir ticket (Jira/GitLab)
2. Crear change OpenSpec: /opsx:new <ticket>
3. Escribir proposal.md (5-10 min)
4. Escribir design.md (decisiones técnicas)
5. Si cambia API → actualizar spec en codesa-specs/specs/api-spec.yml
6. Escribir tasks.md (desglosado en ≤ 2h cada tarea)
7. Crear rama feature/<ticket>-[back|front]
8. Implementar siguiendo tasks.md, marcando [x] progresivamente
9. Tests unitarios + manuales + E2E (si aplica)
10. Actualizar docs técnicas (README, api-spec, data-model, ADR si aplica)
11. PR con descripción completa
12. Code review (mínimo 1 aprobador)
13. Merge → pipeline Jenkins → despliegue
14. Archivar change: /opsx:archive <ticket>
```

---

## 9. Plantillas de OpenSpec

### proposal-template.md

```markdown
---
title: Proposal
version: 1.0.0
last_updated: 2026-05-14
status: template
owner: Arquitectura Codesa
applies_to: all
type: template
---

# Proposal: <Título del cambio>

## Contexto
> ¿Qué problema resuelve? ¿Por qué es necesario?

## Alcance
- ✅ Incluido
- ❌ No incluido

## Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2
```

### design-template.md

```markdown
---
title: Design
version: 1.0.0
last_updated: 2026-05-14
status: template
owner: Arquitectura Codesa
applies_to: all
type: template
---

# Design: <Título del cambio>

## Decisiones Técnicas
- [ ] Decisión 1: Qué, por qué, alternativas
- [ ] Decisión 2: Qué, por qué, alternativas

## Alternativas Consideradas
### Alternativa A: <nombre>
- Pros: ...
- Contras: ...
- Descartada porque: ...

## Riesgos y Mitigación
| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Riesgo 1 | Baja/Media/Alta | Bajo/Medio/Alto | ... |
```

### tasks-template.md

```markdown
---
title: Tasks
version: 1.0.0
last_updated: 2026-05-14
status: template
owner: Arquitectura Codesa
applies_to: all
type: template
---

# Tasks: <Título del cambio>

## Step 0: Crear rama
- [ ] `git checkout -b feature/<ticket>-backend`

## Task 1: <Nombre>
- [ ] **Step 1: ...**
- [ ] **Step 2: ...**
- [ ] **Step 3: ...**
```

---

## 10. Plantillas de ADR

Para decisiones arquitectónicas, usar la plantilla en `codesa-sdd-templates/shared/templates/ADR-template.md`:

```markdown
---
title: ADR (template)
version: 1.0.0
last_updated: 2026-05-14
status: template
owner: Arquitectura Codesa
applies_to: all
type: template
---

# ADR-NNNN: <Título de la decisión en imperativo>

- **Estado**: Proposed | Accepted | Deprecated | Superseded by ADR-MMMM
- **Fecha**: YYYY-MM-DD
- **Autor(es)**: Nombre — Rol
- **Deciders**: lista de aprobadores
- **Etiquetas**: arquitectura, backend, frontend, sdd, seguridad, etc.
- **Impacto**: nivel de afectación (bajo / medio / alto) + número aproximado de repos tocados
```

---

## Reglas de Oro para Writing Plans

1. **Siempre comenzar con proposal.md** antes de escribir código
2. **Cada tarea debe ser ≤ 2 horas** — dividir si crece más
3. **Step 0 siempre: crear rama**
4. **No placeholders** — cada paso debe tener código concreto
5. **Incluir tests en cada tarea** — TDD
6. **Referenciar standards de Codesa** — no imponer estilo personal
7. **Mensajes de commit con Conventional Commits**
8. **PR con descripción completa** — qué, por qué, cómo probar, impacto
9. **Actualizar documentación** — README, Swagger, api-spec
10. **Archivar change OpenSpec** cuando termine
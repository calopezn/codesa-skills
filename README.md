# codesa-skills

Skills y guías operativas para **agentes de IA** (Cline en VS Code, sobre LiteLLM + vLLM) en proyectos Codesa que adoptan **Spec-Driven Development (SDD)**.

Complementa el repositorio canónico de gobierno **[codesa-sdd-templates](https://gitlab.codesa.com.co/arquitectura/ia/codesa-sdd-templates)** — no lo sustituye.

---

## Propósito

| Repositorio | Qué define |
|-------------|------------|
| **codesa-sdd-templates** | *Qué* hacer: standards, plantillas OpenSpec, instalador, C4, ADRs de fábrica |
| **codesa-skills** (este repo) | *Cómo* ejecutar el flujo con IA: planes, TDD, code review, verificación, debugging |

```
codesa-sdd-templates  →  install en repo  →  codesa-specs/ + openspec/
codesa-skills         →  skills referenciados por el agente durante el change
```

---

## Estructura

```
codesa-skills/
├── README.md
├── STACKS.md                 ← paridad con los 3 templates de codesa-sdd-templates
├── stacks/                   ← un README por template SDD
│   ├── backend-java11-sb27/  ← Java 11 + SB 2.7 + Springfox
│   ├── backend-java17-sb3/   ← Java 17 + SB 3 + springdoc
│   └── frontend-angular13/   ← Angular 13 + api-catalog + ui-inventory
├── skills/                   ← flujo agéntico completo (planes, TDD, review, …) — fuente canónica
├── backend/                  ← arquitectura y convenciones comunes backend
├── frontend/                 ← arquitectura y convenciones comunes frontend
├── cline/                    ← artefactos listos para instalar en `.clinerules/` de un repo de proyecto
│   ├── rules/                ← reglas mínimas siempre activas (base + una por stack)
│   └── workflows/            ← los 6 skills como comandos `/plan` `/review` `/tdd` `/verify` `/debug` `/finish`
└── mcp-server/                ← servidor MCP "codesa-context": sirve skills/, backend/, frontend/, stacks/ bajo demanda
```

**Paridad obligatoria** con templates: [STACKS.md](STACKS.md).

---

## Rutas canónicas (importante)

En cada **repo de proyecto** (MS o frontend), la fuente de verdad SDD vive en:

| Artefacto | Ruta en el repo destino |
|-----------|-------------------------|
| Standards y contratos estables | `codesa-specs/specs/` |
| Agente IA del stack | `codesa-specs/agents/` |
| Changes en curso | `openspec/changes/<ticket>/` |
| Presets Checkstyle/ESLint | `.codesa/config/` |
| Reglas y workflows de Cline | `.clinerules/` (ver [cline/README.md](cline/README.md)) |

> **No usar** `.codesa/specs/` para specs — ese prefijo es solo para **config** de herramientas.

---

## Cómo usar con Cline

Cline no descubre skills por su cuenta como sí hacía el agente de Cursor: hay que cablearlos explícitamente a sus dos mecanismos — reglas siempre activas (`.clinerules`) y workflows invocados con `/comando`. Ver el análisis completo de esta transición y su justificación arquitectónica en el documento de integración de arquitectura.

### 1. Instalar SDD en el repo del proyecto

Seguir [INSTALL.md](https://gitlab.codesa.com.co/arquitectura/ia/codesa-sdd-templates/-/blob/main/INSTALL.md) del repo `codesa-sdd-templates` (script `install-codesa-sdd.ps1` / `.sh`). Este paso no cambia — sigue siendo independiente del editor.

### 2. Instalar las reglas y workflows de Cline en el repo del proyecto

Copiar en el repo destino (manual por ahora — ver [cline/README.md](cline/README.md) para el detalle y las limitaciones actuales):

```
codesa-skills/cline/rules/base.md              → <repo>/.clinerules/base.md
codesa-skills/cline/rules/<stack>.md           → <repo>/.clinerules/<stack>.md   (solo el stack del repo)
codesa-skills/cline/workflows/*.md             → <repo>/.clinerules/workflows/
```

Opcionalmente, configurar el servidor MCP `codesa-context` ([mcp-server/README.md](mcp-server/README.md)) para que los workflows puedan leer el contenido completo de un skill bajo demanda, sin necesitar un clon local de `codesa-skills`.

### 3. Invocar los skills durante el desarrollo

Cada skill quedó disponible como un comando explícito en el chat de Cline:

```text
/plan     → writing-plans.md   — crear el plan de implementación de un ticket
/review   → code-review.md     — revisar un PR o diff
/tdd      → tdd.md             — ciclo red-green-refactor
/verify   → verification.md    — checklist pre-merge
/debug    → systematic-debugging.md — investigar un fallo con evidencia
/finish   → finishing-branch.md — cerrar rama, PR y archivar el change OpenSpec
```

### 4. Flujo SDD recomendado

```
proposal.md → design.md → tasks.md
     ↓
/plan → implementing (agente + .clinerules del stack)
     ↓
/tdd → /review → /verify → /finish
```

Integración inspirada en [obra/superpowers](https://github.com/obra/superpowers); los artefactos OpenSpec siguen siendo los de **codesa-sdd-templates** (`shared/templates/`).

---

## Skills disponibles

| Skill | Cuándo usarlo | Workflow Cline |
|-------|----------------|-----------------|
| [writing-plans](skills/writing-plans.md) | Crear o refinar plan de implementación a partir de `tasks.md` | [`/plan`](cline/workflows/plan.md) |
| [code-review](skills/code-review.md) | Revisar PR contra standards y antipatrones | [`/review`](cline/workflows/review.md) |
| [tdd](skills/tdd.md) | Ciclo red-green-refactor en servicios y componentes | [`/tdd`](cline/workflows/tdd.md) |
| [verification](skills/verification.md) | Checklist pre-merge (tests, api-spec, docs) | [`/verify`](cline/workflows/verify.md) |
| [systematic-debugging](skills/systematic-debugging.md) | Investigar fallos con evidencia | [`/debug`](cline/workflows/debug.md) |
| [finishing-branch](skills/finishing-branch.md) | Cerrar rama, PR y archivar change OpenSpec | [`/finish`](cline/workflows/finish.md) |

Las reglas siempre activas (naming, antipatrones, no negociables) viven en [cline/rules/](cline/rules/) — una por stack, nunca las tres a la vez en el mismo repo.

---

## Documentación por stack (templates SDD)

| Template `codesa-sdd-templates` | Índice skills |
|--------------------------------|---------------|
| `backend-java11-sb27` | [stacks/backend-java11-sb27/](stacks/backend-java11-sb27/README.md) |
| `backend-java17-sb3` | [stacks/backend-java17-sb3/](stacks/backend-java17-sb3/README.md) |
| `frontend-angular13` | [stacks/frontend-angular13/](stacks/frontend-angular13/README.md) |

### Transversal (ambos backends o detalle UI)

| Área | Archivos |
|------|----------|
| Backend común | [ARCHITECTURE](backend/ARCHITECTURE.md), [CONVENTIONS](backend/CONVENTIONS.md), [TECH_STACK](backend/TECH_STACK.md), [TESTING](backend/TESTING.md) |
| Frontend común | [ARCHITECTURE](frontend/ARCHITECTURE.md), [CONVENTIONS](frontend/CONVENTIONS.md), [TECH_STACK](frontend/TECH_STACK.md) |

**Fuente de verdad corporativa** (siempre prevalece en conflicto):

- <https://gitlab.codesa.com.co/arquitectura/ia/codesa-sdd-templates>

---

## Contribuir

1. Cambios de **standards** o plantillas → merge request en `codesa-sdd-templates`.
2. Cambios de **flujo agéntico** o checklists de skills → merge request en `codesa-skills`.
3. Mantener rutas alineadas: `codesa-specs/specs/`, no `codesa-sdd-templates-develop` ni `.codesa/specs/`.

**Canal**: `#arquitectura-codesa` (o equivalente del proyecto).

---

## Licencia

Uso interno Codesa.

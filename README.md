# codesa-skills

Skills y guías operativas para **agentes de IA** (Cursor IDE, `cursor-agent`) en proyectos Codesa que adoptan **Spec-Driven Development (SDD)**.

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
├── skills/                   ← flujo agéntico (planes, TDD, review, …)
├── backend/                  ← arquitectura y convenciones comunes backend
└── frontend/                 ← arquitectura y convenciones comunes frontend
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
| Reglas Cursor | `.cursor/rules/` |

> **No usar** `.codesa/specs/` para specs — ese prefijo es solo para **config** de herramientas.

---

## Cómo usar con Cursor

### 1. Instalar SDD en el repo del proyecto

Seguir [INSTALL.md](https://gitlab.codesa.com.co/arquitectura/ia/codesa-sdd-templates/-/blob/main/INSTALL.md) del repo `codesa-sdd-templates` (script `install-codesa-sdd.ps1` / `.sh`).

### 2. Referenciar skills en el prompt del agente

Ejemplos:

```text
Antes de implementar, lee codesa-specs/agents/backend-developer.md y aplica el skill
writing-plans de codesa-skills (repo arquitectura/ia/codesa-skills).
```

```text
Tras completar tasks.md, ejecuta verificación según skills/verification.md de codesa-skills.
```

### 3. Flujo SDD recomendado

```
proposal.md → design.md → tasks.md
     ↓
writing-plans (skill) → implementing (agente + .cursor/rules)
     ↓
tdd → code-review → verification → finishing-branch
```

Integración inspirada en [obra/superpowers](https://github.com/obra/superpowers); los artefactos OpenSpec siguen siendo los de **codesa-sdd-templates** (`shared/templates/`).

---

## Skills disponibles

| Skill | Cuándo usarlo |
|-------|----------------|
| [writing-plans](skills/writing-plans.md) | Crear o refinar plan de implementación a partir de `tasks.md` |
| [code-review](skills/code-review.md) | Revisar PR contra standards y antipatrones |
| [tdd](skills/tdd.md) | Ciclo red-green-refactor en servicios y componentes |
| [verification](skills/verification.md) | Checklist pre-merge (tests, api-spec, docs) |
| [systematic-debugging](skills/systematic-debugging.md) | Investigar fallos con evidencia |
| [finishing-branch](skills/finishing-branch.md) | Cerrar rama, PR y archivar change OpenSpec |

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

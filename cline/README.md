# cline/ — artefactos listos para instalar en Cline

Esta carpeta es la traducción de `skills/`, `backend/`, `frontend/` y `stacks/` al vocabulario de **Cline** (VS Code): reglas (`.clinerules`, siempre activas) y workflows (`.clinerules/workflows/`, invocados con `/comando`). No duplica el contenido completo de los skills — cada regla y cada workflow apunta de vuelta a su fuente canónica en `skills/` o `stacks/<stack>/`.

Ver el porqué de esta separación en el análisis de arquitectura de integración (Cursor → Cline, capas vLLM / LiteLLM / Cline).

## Contenido

```
cline/
├── rules/
│   ├── base.md                    ← universal, siempre activa, independiente de stack
│   ├── backend-java11-sb27.md     ← cargar SOLO en repos de ese stack
│   ├── backend-java17-sb3.md      ← cargar SOLO en repos de ese stack
│   └── frontend-angular13.md      ← cargar SOLO en repos de ese stack
└── workflows/
    ├── plan.md     → /plan
    ├── review.md   → /review
    ├── tdd.md      → /tdd
    ├── verify.md   → /verify
    ├── debug.md    → /debug
    └── finish.md   → /finish
```

## Instalación en un repo de proyecto

Manual por ahora — no existe todavía un instalador automatizado equivalente a `install-codesa-sdd.ps1/.sh` (queda como trabajo pendiente, ver más abajo).

```bash
# Desde la raíz del repo de proyecto (después de instalar SDD con codesa-sdd-templates):
mkdir -p .clinerules/workflows

# 1. Regla base — siempre
cp <ruta-a-codesa-skills>/cline/rules/base.md .clinerules/base.md

# 2. Regla del stack — SOLO la que corresponde a este repo, nunca las tres
cp <ruta-a-codesa-skills>/cline/rules/<stack-de-este-repo>.md .clinerules/

# 3. Workflows — los 6, siempre
cp <ruta-a-codesa-skills>/cline/workflows/*.md .clinerules/workflows/
```

Cline detecta `.clinerules/` automáticamente al abrir el workspace; los archivos en `rules/` se inyectan en cada request, los de `workflows/` solo se activan cuando alguien escribe `/plan`, `/review`, etc. en el chat.

## Sobre el servidor MCP `codesa-context`

Los workflows están escritos para preferir el recurso MCP (`codesa://skills/<nombre>.md`) sobre un clon local de `codesa-skills`, siguiendo el patrón "referencia + fetch bajo demanda" en vez de cargar todo el contenido en cada request. Ver [`../mcp-server/README.md`](../mcp-server/README.md) para instalarlo — es un scaffold funcional para uso local (transporte stdio), no un servicio corporativo desplegado.

Si el servidor MCP no está configurado en un puesto de trabajo, los workflows funcionan igual siempre que `codesa-skills` esté clonado localmente junto al repo del proyecto — es el fallback documentado en cada workflow.

## Qué queda pendiente (fuera del alcance de este repo)

Estos puntos requieren acceso a infraestructura que no vive en `codesa-skills` — ver el documento de análisis de arquitectura para el detalle:

- **Instalador automatizado** que copie `cline/rules/<stack>.md` + `cline/workflows/` en un repo nuevo según su template SDD (hoy es manual, arriba).
- **Defaults y logging por virtual key en LiteLLM** — piso común de system prompt y métricas reales de adopción (recomendación 4 del análisis).
- **Piloto medible** con 1–2 equipos antes de un rollout a los 130 (recomendación 5).
- **Confirmar `max-model-len`** de la instancia vLLM con Qwen3.6-35B-A3B y ajustar el tamaño de `rules/` en consecuencia si el margen es ajustado (recomendación 6).

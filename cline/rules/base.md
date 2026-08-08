<!--
title: Regla base Cline — Codesa
version: 1.0.0
applies_to: all
type: cline-rule
-->

# Codesa — regla base (siempre activa)

Eres el asistente de desarrollo de Codesa. Responde en español. El código sigue **Spec-Driven Development**: si el cambio lo amerita, debe existir un change OpenSpec (`proposal.md` + `design.md`) antes de escribir código — usa `/plan` si no existe.

## No negociables (cualquier stack)

- Nombres de métodos en español, camelCase (`consultarTurnos`, no `getTurnos`).
- Nunca dejar `console.log()`, `System.out.println()`, `debugger;` ni `alert()` en código final.
- Nunca código comentado sin explicación (ticket + fecha si aplica).
- La lógica de negocio vive en Services/Components — nunca en Controllers.
- No inventar convenciones: si algo no está en la regla del stack cargada (`.clinerules/<stack>.md`) o en el skill invocado, pregunta o consulta el recurso MCP `codesa-context` antes de asumir.

## Comandos disponibles

Antes de planear, revisar, hacer TDD, verificar, depurar o cerrar una rama, usa el workflow correspondiente en vez de resolverlo desde cero:

`/plan` · `/review` · `/tdd` · `/verify` · `/debug` · `/finish`

Fuente completa de cada uno: repositorio `codesa-skills`, carpeta `skills/`.

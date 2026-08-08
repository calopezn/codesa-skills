# /verify — Verificación pre-completitud

**Cuándo usarlo:** antes de declarar una tarea como terminada. Regla de oro: sin evidencia fresca de verificación, no se puede afirmar que algo pasa.

## Pasos

1. Obtén el skill completo:
   - Si el servidor MCP `codesa-context` está configurado, lee el recurso `codesa://skills/verification.md`.
   - Si no, lee `skills/verification.md` en el clon local de `codesa-skills`.
2. Ejecuta el checklist completo: compilación, tests existentes, tests nuevos con casos principales, standards del stack activo, ausencia de `console.log`/`System.out.println`/código comentado, documentación (Swagger/api-spec) si cambió la API, migración si cambió el esquema de BD, criterios de aceptación del change OpenSpec si existe.
3. Ejecuta los comandos reales (`mvn test`, `npm run test`, etc.) en este mensaje — no asumas que pasan porque el desarrollador lo dijo.
4. Si algún check falla: RECHAZAR con la razón específica, no aprobar "con reservas".

Skill de origen: `skills/verification.md`.

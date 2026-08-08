# /review — Code review

**Cuándo usarlo:** cuando se solicite revisar código (un PR, un diff, o los archivos tocados en la sesión actual).

## Pasos

1. Obtén el skill completo:
   - Si el servidor MCP `codesa-context` está configurado, lee el recurso `codesa://skills/code-review.md`.
   - Si no, lee `skills/code-review.md` en el clon local de `codesa-skills`.
2. Revisa en este orden: Correctitud → Seguridad → Performance → Legibilidad.
3. Verifica los patrones y antipatrones específicos del stack activo (naming, capas, antipatrones prohibidos) contra `.clinerules/<stack>.md` y, si necesitas el detalle completo, contra `codesa://stacks/<stack>/` o `stacks/<stack>/` en el repo.
4. Clasifica cada hallazgo como BLOCKER / MAJOR / MINOR con justificación y fix propuesto — nunca solo señalar el problema.
5. Empieza siempre reconociendo lo que está bien hecho antes de listar hallazgos.

Skill de origen: `skills/code-review.md`.

# /plan — Crear plan de implementación

**Cuándo usarlo:** al recibir un ticket, antes de escribir cualquier código. No es para typos ni cambios triviales — para esos, PR directo.

## Pasos

1. Obtén el skill completo:
   - Si el servidor MCP `codesa-context` está configurado, lee el recurso `codesa://skills/writing-plans.md`.
   - Si no, lee `skills/writing-plans.md` en el clon local de `codesa-skills`.
2. Verifica antes de planear: ¿existe ticket? ¿existe change OpenSpec (`proposal.md` + `design.md`) aprobado? ¿se conoce el stack (`backend-java11-sb27`, `backend-java17-sb3`, `frontend-angular13`)?
3. Sigue la estructura de plan definida en el skill: header obligatorio, tareas ≤ 2 horas cada una, Step 0 = crear rama `feature/<ticket>-[back|front]`, sin placeholders.
4. No empieces a implementar hasta que la persona apruebe el plan.

Skill de origen: `skills/writing-plans.md` · Reglas del stack activo: `.clinerules/<stack>.md`.

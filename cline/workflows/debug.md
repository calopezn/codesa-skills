# /debug — Debugging sistemático

**Cuándo usarlo:** ante cualquier bug, test que falla o comportamiento inesperado — ANTES de proponer un fix. Especialmente bajo presión de tiempo, que es cuando más tienta saltarse el proceso.

## Pasos

1. Obtén el skill completo:
   - Si el servidor MCP `codesa-context` está configurado, lee el recurso `codesa://skills/systematic-debugging.md`.
   - Si no, lee `skills/systematic-debugging.md` en el clon local de `codesa-skills`.
2. Ley de hierro: **no hay fixes sin investigación de causa raíz primero.** Completa la Fase 1 (leer errores completos, reproducir, revisar cambios recientes, recolectar evidencia por capa) antes de proponer nada.
3. Fase 2: busca un patrón que sí funcione en el mismo codebase y compáralo.
4. Fase 3: formula UNA hipótesis explícita, pruébala con el cambio más pequeño posible.
5. Fase 4: crea un test de regresión antes de arreglar; un solo fix a la vez.
6. Si van 3+ fixes fallidos: STOP y cuestiona la arquitectura — no intentes un fix #4 sin discutirlo con la persona.

Skill de origen: `skills/systematic-debugging.md`.

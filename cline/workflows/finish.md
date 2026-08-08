# /finish — Cerrar rama y preparar PR

**Cuándo usarlo:** al preparar una rama para merge (PR/MR).

## Pasos

1. Obtén el skill completo:
   - Si el servidor MCP `codesa-context` está configurado, lee el recurso `codesa://skills/finishing-branch.md`.
   - Si no, lee `skills/finishing-branch.md` en el clon local de `codesa-skills`.
2. Verifica rama base y naming (`feature/[ticket]-back` o `-front`); nunca push directo a `main`/rama de integración; nunca force-push sin `--force-with-lease`.
3. Corre el checklist de pre-merge completo del skill (compilación, SonarQube, cobertura, ausencia de anti-patrones, tests con naming correcto) — si algo falla, no sigas a la descripción del PR.
4. Redacta la descripción del PR con la plantilla del skill: ¿Qué? ¿Por qué? ¿Cómo probarlo? Impacto (BD/API/dependencias/rendimiento). Referencia el change OpenSpec.
5. Usa Conventional Commits; squash de commits WIP antes de abrir el PR.
6. Tras el merge: actualizar el change OpenSpec a `archived` y eliminar la rama remota y local.

Skill de origen: `skills/finishing-branch.md`.

# /tdd — Test-Driven Development

**Cuándo usarlo:** al implementar reglas de negocio en `*ServiceImpl` o validaciones (obligatorio) — opcional pero recomendado para capas de infraestructura.

## Pasos

1. Obtén el skill completo:
   - Si el servidor MCP `codesa-context` está configurado, lee el recurso `codesa://skills/tdd.md`.
   - Si no, lee `skills/tdd.md` en el clon local de `codesa-skills`.
2. Antes de escribir código, identifica los casos de prueba necesarios (entradas, salidas esperadas, excepciones, casos límite).
3. Ciclo: escribe el test que falla (Red) → código mínimo para pasarlo (Green) → refactoriza sin romper tests (Refactor).
4. Sigue naming en español: `<metodoBajoTest>_<estadoDeEntrada>_<resultadoEsperado>()`. Bloques `// Arrange` `// Act` `// Assert` obligatorios.
5. Nunca `@SpringBootTest` en pruebas unitarias, nunca H2 para persistencia, nunca `Thread.sleep()`.

Skill de origen: `skills/tdd.md` · Cobertura mínima requerida: ver `.clinerules/<stack>.md`.

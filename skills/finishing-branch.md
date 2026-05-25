---
title: Finishing a Development Branch
version: 3.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: skill
---

# Finishing a Development Branch — Skills de Codesa

> **Alcance**: Cuando se te pida preparar una rama para merge (PR/MR), debes ejecutar este skill. Aplica a todos los proyectos Codesa (backend Java/Spring Boot y frontend Angular).
>
> **Versión**: 3.0.0 — Alineado con `codesa-sdd-templates` y referenciando [obra/superpowers](https://github.com/obra/superpowers)
> **Fuente de verdad**: `codesa-sdd-templates/shared/standards/base-standards.md`

## 0. Referencia: Superpowers

### Repositorio de Referencia

[obra/superpowers](https://github.com/obra/superpowers) es un repositorio de "superpowers" — skills y herramientas para mejorar la productividad de desarrollo con agentes IA.

### Skill de Finishing Branch en superpowers

El skill de finishing branch de superpowers se enfoca en preparar ramas para merge. El skill de Codesa extiende este concepto con:

- Checklist de pre-merge específico de Codesa (naming, arquitectura, seguridad)
- Verificación de compliance con specs OpenSpec
- Quality gates de SonarQube específicos de Codesa
- Convención de commits Conventional Commits

### Integración con SDD

El finishing branch verifica que todo el change SDD está completo antes del merge:

```
Finishing Branch Workflow:
  proposal.md → design.md → tasks.md → implementation → code-review → verification → finishing-branch → merge → archive
```

---

## 1. Antes de Preparar el PR

### Verificar Rama Base

- [ ] ¿La rama base es la correcta? (`develop-multiempresa` o `main` según proyecto)
- [ ] ¿La rama sigue el naming convention? (`feature/[ticket]-back` o `feature/[ticket]-front`)
- [ ] ¿La rama está actualizada con la rama base? (`git rebase origin/<base>` o `git merge origin/<base>`)

### Naming de Ramas

```
main / master          → rama protegida, solo merge de PRs aprobados
develop-multiempresa   → rama de integración (según proyecto)
feature/[ticket]-back  → feature backend
feature/[ticket]-front → feature frontend
hotfix/[ticket]        → correcciones urgentes a producción
release/[version]      → preparación de release
```

**Reglas:**

- [ ] **Prohibido**: push directo a `main` o a ramas de integración
- [ ] **Prohibido**: force-push a ramas compartidas
- [ ] **Obligatorio**: una rama = un ticket (MTQ-1234, SFL-5678, etc.)

## 2. Checklist de Pre-Merge

### Backend

#### Compilación

- [ ] `mvn clean compile` pasa sin errores
- [ ] `mvn test` pasa sin tests fallidos
- [ ] `mvn verify` pasa (JaCoCo coverage ≥ 70%)
- [ ] Checkstyle pasa (si se ejecuta)
- [ ] SpotBugs no reporta bugs críticos

#### Code Quality

- [ ] SonarQube Quality Gate passed: 0 bugs, 0 vulnerabilities, duplicación < 3%
- [ ] Cobertura JaCoCo: ServiceImpl ≥ 80%, Controller ≥ 70%, DAOImpl queries complejas ≥ 70%
- [ ] No hay archivos de configuración local commiteados

#### Código

- [ ] No hay código comentado sin explicación
- [ ] No hay `console.log()` o `System.out.println()` en producción
- [ ] No hay `Thread.sleep()` para sincronización
- [ ] No hay `@Disabled` en tests sin fecha y ticket
- [ ] No hay credenciales hardcodeadas
- [ ] No hay archivos `.env` o `application-local.yml` con credenciales

#### Naming

- [ ] Naming de clases: `*Controller`, `*Service`, `*ServiceImpl`, `*DTO`, `*Request`, `*Response`, `*DAO`, `*DAOImpl`, `*Repository`, `*Mapper`
- [ ] Naming de métodos: español, camelCase
- [ ] Naming de paquetes: `co.com.codesa.<proyecto>.<dominio>.<ms>`
- [ ] DTOs separados en `request/` y `response/`

#### Tests

- [ ] Tests nuevos tienen naming: `metodoBajoTest_estadoDeEntrada_resultadoEsperado()`
- [ ] Tests nuevos tienen bloques `// Arrange`, `// Act`, `// Assert`
- [ ] Tests de repositorio extienden `OracleTestBase`
- [ ] No hay `@SpringBootTest` en pruebas unitarias
- [ ] No hay H2 como base de datos de prueba

### Frontend

#### Compilación

- [ ] `npm run build-superflex` pasa sin errores
- [ ] `npm run lint` pasa sin warnings críticos
- [ ] `npm run test` pasa sin tests fallidos

#### Code Quality

- [ ] SonarQube Quality Gate passed
- [ ] Cobertura mínima: 60% en features nuevas

#### Código

- [ ] No hay `console.log()` en producción
- [ ] No hay `debugger;` en código
- [ ] No hay `alert()` en código
- [ ] No hay código comentado sin explicación
- [ ] No hay `// @ts-ignore` sin comentario

#### Naming

- [ ] Naming de componentes: `*Component.ts`
- [ ] Naming de servicios: `*Service.ts`
- [ ] Naming de carpetas: kebab-case

#### Tests

- [ ] Tests nuevos tienen `*component.spec.ts` correspondiente
- [ ] No hay `skip()` o `xit()` sin justificación

## 3. Commits

### Convención de Commits

```
feat(turnos): agrega fecha de apertura al modelo de turnos
fix(mensajes): corrige paginación cuando lista está vacía
refactor(persistencia): extrae query de jerarquías a método separado
test(apuestas): cubre caso de saldo insuficiente
docs(api): actualiza spec con nuevo endpoint /turnos/resumen
chore(deps): actualiza ojdbc8 a 21.5.0.0
```

### Reglas de Commits

- [ ] Cada commit tiene una intención clara
- [ ] No hay commits de "WIP" o "draft"
- [ ] No hay commits con mensajes genéricos como "fix", "update", "changes"
- [ ] Si hay múltiples commits WIP, hacer squash antes del PR

### Squash Commits

```bash
# Hacer squash de commits WIP
git rebase -i HEAD~N  # donde N = número de commits a squash
# Marcar todos como "squash" o "s" excepto el primero
```

## 4. Descripción del PR

**Cada PR DEBE incluir la siguiente descripción:**

```markdown
## PR: [Título del cambio]

### ¿Qué?
Resumen técnico del cambio (qué se cambió y por qué).

### ¿Por qué?
Ticket/contexto de negocio (por qué se hace este cambio).

### ¿Cómo probarlo?
1. [Pasos de verificación backend]
2. [Pasos de verificación frontend]

### Impacto
- **BD:** [Migraciones, nuevas tablas/columnas]
- **API:** [Nuevos endpoints, cambios en responses]
- **Dependencias:** [Nuevas librerías]
- **Rendimiento:** [Impacto esperado]

### OpenSpec
- [ ] Change OpenSpec asociado: `openspec/changes/<nombre>/`
- [ ] Todos los tasks completados y verificados
```

## 5. Flujo de Merge

### Para Backend

```bash
# 1. Asegurarse de estar en la rama correcta
git checkout feature/<ticket>-back

# 2. Actualizar con la rama base
git fetch origin
git rebase origin/develop-multiempresa

# 3. Verificar build
mvn clean verify

# 4. Verificar tests
mvn test

# 5. Si hay conflictos, resolverlos
# 6. Forzar push solo si se hizo rebase
git push origin feature/<ticket>-back --force-with-lease
```

### Para Frontend

```bash
# 1. Asegurarse de estar en la rama correcta
git checkout feature/<ticket>-front

# 2. Actualizar con la rama base
git fetch origin
git rebase origin/develop-multiempresa

# 3. Verificar build
npm run build-superflex

# 4. Verificar tests
npm run test

# 5. Verificar linting
npm run lint

# 6. Si hay conflictos, resolverlos
# 7. Forzar push solo si se hizo rebase
git push origin feature/<ticket>-front --force-with-lease
```

## 6. Post-Merge

### Para Backend

```bash
# 1. Verificar que el pipeline Jenkins pasó
# 2. Verificar despliegue a ambiente correspondiente
# 3. Actualizar OpenSpec change a "archived"
/opsx:archive <ticket>

# 4. Eliminar rama remota
git push origin --delete feature/<ticket>-back

# 5. Eliminar rama local
git branch -d feature/<ticket>-back
```

### Para Frontend

```bash
# 1. Verificar que el pipeline Jenkins pasó
# 2. Verificar despliegue a ambiente correspondiente
# 3. Actualizar OpenSpec change a "archived"
/opsx:archive <ticket>

# 4. Eliminar rama remota
git push origin --delete feature/<ticket>-front

# 5. Eliminar rama local
git branch -d feature/<ticket>-front
```

## 7. Anti-patrones de Branch Management

| Anti-patrón | Acción |
|---|---|
| Push directo a `main` | Prohibido. Crear PR con revisión. |
| Force-push a ramas compartidas | Prohibido. Usar `--force-with-lease`. |
| Rama con más de 5 días hábiles | Dividir en PRs más pequeños. |
| Rama sin ticket asociado | Prohibido. Una rama = un ticket. |
| PR con múltiples tickets | Dividir en PRs separados. |
| PR sin tests | No pasa revisión. |
| PR sin descripción | No se acepta. |
| Commits WIP en PR | Hacer squash antes de merge. |

## Reglas de Oro para Finishing Branch

1. **Siempre actualizar con la rama base antes de crear PR**
2. **Siempre ejecutar build y tests antes de crear PR**
3. **Siempre incluir descripción completa del PR**
4. **Siempre tener OpenSpec asociado (si aplica)**
5. **Siempre usar `--force-with-lease` si se hizo rebase**
6. **Siempre eliminar rama después de merge**
7. **Siempre actualizar OpenSpec change a "archived"**
8. **No hacer force-push a ramas compartidas sin `--force-with-lease`**
9. **No crear PRs con múltiples tickets**
10. **No crear PRs sin tests**
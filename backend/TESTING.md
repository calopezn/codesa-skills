---
title: Testing Backend
version: 2.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: testing
---

# Testing — Backend (Java/Spring Boot)

> **Alcance**: Frameworks, niveles y estrategias de testing para microservicios Java/Spring Boot en Codesa.
>
> **Filosofía SDD**: Los tests verifican que la implementación cumple los contratos del spec. Cada criterio de aceptación del proposal.md debe tener al menos un test.
>
> **Fuente de verdad**: `codesa-sdd-templates/shared/standards/testing-standards-backend.md`, `codesa-sdd-templates/shared/standards/base-standards.md`

---

## 0. Testing y SDD

### Regla Fundamental

```
Sin tests que verifiquen los criterios de aceptación del proposal.md →
El change SDD no está completo →
No pasa code review →
No se puede merge
```

### Relación entre SDD y Testing

| Artefacto SDD | Responsabilidad de Testing |
|---------------|---------------------------|
| **proposal.md** | Define criterios de aceptación → Cada criterio = al menos un test |
| **design.md** | Define decisiones técnicas → Tests de integración verifican decisiones |
| **specs/** | Define contratos API → Tests de contract verifican compatibilidad |
| **tasks.md** | Define tareas implementables → Cada tarea tiene verificación específica |

---

## 1. Frameworks de Testing

| Tecnología | Propósito | Propiedad SDD |
|-----------|-----------|---------------|
| **JUnit 5** | Framework principal de tests | Cada criterio de aceptación = test JUnit |
| **Mockito** | Mocking de objetos y dependencias | Tests unitarios aislados |
| **Spring Boot Test** | `@WebMvcTest`, `@DataJpaTest`; `@SpringBootTest` solo integración E2E del MS | Slice tests, no unit tests de servicio |
| **Testcontainers** | `gvenzl/oracle-xe:11-slim` | Tests de repositorio / persistencia — **nunca H2** |
| **Kafka Test** | `spring-kafka-test` para tests de mensajería | Verifica contratos de mensajes |
| **Java Snapshot Testing** | `java-snapshot-testing-junit5` (3.2.5) | Verifica que salida no cambia accidentalmente |

---

## 2. Niveles de Testing

### Tabla de Niveles

| Nivel | Herramienta | Responsable | Propiedad SDD |
|-------|-------------|-------------|---------------|
| **Unit** | JUnit 5 + Mockito | Dev autor del cambio | Verifica cada criterio de aceptación |
| **Integración** | Testcontainers | Dev autor | Verifica integración con BD real |
| **Contract** | REST Assured / WireMock | Arquitectura + Dev | Verifica compatibilidad de API |
| **E2E** | (no en MS backend) | QA + Dev | Verifica flujo completo |
| **Rendimiento** | JMeter / Gatling | QA (previo a release) | Verifica SLAs del proposal.md |

### Regla Fundamental

> **Sin unit tests que cubran los cambios → no pasa revisión de código**

---

## 3. Estructura de los Tests

### Carpetas

```
src/test/java/co/com/codesa/superflex/ms/core/
├── controllers/
│   ├── ValidaHoraControllerTest.java
│   ├── UtilsControllerTest.java
│   ├── TurnosControllerTest.java
│   ├── TrazabilidadControllerTest.java
│   ├── SesionTokenControllerTest.java
│   ├── ServiceTaskControllerTest.java
│   ├── ServerControllerTest.java
│   ├── JerarquiaControllerTest.java
│   ├── ConsultaServerControllerTest.java
│   ├── ConfiguraSistemaControllerTest.java
│   ├── ConfiguracionParameterControllerTest.java
│   ├── CodeErrorControllerTest.java
│   └── ...
├── mensajes/informacion/persistencia/
│   └── MensajeInformacionDAOImplTest.java
└── ...
```

### Naming de Clases y Métodos

| Tipo | Naming | Ejemplo |
|------|--------|---------|
| **Clases de test** | `*Test.java` | `TurnosControllerTest.java` |
| **Tests de controller** | `*ControllerTest.java` | `TurnosControllerTest.java` |
| **Tests de DAO** | `*DAOImplTest.java` | `MensajeInformacionDAOImplTest.java` |
| **Tests de service** | `*ServiceImplTest.java` | `TurnosServicesImplTest.java` |
| **Tests de repository** | `*RepositoryTest.java` | `TurnosRepositoryTest.java` |

### Estructura de Métodos de Test

```java
@Test
void nombreDelCaso_deberiaComportamientoEsperado() {
    // Given (arranque)
    // When (acción)
    // Then (verificación)
}
```

---

## 4. Qué se Mockea y Cómo

### Controllers

```java
@WebMvcTest(TurnosController.class)
class TurnosControllerTest {
    @MockBean
    private TurnosServices turnosServices;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void consultarTurnos_deberiaRetornarLista() {
        when(turnosServices.consultarTurnos(any())).thenReturn(listaTurnos);
        mockMvc.perform(get("/turnos"))
            .andExpect(status().isOk());
    }
}
```

### DAOs

```java
class MensajeInformacionDAOImplTest {
    @Mock
    private Repository repository;

    @InjectMocks
    private MensajeInformacionDAOImpl dao;

    @Test
    void consultar_deberiaRetornarMensaje() {
        when(repository.findById(any())).thenReturn(Optional.of(mensaje));
        assertEquals(mensaje, dao.consultar(id));
    }
}
```

### Servicios

```java
@ExtendWith(MockitoExtension.class)
class TurnosServicesImplTest {
    @Mock
    private TurnosDAO turnosDAO;

    @InjectMocks
    private TurnosServicesImpl turnosServices;

    @Test
    void registrar_deberiaGuardarEnBD() {
        when(turnosDAO.registrar(any())).thenReturn(turno);
        turnosServices.registrarTurnos(request);
        verify(turnosDAO, times(1)).registrar(any());
    }
}
```

---

## 5. Cobertura por Capa

| Capa | Cobertura Estimada | Evidencia |
|------|-------------------|-----------|
| **Controllers** | ~60-70% | 12+ tests de controllers identificados, pero hay 19 controllers en total |
| **Services** | [NO IDENTIFICADO] | No se identifican tests de services en la estructura visible |
| **DAOs** | [NO IDENTIFICADO] | Solo 1 test de DAO identificado |
| **Repositories** | [NO IDENTIFICADO] | No se identifican tests de repositories (probablemente no necesarios con Spring Data JPA) |
| **Mappers** | [NO IDENTIFICADO] | No se identifican tests de mappers (MapStruct genera código automático) |

**Cobertura general estimada**: ~40-50% (baja-moderada)

**Meta SDD**: Los tests deben cubrir TODOS los criterios de aceptación del proposal.md, independientemente de la cobertura general.

---

## 6. Quality Gates

### Herramientas de Análisis de Calidad

| Herramienta | Propósito | Meta SDD |
|------------|-----------|----------|
| **SpotBugs** | Análisis estático de bugs potenciales | 0 warnings críticos |
| **Checkstyle** | Verificación de estilo de código | 0 violations |
| **SonarQube** | Análisis de calidad de código | Quality gates deben pasar |
| **JaCoCo** | Cobertura de tests | ≥ 70% en código nuevo |

### Quality Gates Mínimos (SonarQube)

| Métrica | Meta |
|---------|------|
| **Bugs** | 0 bloqueantes/críticos |
| **Vulnerabilities** | 0 bloqueantes/críticas |
| **Code Smells** | No regresión respecto a main |
| **Duplicación** | < 3% |
| **Cobertura en código nuevo** | ≥ 70% backend |

---

## 7. Perfiles de Testing

| Perfil | Descripción |
|--------|-------------|
| **fast-build** | Skip de tests (`<skipTests>true</skipTests>`) — NO usar para PRs |
| **docker** | No afecta tests |
| **Tests por defecto** | Se ejecutan en fase `test` de Maven |

---

## 8. Checklist SDD para Testing Backend

Antes de marcar un change SDD como completo:

- [ ] **Cada criterio de aceptación** del proposal.md tiene al menos un test
- [ ] **Tests unitarios** cubren la lógica de negocio en `*ServiceImpl`
- [ ] **Tests de integración** verifican contratos de API
- [ ] **Tests de contract** verifican compatibilidad con consumidores
- [ ] **Cobertura mínima** de 70% en código nuevo
- [ ] **Quality gates** de SonarQube pasan
- [ ] **No hay tests que fallan** intencionalmente
- [ ] **Tests son deterministas** (no dependen de timing ni estado externo)
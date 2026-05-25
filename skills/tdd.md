---
title: Test-Driven Development
version: 3.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: skill
---

# Test-Driven Development — Skills de Codesa

> **Alcance**: Cuando se te pida asistir con TDD, debes ejecutar este skill. Aplica a todos los proyectos Codesa (backend Java/Spring Boot y frontend Angular).
>
> **Versión**: 3.0.0 — Alineado con `codesa-sdd-templates` y referenciando [obra/superpowers](https://github.com/obra/superpowers)
> **Fuente de verdad**: `codesa-sdd-templates/shared/standards/base-standards.md`, `testing-standards-backend.md`, `testing-standards-frontend.md`
>
> **Filosofía**: TDD donde aporte. Obligatorio para reglas de negocio en `*ServiceImpl` y validaciones. Opcional pero recomendado para capas de infraestructura.


## 0. Referencia: Superpowers

### Repositorio de Referencia

[obra/superpowers](https://github.com/obra/superpowers) es un repositorio de "superpowers" — skills y herramientas para mejorar la productividad de desarrollo con agentes IA.

### Skill de TDD en superpowers

El skill de TDD de superpowers se enfoca en Test-Driven Development general. El skill de Codesa extiende este concepto con:

- Standards de testing específicos de Codesa (Mockito, Testcontainers, OracleTestBase)
- Cobertura mínima requerida por capa (ServiceImpl ≥ 80%, Controller ≥ 70%)
- Naming de tests en español siguiendo convenciones corporativas
- Antipatrones documentados en `codesa-sdd-templates`
- Integración con OpenSpec (los tests verifican criterios de aceptación del proposal.md)

### Integración con SDD

TDD en Codesa se integra con el flujo SDD:

```
TDD + SDD Workflow:
  proposal.md (criterios de aceptación) → tests (verificar criterios) → code (pasar tests) → refactor → design.md
```

---

## 1. Antes de Escribir Código, Identificar los Casos de Prueba Necesarios

### Para Backend (Spring Boot)

**Preguntar antes de codificar:**

- [ ] ¿Qué entrada espera el método/endpoint?
- [ ] ¿Qué salida se espera para cada caso?
- [ ] ¿Qué excepciones se deben lanzar en casos de error?
- [ ] ¿Hay casos límite (null, empty, valores extremos)?
- [ ] ¿Hay reglas de negocio específicas documentadas en el change OpenSpec?

**Ejemplo para un servicio de Turnos:**

```java
// Casos de prueba para TurnosService.aperturar()
1. aperturar_sinTurnoAbierto_guardaYRetornaId()
2. aperturar_conTurnoYaAbierto_lanzaTurnoYaAbiertoException()
3. aperturar_vendedorInactivo_lanzaReglasNegocioException()
4. aperturar_montoMenorAMinimo_lanzaValidationException()
5. aperturar_vendedorNoExiste_lanzaNotFoundException()
```

### Para Frontend (Angular)

**Preguntar antes de codificar:**

- [ ] ¿Qué inputs espera el componente?
- [ ] ¿Qué outputs emite?
- [ ] ¿Cómo se comporta con datos válidos, inválidos, y vacíos?
- [ ] ¿Cómo se comporta en estados de carga y error?
- [ ] ¿Hay reglas de negocio específicas documentadas en el change OpenSpec?

**Ejemplo para un componente de Recargas:**

```typescript
// Casos de prueba para RecargasComponent
1. deberiaCrearComponente()
2. deberiaDesabilitarSubmitSiFormularioEsInvalido()
3. deberiaEmittirEventoRecargaSiFormularioEsValido()
4. deberiaMostrarErrorSiServicioFalló()
5. deberiaMostrarSpinnerSiServicioEstaCargando()
6. deberiaLimpiarFormularioDespuesDeEnviar()
```

## 2. Estructura de los Tests Según Testing Standards de Codesa

### Backend - Tests de Service (FASE 1)

**Obligatorio**: `@ExtendWith(MockitoExtension.class)`. **Nunca** `@SpringBootTest`.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TurnosServiceImplTest {

    @Mock private TurnosDAO turnosDAO;
    @Mock private VendedorFeignClient vendedorFeign;
    @Mock private TurnoMapper mapper;

    @InjectMocks
    private TurnosServiceImpl service;

    @Test
    @DisplayName("Aperturar turno exitoso cuando no hay turno previo abierto")
    void aperturarTurno_sinTurnoAbierto_guardaYRetornaId() {
        // Arrange
        AperturaTurnoRequest request = new AperturaTurnoRequest(42L, new BigDecimal("100000"));
        Turno turnoGuardado = new Turno(1L, 42L, LocalDateTime.now(), EstadoTurno.ABIERTO);
        when(turnosDAO.buscarAbiertoPorVendedor(42L)).thenReturn(Optional.empty());
        when(turnosDAO.guardar(any())).thenReturn(turnoGuardado);
        when(mapper.toAperturaResponse(turnoGuardado))
            .thenReturn(new AperturaTurnoResponse(1L, 42L));

        // Act
        AperturaTurnoResponse response = service.aperturar(request);

        // Assert
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getVendedorId()).isEqualTo(42L);
        verify(turnosDAO).buscarAbiertoPorVendedor(42L);
        verify(turnosDAO).guardar(any(Turno.class));
    }

    @Test
    void aperturarTurno_conTurnoAbiertoExistente_lanzaTurnoYaAbiertoException() {
        // Arrange
        Long vendedorId = 42L;
        when(turnosDAO.buscarAbiertoPorVendedor(vendedorId))
            .thenReturn(Optional.of(new Turno()));

        AperturaTurnoRequest request = new AperturaTurnoRequest(vendedorId, new BigDecimal("100000"));

        // Act & Assert
        assertThatThrownBy(() -> service.aperturar(request))
            .isInstanceOf(TurnoYaAbiertoException.class)
            .hasMessageContaining("ya tiene un turno abierto");

        verify(turnosDAO, never()).guardar(any());
    }
}
```

### Backend - Tests de Controller (FASE 2)

**Obligatorio**: `@WebMvcTest(<Controller>.class)`. Mockear `JwtAuthenticationFilter`.

```java
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(TurnosController.class)
class TurnosControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean private TurnosService turnosService;
    @MockBean private JwtAuthenticationFilter jwtFilter;

    @Test
    @WithMockUser(roles = "VENDEDOR")
    void aperturarTurno_requestValido_retorna201() throws Exception {
        // Arrange
        AperturaTurnoRequest request = new AperturaTurnoRequest(42L, new BigDecimal("100000"));
        AperturaTurnoResponse response = new AperturaTurnoResponse(1L, 42L);
        when(turnosService.aperturar(any())).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/turnos")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.vendedorId").value(42));
    }

    @Test
    void aperturarTurno_sinAutenticacion_retorna401() throws Exception {
        AperturaTurnoRequest request = new AperturaTurnoRequest(42L, new BigDecimal("100000"));

        mockMvc.perform(post("/turnos")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "VENDEDOR")
    void aperturarTurno_bodyInvalido_retorna400() throws Exception {
        mockMvc.perform(post("/turnos")
                .contentType(APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest());
    }
}
```

### Backend - Tests de Repository con Oracle + Testcontainers (FASE 3)

**Clase base — copiar tal cual:**

```java
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.OracleContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

@DataJpaTest
@AutoConfigureTestDatabase(replace = NONE)
@Testcontainers
public abstract class OracleTestBase {

    @Container
    static OracleContainer oracle =
        new OracleContainer("gvenzl/oracle-xe:11-slim")
            .withDatabaseName("XEPDB1")
            .withUsername("testuser")
            .withPassword("testpass")
            .withReuse(true);

    @DynamicPropertySource
    static void registrar(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", oracle::getJdbcUrl);
        registry.add("spring.datasource.username", oracle::getUsername);
        registry.add("spring.datasource.password", oracle::getPassword);
        registry.add("spring.datasource.driver-class-name",
            () -> "oracle.jdbc.OracleDriver");
        registry.add("spring.jpa.database-platform",
            () -> "org.hibernate.dialect.Oracle10gDialect");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.cloud.vault.enabled", () -> "false");
        registry.add("spring.cloud.consul.enabled", () -> "false");
    }
}
```

**Patrón obligatorio — prueba de repositorio:**

```java
class TurnoRepositoryTest extends OracleTestBase {

    @Autowired private TurnoRepository repository;
    @Autowired private TestEntityManager em;

    @Test
    void findByVendedorIdAndEstado_conTurnoAbierto_retornaOptional() {
        // Arrange
        Turno turno = new Turno();
        turno.setVendedorId(42L);
        turno.setEstado(EstadoTurno.ABIERTO);
        turno.setFechaApertura(LocalDateTime.now());
        em.persist(turno);
        em.flush();
        em.clear();  // OBLIGATORIO: fuerza SQL real, evita cache L1

        // Act
        Optional<Turno> resultado = repository.findByVendedorIdAndEstado(42L, EstadoTurno.ABIERTO);

        // Assert
        assertThat(resultado).isPresent();
        assertThat(resultado.get().getVendedorId()).isEqualTo(42L);
    }
}
```

### Frontend - Tests de Componente (Karma + Jasmine)

```typescript
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TurnosComponent } from './turnos.component';
import { TurnosService } from './services/turnos.service';
import { of, throwError } from 'rxjs';
import { PaginaTurnoDTO } from '../dto/pagina-turno.dto';

describe('TurnosComponent', () => {
  let component: TurnosComponent;
  let fixture: ComponentFixture<TurnosComponent>;
  let turnosServiceSpy: jasmine.SpyObj<TurnosService>;
  let httpMock: HttpTestingController;

  const mockTurno = { id: 1, vendedorId: '42', estado: 'ABIERTO' };
  const mockResponse: PaginaTurnoDTO = {
    contenido: [mockTurno],
    totalElements: 1,
    totalPages: 1
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosComponent],
      imports: [HttpClientTestingModule],
      providers: [{
        provide: TurnosService,
        useValue: jasmine.createSpyObj(['obtenerTurnos'])
      }]
    }).compileComponents();

    turnosServiceSpy = TestBed.inject(TurnosService) as any;
    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deberiaCrearComponente', () => {
    expect(component).toBeTruthy();
  });

  it('deberiaMostrarListaDeTurnosAlInicializar', () => {
    // Arrange
    turnosServiceSpy.obtenerTurnos.and.returnValue(of(mockResponse));

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.turnos).toBeDefined();
    expect(component.turnos.length).toBe(1);
    expect(component.turnos[0].id).toBe(1);
  });

  it('deberiaMostrarMensajeErrorSiServicioFalló', () => {
    // Arrange
    const errorResponse = new HttpErrorResponse({ error: 'Error del servidor' });
    turnosServiceSpy.obtenerTurnos.and.returnValue(throwError(() => errorResponse));

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.error).toBeTruthy();
  });
});
```

## 3. Cómo Nombrar los Tests de Forma Descriptiva

### Convención recomendada (español, como el código de Codesa):

```
<metodoBajoTest>_<estadoDeEntrada>_<resultadoEsperado>()
```

### Ejemplos Backend:

```java
aperturarTurno_sinTurnoAbierto_guardaYRetornaId()
aperturarTurno_conTurnoYaAbierto_lanzaExcepcionNegocio()
consultarTurno_idInexistente_retornaNotFound()
listarTurnos_sinFiltros_retornaPaginaCompleta()
validarMonto_menorAMinimo_lanzaValidationException()
```

### Ejemplos Frontend:

```typescript
deberiaDesabilitarBotonSubmitSiFormularioEsInvalido()
deberiaMostrarMensajeErrorSiServicioFalló()
deberiaActualizarMonedaAlSuscribirseAService()
deberiaMostrarListaDeTurnosAlInicializar()
```

## 4. Qué Mockear y Qué No Según las Capas de Codesa

### Backend

| Capa | Mockear | No Mockear |
|------|---------|------------|
| **Controller** | Service, Repository, JwtAuthenticationFilter | Controller mismo, MockMvc |
| **Service** | DAO, otros Services, KafkaTemplate | Service implementation |
| **DAO** | Repository | DAO implementation |
| **Repository** | [Generalmente no se testea con Spring Data JPA] | - |

### Frontend

| Capa | Mockear | No Mockear |
|------|---------|------------|
| **Component** | Servicios inyectados, HttpTestingController | Component mismo, Template |
| **Service** | HttpClient (via HttpTestingController), otros Servicios | Service mismo |
| **Pipe** | Ninguno (son puros) | Pipe mismo |

## 5. El Ciclo Red-Green-Refactor en el Contexto de Codesa

### Red (Escribir el test que falla)

```java
@Test
void aperturarTurno_vendedorInactivo_lanzaReglasNegocioException() {
    // Arrange
    Long vendedorId = 99L;
    when(vendedorFeign.consultar(vendedorId)).thenReturn(new VendedorDTO(99L, "Inactivo", false));

    AperturaTurnoRequest request = new AperturaTurnoRequest(vendedorId, new BigDecimal("100000"));

    // Act & Assert
    assertThatThrownBy(() -> service.aperturar(request))
        .isInstanceOf(ReglasNegocioException.class)
        .hasMessageContaining("vendedor inactivo");
}
```

### Green (Escribir el código mínimo para pasar el test)

```java
public AperturaTurnoResponse aperturar(AperturaTurnoRequest request) {
    VendedorDTO vendedor = vendedorFeign.consultar(request.getVendedorId());
    if (!vendedor.isActivo()) {
        throw new ReglasNegocioException("El vendedor está inactivo");
    }
    // ... resto de la implementación
}
```

### Green (Verificar que el test pasa)

```bash
# Ejecutar tests
mvn test

# O build rápido (sin checkstyle/spotbugs)
mvn test -P fast-build
```

### Refactor (Mejorar el código sin romper los tests)

- Extraer métodos
- Mejorar nombres
- Eliminar duplicación
- Optimizar performance

**Regla**: Los tests deben seguir pasando después del refactor.

## 6. Cuándo Sugerir Tests de Integración vs Unitarios

### Tests Unitarios (cuándo usarlos)

- **Backend**: Tests de servicios y DAOs con dependencias mockeadas
- **Frontend**: Tests de componentes con servicios mockeados
- **Cuándo**: Para lógica de negocio compleja, validaciones, transformaciones

### Tests de Integración (cuándo usarlos)

- **Backend**: Tests que requieren BD real (usar Testcontainers con Oracle XE)
- **Backend**: Tests que requieren Kafka (usar embedded Kafka)
- **Backend**: Tests de endpoints completos (`@SpringBootTest` + Testcontainers)
- **Frontend**: Tests E2E con Cypress o Playwright
- **Cuándo**: Para verificar que las capas funcionan juntas correctamente

### Regla general:

- **80% unitarios**, **20% integración**
- Los unitarios son rápidos y aislados
- Los integración son lentos pero cubren escenarios reales

## 7. Reglas Absolutas — Nunca Ignorar

```
NUNCA usar @SpringBootTest en pruebas unitarias.
NUNCA usar H2 como base de datos de prueba de persistencia.
NUNCA omitir em.clear() después de em.flush() en pruebas de repositorio.
NUNCA escribir pruebas sin al menos una aserción.
NUNCA usar Thread.sleep() para sincronización.
NUNCA usar lógica condicional (if/for) dentro de un método de prueba.
NUNCA dejar @Disabled sin comentario con fecha y ticket GitLab/Jira.
NUNCA nombrar métodos test1(), prueba1(), testOk() ni similares.
NUNCA depender del orden de ejecución entre tests.
NUNCA commitear tests que conectan a recursos externos reales (producción, staging).
```

## 8. Cobertura Mínima Requerida

| Componente | Cobertura mínima |
|---|---|
| `*ServiceImpl` | **80%** |
| `*Controller` | **70%** |
| `*DAOImpl` con queries complejas | **70%** |
| Validators, Mappers | **90%** |
| `*Repository` (solo `@Query` custom) | **100%** |
| DTOs, `@Entity`, `@Configuration` | No aplica (excluir de JaCoCo) |

## 9. Herramientas Específicas del Stack de Codesa

### Backend

```bash
# Ejecutar todos los tests
mvn test

# Ejecutar tests sin checkstyle/spotbugs (más rápido)
mvn test -P fast-build

# Ejecutar solo un test
mvn test -Dtest=TurnosControllerTest

# Ejecutar solo un método de test
mvn test -Dtest=TurnosControllerTest#aperturarTurno_sinTurnoAbierto_guardaYRetornaId

# Verificar cobertura JaCoCo
mvn verify

# Reporte HTML cobertura
# → target/site/jacoco/index.html
```

### Frontend

```bash
# Ejecutar tests unitarios (Karma)
npm run test

# Ejecutar tests en modo watch (re-ejecutar al cambiar archivo)
npm run test -- --watch=true

# Ejecutar tests E2E (Cypress/Playwright)
npm run e2e

# Generar reporte de cobertura
npm run test -- --code-coverage
```

## 10. Checklist de una Clase de Prueba

Antes de dar por terminada cualquier clase:

- [ ] Nombre de métodos sigue `metodoBajoTest_estado_resultado`.
- [ ] Cada test tiene bloques `// Arrange`, `// Act`, `// Assert`.
- [ ] No usa `@SpringBootTest` (salvo integración explícita).
- [ ] No usa H2.
- [ ] Servicio: usa `@ExtendWith(MockitoExtension.class)` + `@Mock`/`@InjectMocks`.
- [ ] Controller: usa `@WebMvcTest`, `@MockBean JwtAuthenticationFilter`, `@WithMockUser`.
- [ ] Repository: extiende `OracleTestBase`, llama `em.clear()` después de `em.flush()`.
- [ ] Toda `@Query` nueva tiene al menos una prueba.
- [ ] Cada test tiene ≥ 1 `assertThat(...)` o `assertThatThrownBy(...)`.
- [ ] No usa `Thread.sleep()`.
- [ ] Si hay `@Disabled`, incluye fecha y ticket.
- [ ] Tests son independientes (pueden ejecutarse en cualquier orden).
- [ ] Test no depende de datos preexistentes en BD.

## 11. Antipatrones de Testing

- ❌ `@SpringBootTest` para probar un Service. Arranca 2-5 segundos por test. Usar Mockito.
- ❌ `Thread.sleep(5000)` para esperar async. Usar `Awaitility`.
- ❌ `try { ... fail(); } catch (Exception e) { ... }`. Usar `assertThatThrownBy`.
- ❌ Mockear lo que se está probando: si se prueba `TurnosServiceImpl`, no se mockea él mismo.
- ❌ Tests que solo verifican que el código no lanza excepción (sin aserciones reales).
- ❌ Un test que prueba 10 cosas a la vez. Un test = un escenario.
- ❌ Datos de prueba con `id = 1` hardcodeado cuando el ID lo genera la BD.

## Reglas de Oro para TDD en Codesa

1. **Escribir el test ANTES del código**. Nunca al revés.
2. **El test debe fallar primero**. Si pasa sin código, está mal escrito.
3. **Escribir solo el código mínimo para pasar el test**. No más.
4. **Refactorizar después de que el test pase**. Mejorar sin romper.
5. **Usar naming descriptivo en español** para los tests.
6. **Mockear solo dependencias externas** (BD, APIs, servicios remotos).
7. **No mockear lo que se está testeando** (el service, el component, el DAO).
8. **Los tests deben ser independientes**. Cada test debe poder correr solo.
9. **Los tests deben ser reproducibles**. No depender de estado global ni tiempo.
10. **Correr todos los tests antes de hacer commit**. `mvn test` o `npm run test`.
11. **Seguir la convención de naming**: `metodoBajoTest_estadoDeEntrada_resultadoEsperado()`
12. **Incluir bloques `// Arrange`, `// Act`, `// Assert`** en cada test
13. **Cobertura mínima**: ServiceImpl ≥ 80%, Controller ≥ 70%, DAOImpl queries complejas ≥ 70%
14. **80% unitarios, 20% integración**
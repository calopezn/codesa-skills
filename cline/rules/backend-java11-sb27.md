<!--
title: Regla Cline — backend-java11-sb27
version: 1.0.0
applies_to: backend-java11-sb27
type: cline-rule
-->

# Stack: backend-java11-sb27

Java 11, Spring Boot 2.7.8, Springfox 3 (OpenAPI), Spring Cloud Sleuth + Zipkin, namespace `javax.*`. Mayoría de microservicios Superflex en producción.

## Naming

| Capa | Convención |
|---|---|
| Controller | `*Controller.java` |
| Service | `*Service` (interfaz) + `*ServiceImpl` |
| DTO | `*DTO`, `*Request`, `*Response` — separados en `request/` y `response/` |
| DAO | `*DAO` + `*DAOImpl` |
| Repository | `*Repository` (Spring Data JPA) |
| Mapper | `*Mapper` (MapStruct) |

Paquete raíz: `co.com.codesa.<proyecto>.<dominio>.<ms>`. Eventos de dominio en pasado (`ClienteRegistrado`, `PagoProcesado`).

## No negociable

- Inyección por constructor (`@RequiredArgsConstructor` + `final`) — nunca `@Autowired` en campo.
- `@Transactional` solo en `*ServiceImpl`; nunca en `@Repository`.
- `Optional<T>` solo como tipo de retorno, nunca en parámetros ni campos.
- `java.time.*`, nunca `new Date()` / `SimpleDateFormat`.
- Tests de Service: `@ExtendWith(MockitoExtension.class)` — nunca `@SpringBootTest` en pruebas unitarias.
- Tests de persistencia: Testcontainers Oracle (`gvenzl/oracle-xe:11-slim`) — nunca H2.
- Cobertura JaCoCo mínima: `*ServiceImpl` 80%, `*Controller` 70%, `*DAOImpl` con queries complejas 70%.

## OpenAPI

Fuente de verdad: `codesa-specs/specs/api-spec.yml`, no la UI de Swagger generada por Springfox. Si hay discrepancia, alinear en el mismo PR.

Detalle completo: [`stacks/backend-java11-sb27/`](../../stacks/backend-java11-sb27/) en el repo `codesa-skills`, o recurso MCP `codesa://stacks/backend-java11-sb27/`.

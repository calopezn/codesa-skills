<!--
title: Regla Cline — frontend-angular13
version: 1.0.0
applies_to: frontend-angular13
type: cline-rule
-->

# Stack: frontend-angular13

Angular 13+, TypeScript ~4.4, PrimeNG 13 + PrimeFlex, RxJS ~6.6, ngx-translate. SPAs POS y back-office. Consumo de APIs vía Gateway: `/api/v1/<dominio>/**`.

## Naming

| Elemento | Convención |
|---|---|
| Componentes | `*Component.ts` |
| Servicios | `*Service.ts` |
| Pipes | `*Pipe.ts` |
| Carpetas de features | kebab-case (`carro-compras`, no `carroCompras`) |
| Archivos | `kebab-case.component.ts` |

## No negociable

- Lógica de negocio en Services, nunca en Components. Nunca HTTP calls directas en un Component.
- Reactive Forms para formularios complejos.
- `??` para `null`/`undefined`; `||` solo cuando `0`, `''` o `false` deban tratarse como default.
- Early return / guard clauses en vez de pirámides de `if`.
- Suscripciones RxJS con `takeUntil`, `async pipe` o cleanup explícito — nunca memory leaks por falta de unsubscribe.
- Enums en vez de magic strings; nada de `any` sin justificación.
- Textos visibles internacionalizados con ngx-translate — nunca hardcodeados en español en el código.
- Estilos en SCSS separado por componente, nunca inline salvo caso muy puntual.
- Tests: mockear `HttpClient` vía `HttpTestingController`; nunca commitear `fdescribe`/`fit`.

## Artefactos SDD propios de este stack

- `codesa-specs/specs/api-catalog.md` — actualizar si se consume un nuevo MS o ruta Gateway.
- `codesa-specs/specs/ui-inventory.md` — actualizar si se agrega pantalla, guard o ruta lazy.
- La fuente de verdad del contrato REST sigue siendo el `api-spec.yml` del MS backend, no este catálogo.

Detalle completo: [`stacks/frontend-angular13/`](../../stacks/frontend-angular13/) en el repo `codesa-skills`, o recurso MCP `codesa://stacks/frontend-angular13/`.

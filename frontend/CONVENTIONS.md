---
title: Convenciones y Contratos Frontend
version: 2.0.0
last_updated: 2026-05-14
status: stable
owner: Arquitectura Codesa
applies_to: all
type: convention
---

# Convenciones y Contratos — Frontend (Angular/TypeScript)

> **Alcance**: Convenciones de código y contratos API para frontends Angular en Codesa.
>
> **Filosofía SDD**: Contrato primero, luego código. Los contratos API se definen en el backend (`api-spec.yml`) y el frontend los implementa.
>
> **Fuente de verdad**: `codesa-sdd-templates/shared/standards/base-standards.md`, `codesa-sdd-templates/shared/standards/typescript-style-guide.md`, `codesa-sdd-templates/templates/frontend-angular13/codesa-specs/specs/frontend-standards.md`

---

## 0. Contrato Primero (API-First) para Frontend

### Regla Fundamental

```
EL FRONTEND IMPLEMENTA CONTRATOS DEFINIDOS EN EL BACKEND:
1. Backend define spec OpenAPI (api-spec.yml) ← ANTES del código
2. Frontend implementa servicios que consumen esos contratos
3. Si hay discrepancia → el spec del backend es correcto
```

### Ubicación de Contratos

```
<repo-backend>/
└── .codesa/
    └── specs/
        └── specs/
            └── api-spec.yml          ← Fuente de verdad para el frontend

<repo-frontend>/
└── src/
    └── app/
        └── core/
            └── services/             ← Servicios que implementan contratos del backend
```

### Reglas de Contrato para Frontend

1. **Los servicios frontend consumen los endpoints definidos en el spec OpenAPI del backend**
2. **Los interfaces TypeScript deben ser compatibles con el spec OpenAPI**
3. **Si hay discrepancia entre el spec y la implementación → el spec es correcto**
4. **Los DTOs del frontend reflejan los DTOs definidos en `sf-comun-dtos`**

---

## 1. Convenciones de Naming

### Componentes

| Responsabilidad | Sufijo | Ejemplo |
|-----------------|--------|---------|
| Componentes Angular | `*Component` | `AppComponent`, `LoginComponent`, `TurnosComponent` |
| Archivos | `kebab-case.component.ts` | `app.component.ts`, `login.component.ts` |
| Templates | `kebab-case.component.html` | `app.component.html`, `app-menu.component.html` |
| Estilos | `kebab-case.component.scss` | `app.component.scss`, `app-menu.component.scss` |

### Módulos Angular

| Responsabilidad | Sufijo | Ejemplo |
|-----------------|--------|---------|
| Módulos | `*Module` | `AppModule`, `CoreModule`, `SharedModule` |
| Archivos | `kebab-case.module.ts` | `app.module.ts`, `core.module.ts` |

### Servicios

| Responsabilidad | Sufijo | Ejemplo |
|-----------------|--------|---------|
| Servicios | `*Service` | `MenuService`, `ThemeService`, `AlertService` |
| Interceptors | `*Interceptor` | `JwtInterceptor`, `LoaderInterceptorService` |
| Archivos | `kebab-case.service.ts` | `menu.service.ts`, `jwt-interceptor.ts` |

### Pipes

| Responsabilidad | Sufijo | Ejemplo |
|-----------------|--------|---------|
| Pipes | `*Pipe` | `DateFormatPipe`, `CreateArrayFormPipe` |
| Archivos | `kebab-case.pipe.ts` | `date-format.pipe.ts` |

### Interfaces y Types

- **CamelCase descriptivo** para interfaces TypeScript
- **Interfaces para DTOs** que vienen del backend
- **Interfaces para configuración de componentes**
- **Interfaces para eventos y callbacks**

### Funciones y Variables

- **camelCase** estándar TypeScript
- **Constantes**: `UPPER_SNAKE_CASE` para constantes globales
- Variables en español cuando el proyecto ya lo está: `moneda`, `locale`, `respuesta`

### Carpetas de Features

- **kebab-case** para nombres de módulos de funcionalidad:
  - `features/login/`, `features/home/`, `features/carro-compras/`
  - `features/recargas/`, `features/giros/`, `features/papeleria/`

---

## 2. Estructura de Carpetas

```
src/
├── app/
│   ├── core/                        # Módulo central (servicios, interceptores, utilidades)
│   │   ├── interceptors/            # Interceptores HTTP
│   │   │   ├── jwt-interceptor.ts
│   │   │   └── loader-interceptor.ts
│   │   └── services/                # Servicios centrales
│   │       ├── menu.service.ts
│   │       ├── theme.service.ts
│   │       └── alert.service.ts
│   ├── features/                    # Módulos de funcionalidad por negocio
│   │   ├── login/                   # Autenticación
│   │   ├── home/                    # Página principal
│   │   ├── carro-compras/           # Carrito de compras
│   │   ├── inventarios/             # Gestión de inventarios
│   │   ├── recargas/                # Recargas de servicios
│   │   ├── giros/                   # Gestión de giros
│   │   ├── pagos-premios/           # Pago de premios
│   │   ├── papeleria/               # Venta de papelería
│   │   ├── operaciones-inusuales/   # Operaciones inusuales
│   │   └── cambio-contrasena/       # Cambio de contraseña
│   ├── shared/                      # Componentes, pipes, directives reutilizables
│   │   ├── components/              # Componentes compartidos
│   │   ├── pipes/                   # Pipes compartidos
│   │   ├── directives/              # Directives compartidos
│   │   └── shared.module.ts         # Módulo compartido
│   ├── config/                      # Configuraciones generales
│   ├── app.module.ts                # Módulo principal
│   ├── app-routing.module.ts        # Routing
│   ├── app.component.ts             # Componente raíz
│   ├── app.topbar.component.ts      # Barra superior
│   ├── app.menu.component.ts        # Menú lateral
│   ├── app.footer.component.ts      # Pie de página
│   └── app.main.component.ts        # Contenido principal
├── assets/
│   ├── i18n/                        # Archivos de internacionalización (*.json)
│   ├── theme/                       # Temas Sass
│   └── layout/css/                  # Estilos de layout
├── environments/                    # Configuraciones por entorno
│   ├── environment.ts               # Desarrollo
│   ├── environment.prod.ts          # Producción
│   └── environment.stg.ts           # Staging
├── main.ts                          # Punto de entrada
├── polyfills.ts                     # Polyfills
├── styles.scss                      # Estilos globales
└── index.html                       # HTML principal
```

---

## 3. Convenciones de Idioma

| Elemento | Idioma | Ejemplo |
|----------|--------|---------|
| Componentes y módulos (responsabilidad) | Inglés técnico | `Component`, `Service`, `Module` |
| Funcionalidades (dominio) | Español | `login`, `carro-compras`, `recargas` |
| Comentarios | Español | `// Registra el locale de Paraguay` |
| Variables | Mixto español-inglés | `moneda`, `locale`, `themeService` |
| Textos visibles | Internacionalizados | ngx-translate |

---

## 4. Estilos y Temas

| Aspecto | Detalle |
|---------|---------|
| **Preprocesador** | Sass/SCSS |
| **Archivos de estilo** | `*.component.scss` junto a cada componente |
| **Temas** | Sistema de temas basado en Sass (`superflex`, `8100003178`, `123456789`) |
| **Layout** | PrimeFlex 2.0.0 (utility-first) + PrimeNG 13.0.2 |
| **Estilos globales** | `styles.scss` para estilos aplicados a toda la aplicación |
| **No hay estilos inline** | Excepto casos muy específicos |

---

## 5. Props e Interfaces TypeScript

| Aspecto | Detalle |
|---------|---------|
| **Interfaces TypeScript** | Tipado fuerte para DTOs, configuración, eventos |
| **@Input() y @Output()** | Decoradores de Angular para comunicación padre-hijo |
| **Interfaces genéricas** | Para respuestas genéricas de API |
| **Tipos inline** | Para tipos simples y callbacks |
| **Prohibido `any`** | Salvo justificación explícita en comentario |

---

## 6. Programación Reactiva (RxJS)

| Regla | Detalle |
|-------|---------|
| **Suscripciones con cleanup** | Usar `takeUntil`, `async pipe`, o cleanup explícito |
| **No hay memory leaks** | Suscripciones sin unsubscribe están prohibidas |
| **Observables para datos asíncronos** | No hay callbacks ni Promesas sin convertir a Observable |
| **`.map()`, `.filter()`, `.reduce()`** | Sobre bucles `for` para transformaciones |
| **Early return / Guard clauses** | En lugar de pirámide de `if` |

---

## 7. Nullish Coalescing y Tipos

| Operador | Uso | Ejemplo |
|----------|-----|---------|
| **`??`** | Para `null`/`undefined` | `nombre ?? 'Sin nombre'` |
| **`||`** | Solo para `0`, `''`, `false` como default | `cantidad || 1` |
| **Enums** | En lugar de magic strings | `enum Estado { ACTIVO, INACTIVO }` |
| **`Record<Enum, X>`** | Para mapeos exhaustivos | `Record<Estado, string>` |

---

## 8. Convenciones de Linting y Formato

| Herramienta | Propósito |
|------------|-----------|
| **ESLint 8.12.0** | Con configuración Airbnb TypeScript |
| **Prettier 2.6.2** | Formateo automático |
| **SonarLint** | Análisis estático adicional en VSCode |
| **Build en Jenkins** | Falla si hay errores de linting |

### Reglas de Formato

```bash
# Auto-corrección de errores automatizables
ng lint --fix

# Verificación de estilo
ng lint
```

---

## 9. Antipatrones Frontend

| Anti-patrón | Acción |
|-------------|--------|
| `// @ts-ignore` sin comentario | Eliminar o justificar con ticket + fecha |
| Casts agresivos `(x as Foo).bar` | Validar con type guard |
| Tipos primitivos boxed (`String`, `Number` con mayúscula) | Usar `string`, `number` |
| Retornos implícitos `undefined` | Tipar el retorno y devolver explícitamente |
| `console.log()` en producción | Eliminar |
| `debugger;` en código | Eliminar |
| `alert()` en código | Usar SweetAlert2 o AlertService |
| Código comentado sin explicación | Eliminar o documentar con ticket |
| HTTP calls directamente en Components | Delegar al Service |
| `any` sin justificación | Usar interface o tipo específico |

---

## 10. Checklist SDD para Frontend

Antes de iniciar cualquier implementación frontend:

- [ ] **Spec OpenAPI del backend** definido con los endpoints necesarios
- [ ] **Interfaces TypeScript** compatibles con el spec OpenAPI
- [ ] **proposal.md** del change SDD incluye impacto frontend
- [ ] **tasks.md** desglosado en tareas ≤ 2 horas cada una
- [ ] **Step 0** de tasks.md: Crear rama `feature/[ticket]-frontend`
- [ ] **ui-inventory.md** actualizado si hay nuevas pantallas/features
- [ ] **Textos internacionalizados** (ngx-translate), no hardcodeados
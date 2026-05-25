---
title: Arquitectura Frontend
version: 2.0.0
last_updated: 2026-05-25
status: stable
owner: Arquitectura Codesa
applies_to: all
type: architecture
---

# Arquitectura — Frontend (Angular 13+)

> **Alcance**: Arquitectura y patrones para aplicaciones Angular 13+ en Codesa (ej. piloto `sf-pos-web-unificado`).
>
> **Filosofía SDD**: Los cambios de UI/contrato se planifican en `design.md` antes de implementar. El catálogo de APIs consumidas vive en `api-catalog.md`.
>
> **Fuente de verdad**: [codesa-sdd-templates](https://gitlab.codesa.com.co/arquitectura/ia/codesa-sdd-templates) — `templates/frontend-angular13/codesa-specs/specs/frontend-standards.md`, `shared/standards/base-standards.md`

---

## 0. Arquitectura SDD (Spec-Driven)

### Principio fundamental

```
Catálogo de APIs + criterios en proposal → Código Angular → Review verifica compliance
```

### Artefactos arquitectónicos SDD

| Artefacto | Propósito | Ubicación en el repo |
|-----------|-----------|----------------------|
| `proposal.md` | Qué y por qué del change | `openspec/changes/<ticket>/proposal.md` |
| `design.md` | Decisiones técnicas (rutas, servicios, i18n) | `openspec/changes/<ticket>/design.md` |
| `api-catalog.md` | MS y rutas Gateway consumidas | `codesa-specs/specs/api-catalog.md` |
| `ui-inventory.md` | Pantallas, guards, features | `codesa-specs/specs/ui-inventory.md` |
| `frontend-standards.md` | Convenciones del stack | `codesa-specs/specs/frontend-standards.md` |
| `ADR-XXXX-*.md` | Decisiones de arquitectura UI | `codesa-specs/specs/adrs/` |

### Reglas SDD por capa

| Capa | Responsabilidad | Regla SDD |
|------|-----------------|-----------|
| **Feature modules** | Flujo de usuario por dominio | Criterios de aceptación en `proposal.md` |
| **Services (HttpClient)** | Consumo de APIs | URLs alineadas con `api-catalog.md` y contrato backend (`api-spec.yml`) |
| **Components** | Presentación y formularios | `takeUntil` + `OnDestroy`; i18n por claves, no literales |
| **Guards / interceptors** | Seguridad y UX global | Documentar en `ui-inventory.md` si se añaden o cambian |

---

## 1. Arquitectura de Componentes

**Arquitectura modular con Angular Modules (NgModule) y componentes jerárquicos.**

### Estructura Jerárquica
```
AppComponent (raíz)
├── AppTopBarComponent (barra superior)
├── AppMenuComponent (menú lateral)
├── AppMainComponent (contenido principal - <router-outlet>)
└── AppFooterComponent (pie de página)
```

### Módulos Angular
- **AppModule**: Módulo raíz que bootstrapea la aplicación
- **CoreModule**: Servicios centrales, interceptores, utilidades (singletons)
- **SharedModule**: Componentes, pipes, directives reutilizables
- **Feature Modules**: Cada funcionalidad tiene su propio módulo (lazy-loaded)
- **Librerías externas**: `LibWebLayoutTemplatesModule`, `LibWebCarroCompraModule`, `LibWebSharedComponentsModule`

### Lazy Loading
- **Evidencia**: La estructura de `features/` con múltiples módulos sugiere lazy loading
- **Routing**: `app-routing.module.ts` configura las rutas con `loadChildren`

## Manejo de Estado

### Librerías Usadas
- **Angular Services con RxJS**: Patrón principal de manejo de estado
  - `MonedaService` con `moneda$` (Observable) para compartir estado
  - `ThemeService` para estado del tema
  - Servicios con `BehaviorSubject` o `Subject` para streams de datos

### Patrones de Estado
1. **Service + Observable**: Servicios centrales exponen `Observable<T>` para que los componentes se suscriban
2. **Componente como estado temporal**: Datos de formulario se manejan en los componentes con `FormGroup` y `FormControl`
3. **LocalStorage/SessionStorage**: Para persistencia de tema, idioma, token JWT
4. **Cookies**: `ngx-cookie` para gestión de cookies

### No se usa
- **NgRx**: No identificado en las dependencias
- **Angular Signals**: No disponible en Angular 13
- **Redux**: No identificado

## Consumo de APIs

### HttpClient de Angular
- **Mecanismo**: `HttpClientModule` con `HttpClient`
- **Interceptores**:
  1. **LoaderInterceptorService**: Muestra/oculta indicador de carga global
  2. **JwtInterceptor**: Agrega token JWT a headers de autenticación
  3. **MtApiNativeBaseInterceptor** (opcional): Soporte para API nativa (móvil)

### Patrón de Consumo
```typescript
// Probable patrón usado en los servicios
@Injectable({ providedIn: 'root' })
export class TurnosService {
  constructor(private http: HttpClient) {}
  
  consultarTurnos(request: ConsultarTurnosRequest): Observable<TurnosResponseDTO[]> {
    return this.http.post<TurnosResponseDTO[]>('/api/turnos/consultar', request);
  }
}
```

### No se usa
- **Axios**: No identificado
- **React Query / SWR**: No aplica (no es React)
- **NgRx Effects**: No identificado

## Manejo de Rutas

### Router de Angular
- **Configuración**: `app-routing.module.ts`
- **Lazy Loading**: Los feature modules se cargan bajo demanda
- **Rutas principales** (probables):
  - `/login` → LoginComponent
  - `/home` → HomeComponent
  - `/turnos` → Feature module de turnos
  - `/recargas` → Feature module de recargas
  - `/giros` → Feature module de giros
  - `/carro-compras` → Feature module de carro-compras
  - `/operaciones-inusuales` → OperacionesInusualesComponent

### Guards (probables)
- **AuthGuard**: Para proteger rutas que requieren autenticación
- **RoleGuard**: Para proteger rutas por rol de usuario
- **No identificado explícitamente en el código visible**

### Resolvers (probables)
- **Data Resolvers**: Para cargar datos antes de activar la ruta
- **No identificado explícitamente en el código visible**

## Manejo de Errores en el Frontend

### Interceptors
- **JwtInterceptor**: Maneja respuestas 401 (no autorizado), refresca token o redirige a login
- **LoaderInterceptorService**: Muestra spinner de carga y oculta al terminar

### Servicios de Utilidad
- **AlertService**: Para mostrar alertas/notificaciones al usuario
- **ModalService**: Para diálogos modales de confirmación o información

### SweetAlert2
- **Librería**: `sweetalert2` ^7.33.1
- **Uso**: Diálogos de confirmación, alertas bonitas, notificaciones

### Manejo Global
- **No se identifica** un `ErrorHandler` global personalizado
- Los errores se manejan a nivel de componente o servicio

## Patrones de Composición de Componentes

### 1. **Container/Presentational Pattern** (implícito)
- **Container**: Componentes de feature que manejan lógica y estado
- **Presentational**: Componentes compartidos en `shared/` que solo renderizan

### 2. **Service Injection**
- Servicios inyectados en componentes para lógica de negocio
- `providedIn: 'root'` para servicios singleton

### 3. **Reactive Forms**
- **Librería**: `FormsModule` de Angular
- **Uso**: Formularios reactivos con `FormGroup`, `FormControl`, `Validators`
- **Validación**: Validadores nativos de Angular + validadores personalizados

### 4. **Pipes**
- **DateFormatPipe**: Formateo de fechas
- **CountLettersSeriesPipe**: Conteo de letras en series
- **CreateArrayFormPipe**: Creación de arrays para formularios

### 5. **Dynamic Dialogs** (PrimeNG)
- **Librería**: PrimeNG DynamicDialog
- **Uso**: Diálogos modales dinámicos con `DynamicDialogConfig`

### 6. **Translation**
- **Librería**: `@ngx-translate/core` + `@ngx-translate/http-loader`
- **Uso**: Internacionalización con archivos JSON en `assets/i18n/`
- **Loader**: `TranslateHttpLoader` carga archivos desde `./assets/i18n/*.json`

### 7. **Multi-theme Support**
- **Sass**: Temas compilados desde archivos `.scss`
- **ThemeService**: Cambia el tema activo dinámicamente
- **Temas soportados**: superflex, 8100003178, 123456789

---

## 9. Checklist SDD para arquitectura frontend

Antes de iniciar un change que afecte rutas, APIs o estructura de módulos:

- [ ] **proposal.md** con criterios de aceptación y alcance (incluido / excluido)
- [ ] **design.md** con rutas, servicios HTTP, claves i18n y dependencias de librerías `@superflex/*`
- [ ] **api-catalog.md** actualizado si se consume un MS o endpoint nuevo
- [ ] **ui-inventory.md** actualizado si hay pantalla, guard o feature module nuevo
- [ ] Contrato backend revisado (`api-spec.yml` del MS correspondiente en su repo)
- [ ] **ADR** si la decisión afecta a más de un frontend o al patrón corporativo de UI
- [ ] Rama `feature/<ticket>-frontend` creada (Step 0 de `tasks.md`)
- [ ] Tras implementar: skill [verification](../skills/verification.md) y [code-review](../skills/code-review.md) de **codesa-skills**
```
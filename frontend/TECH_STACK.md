# Stack Tecnológico — Frontend (sf-pos-web-unificado)

## Framework Principal

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Angular** | ~13.0.1 | Framework principal de la aplicación |
| **TypeScript** | ~4.4.3 | Lenguaje de programación |
| **Angular CLI** | ~13.0.1 | Herramienta de línea de comandos |

## Librerías de UI y Componentes

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **PrimeNG** | 13.0.2 | Biblioteca de componentes UI |
| **PrimeFlex** | 2.0.0 | Sistema de grid utility-first |
| **PrimeIcons** | 7.0.0 | Iconos de PrimeNG |
| **Font Awesome** | ^6.5.2 | Iconos adicionales |
| **SweetAlert2** | ^7.33.1 | Diálogos y notificaciones bonitas |
| **Chart.js** | ^3.3.2 | Gráficos y visualizaciones |
| **ngx-barcodeput** | ^1.1.0 | Generación de códigos de barras |

## Estilos y Preprocesadores

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Sass** | ^1.45.0 | Preprocesador de CSS |
| **PrimeFlex** | 2.0.0 | Utilities CSS |

## Formularios y Validación

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Angular Forms** | Incluido en Angular 13 | Formularios reactivos y template-driven |
| **FormsModule** | Incluido en Angular 13 | Formularios template-driven |

## Internacionalización (i18n)

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **@ngx-translate/core** | ^14.0.0 | Internacionalización |
| **@ngx-translate/http-loader** | ^7.0.0 | Carga de archivos de traducción vía HTTP |
| **ngx-translate-extract** | ^1.0.0 | Extracción de claves de traducción |

## HTTP y Red

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **HttpClient** | Incluido en Angular 13 | Consumo de APIs REST |
| **ngx-cookie** | ^5.0.2 | Gestión de cookies |
| **json-bigint** | ^1.0.0 | Manejo de números grandes en JSON |

## Criptografía y Seguridad

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **crypto-js** | ^4.1.1 | Funciones criptográficas |
| **assert** | ^2.0.0 | Polyfill para Node.js assert |

## Polyfills y Compatibilidad

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **crypto-browserify** | ^3.12.0 | Polyfill para crypto en browser |
| **https-browserify** | ^1.0.0 | Polyfill para https en browser |
| **os-browserify** | ^0.3.0 | Polyfill para os en browser |
| **stream-browserify** | ^3.0.0 | Polyfill para stream en browser |
| **stream-http** | ^3.2.0 | Polyfill para http en browser |
| **web-animations-js** | ^2.3.2 | Polyfill para Web Animations API |
| **tslib** | ^2.0.0 | Utilidades TypeScript |

## Utilidades

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **angular-busy2** | ^13.0.0 | Indicadores de carga/busy |
| **jquery** | ^3.4.1 | [POSIBLEMENTE HEREDADO - verificar si es necesario] |
| **prismjs** | 1.9.0 | Resaltado de sintaxis |
| **rxjs** | ~6.6.0 | Programación reactiva |
| **zone.js** | ~0.11.4 | Zone.js de Angular |
| **ts-keycode-enum** | ^1.0.6 | Enums para teclas |

## Librerías Internas de Superflex

| Librería | Versión | Propósito |
|---------|---------|-----------|
| **@superflex/lib-web-carro-compra** | 4.0.6 | Módulo de carrito de compras |
| **@superflex/lib-web-layout-templates** | 4.0.53 | Templates de layout y topbar |
| **@superflex/lib-web-shared-components** | 4.0.146 | Componentes compartidos |

## Herramientas de Testing Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Karma** | ~6.3.20 | Runner de tests |
| **Jasmine** | ~3.8.0 | Framework de tests |
| **karma-chrome-launcher** | ~3.1.0 | Ejecutar tests en Chrome |
| **karma-coverage-istanbul-reporter** | ~3.0.3 | Reportes de cobertura |
| **karma-jasmine** | ~4.0.0 | Integración Jasmine-Karma |
| **karma-jasmine-html-reporter** | ^1.7.0 | Reporte HTML de tests |
| **Protractor** | ~7.0.0 | Tests E2E |
| **ts-node** | ~8.3.0 | Ejecutar TypeScript en Node |

## Herramientas de Build y Calidad de Código

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **@angular-devkit/build-angular** | ~13.0.1 | Build de Angular |
| **ESLint** | ^8.12.0 | Linting de TypeScript/JavaScript |
| **@angular-eslint/builder** | 13.2.1 | Integración ESLint-Angular |
| **Prettier** | ^2.6.2 | Formateo de código |
| **prettier-eslint** | ^14.0.2 | Integración Prettier-ESLint |
| **Husky** | ^8.0.0 | Git hooks |
| **SonarScanner** | [NO IDENTIFICADA EXPLÍCITAMENTE] | Análisis estático de código |

## Servidor de Desarrollo y Producción

| Tecnología | Propósito |
|-----------|-----------|
| **Angular Dev Server** | Servidor de desarrollo (ng serve) |
| **Nginx** | Servidor web para producción |

## Scripts Principales

| Script | Comando | Descripción |
|--------|---------|-------------|
| Desarrollo local | `npm run start-dev` | ng serve --port 4202 --proxy-config proxy.conf.json |
| Desarrollo local (otro proxy) | `npm run start-local` | ng serve --port 4202 --proxy-config proxy.conf.local.json |
| Staging | `npm run start-stg` | ng serve --port 4202 --proxy-config proxy.conf.stg.json |
| Build producción | `npm run build-superflex` | Build optimizado con buildOptimizer, optimization, AOT |
| Build estándar | `npm run build` | ng build |
| Tests unitarios | `npm run test` | ng test (Karma) |
| Tests E2E | `npm run e2e` | ng e2e (Protractor) |
| Linting | `npm run lint` | ng lint (ESLint) |
| Extracción de i18n | `npm run extract` | ngx-translate-extract |
```
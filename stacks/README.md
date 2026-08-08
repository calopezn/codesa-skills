# Stacks — alineación con codesa-sdd-templates

Cada subcarpeta corresponde a un **template** instalable con `install-codesa-sdd.ps1` / `.sh`.

| Carpeta | Template SDD |
|---------|----------------|
| [backend-java11-sb27/](backend-java11-sb27/README.md) | Microservicios legacy |
| [backend-java17-sb3/](backend-java17-sb3/README.md) | Microservicios nuevos / migrados |
| [frontend-angular13/](frontend-angular13/README.md) | SPAs Angular POS y similares |

## Documentación

En el repo de proyecto, la estructura SDD es:

```
<repo>/
├── codesa-specs/specs/     ← standards, api-spec, data-model, adrs
├── codesa-specs/agents/
├── openspec/changes/
├── .codesa/config/         ← solo presets Checkstyle/ESLint (no specs)
└── .clinerules/            ← reglas + workflows de Cline (ver ../cline/README.md)
```

Ver [INSTALL.md](https://gitlab.codesa.com.co/arquitectura/ia/codesa-sdd-templates/-/blob/main/INSTALL.md).

## API Gateway

Headers y rutas públicas: standard corporativo  
`codesa-sdd-templates/shared/standards/api-gateway-standards.md`  
(copiado a `codesa-specs/specs/api-gateway-standards.md` en cada MS).

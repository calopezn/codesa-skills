# codesa-context — servidor MCP

Servidor MCP de solo lectura que expone el contenido markdown de `codesa-skills` (`skills/`, `backend/`, `frontend/`, `stacks/`, `README.md`, `STACKS.md`) como recursos consultables bajo demanda desde Cline — en vez de tener que clonar el repo localmente o pegar el contenido completo en `.clinerules`.

Es un **scaffold funcional para uso local**, no un servicio corporativo desplegado. Ver la sección "Limitaciones" antes de asumir que cubre los 130 puestos de trabajo.

## Qué expone

Cada archivo `.md` de las carpetas listadas queda disponible como un recurso con URI `codesa://<ruta-relativa>`, por ejemplo:

```
codesa://skills/code-review.md
codesa://stacks/backend-java17-sb3/CONVENTIONS.md
codesa://README.md
```

`cline/rules/` y `mcp-server/` mismos no se exponen — son artefactos de entrega, no contenido de referencia.

## Instalación

```bash
cd mcp-server
npm install
npm run build
```

## Configuración en Cline

En la configuración de servidores MCP de Cline (`cline_mcp_settings.json`, accesible desde el ícono de MCP en la extensión):

```json
{
  "mcpServers": {
    "codesa-context": {
      "command": "node",
      "args": ["/ruta/absoluta/a/codesa-skills/mcp-server/dist/index.js"],
      "env": {
        "CODESA_SKILLS_ROOT": "/ruta/absoluta/a/codesa-skills"
      }
    }
  }
}
```

`CODESA_SKILLS_ROOT` es opcional — por defecto apunta a la raíz del propio checkout de `codesa-skills` donde vive este servidor. Solo hace falta si se sirve un clon en otra ruta.

Una vez configurado, cualquier workflow en `cline/workflows/*.md` que pida leer un recurso `codesa://...` lo resuelve automáticamente en vez de caer al fallback de archivo local.

## Limitaciones de este scaffold

- **Transporte stdio**: cada desarrollador corre su propio proceso local; requiere que `codesa-skills` esté clonado en su máquina y que la ruta en `cline_mcp_settings.json` sea correcta para ese puesto.
- **Sin caché de contenido dinámico**: si el repo se actualiza, hay que hacer `git pull` local — el servidor lee del disco en cada request, no cachea versiones viejas, pero tampoco se auto-actualiza.
- **Solo sirve `codesa-skills`**: no incluye `codesa-sdd-templates` (la fuente de verdad normativa). Extenderlo para servir ambos requiere apuntar `CODESA_SKILLS_ROOT` a un directorio que contenga ambos checkouts, o correr una segunda instancia con otra raíz — no implementado en este scaffold.
- **No es una arquitectura multiusuario**: para servir a los 130 sin que cada persona configure una ruta local, hace falta decidir un transporte remoto (HTTP/SSE) y dónde se hospeda — eso queda pendiente como decisión de infraestructura, no de este repo.

## Desarrollo

```bash
npm run dev   # tsc --watch
```

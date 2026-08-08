#!/usr/bin/env node
/**
 * codesa-context — servidor MCP de solo lectura.
 *
 * Expone el contenido markdown de codesa-skills (skills/, backend/, frontend/,
 * stacks/, README.md, STACKS.md) como recursos MCP consultables bajo demanda,
 * para que un workflow de Cline pueda leer el detalle completo de un skill o
 * de un stack sin que ese contenido viva permanentemente en `.clinerules`.
 *
 * Transporte: stdio (uso local, un proceso por desarrollador). Ver README.md
 * de esta carpeta para configuración en Cline y para las limitaciones de
 * este scaffold frente a un despliegue centralizado.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile, readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const URI_SCHEME = "codesa://";

// Por defecto, la raíz del repo codesa-skills (dos niveles arriba de dist/ o src/).
// Sobreescribible con CODESA_SKILLS_ROOT para servir un clon en otra ruta.
const DEFAULT_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SKILLS_ROOT = process.env.CODESA_SKILLS_ROOT ?? DEFAULT_ROOT;

// Carpetas y archivos servidos. Deliberadamente no incluye cline/ ni
// mcp-server/ — esos son artefactos de entrega, no contenido de referencia.
const INCLUDED_DIRS = ["skills", "backend", "frontend", "stacks"];
const INCLUDED_ROOT_FILES = ["README.md", "STACKS.md"];

async function walkMarkdown(relDir: string): Promise<string[]> {
  const absDir = join(SKILLS_ROOT, relDir);
  const entries = await readdir(absDir, { withFileTypes: true });
  const found: string[] = [];
  for (const entry of entries) {
    const relPath = join(relDir, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await walkMarkdown(relPath)));
    } else if (entry.name.endsWith(".md")) {
      found.push(relPath);
    }
  }
  return found;
}

async function listAllMarkdownFiles(): Promise<string[]> {
  const files = [...INCLUDED_ROOT_FILES];
  for (const dir of INCLUDED_DIRS) {
    files.push(...(await walkMarkdown(dir)));
  }
  return files.sort();
}

function toUri(relPath: string): string {
  return URI_SCHEME + relPath.split(sep).join("/");
}

function toRelPath(uri: string): string {
  if (!uri.startsWith(URI_SCHEME)) {
    throw new Error(`URI no soportada (se esperaba ${URI_SCHEME}...): ${uri}`);
  }
  return uri.slice(URI_SCHEME.length);
}

const server = new Server(
  { name: "codesa-context", version: "0.1.0" },
  { capabilities: { resources: {} } },
);

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const relFiles = await listAllMarkdownFiles();
  return {
    resources: relFiles.map((relPath) => ({
      uri: toUri(relPath),
      name: relPath,
      mimeType: "text/markdown",
    })),
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const relPath = toRelPath(request.params.uri);
  const absPath = join(SKILLS_ROOT, relPath);

  // Evita que una URI con ".." escape de la raíz servida.
  if (relative(SKILLS_ROOT, absPath).startsWith("..")) {
    throw new Error(`Ruta fuera de codesa-skills: ${relPath}`);
  }

  const text = await readFile(absPath, "utf-8");
  return {
    contents: [{ uri: request.params.uri, mimeType: "text/markdown", text }],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);

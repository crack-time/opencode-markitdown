/**
 * MarkItDown Plugin for OpenCode
 *
 * Extract text content from documents as Markdown using Microsoft's MarkItDown.
 * Supports PDF, DOCX, PPTX, HTML, images (OCR), EPUB, CSV, and more.
 *
 * Prerequisites: uv (https://docs.astral.sh/uv/)
 * The plugin uses `uvx` to automatically manage markitdown's Python environment.
 * First run downloads dependencies (~30s), subsequent runs use cache.
 */

import path from "path"
import fs from "fs"
import os from "os"
import { execSync } from "child_process"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const UVX_CMD = [
  "uvx",
  "--from",
  "markitdown[all]@git+https://github.com/microsoft/markitdown.git#subdirectory=packages/markitdown",
  "markitdown",
]

/**
 * Find @opencode-ai/plugin module by checking known OpenCode installation paths.
 */
function findPluginPath(): string | null {
  const homeDir = os.homedir()
  const possibleDirs = [
    path.join(homeDir, ".config", "opencode", "node_modules", "@opencode-ai", "plugin"),
    path.join(homeDir, ".cache", "opencode", "node_modules", "@opencode-ai", "plugin"),
  ]
  for (const dir of possibleDirs) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      return dir
    }
  }
  return null
}

export default async function MarkItDownPlugin(_ctx: any) {
  const pluginPath = findPluginPath()
  if (!pluginPath) {
    throw new Error("Cannot find @opencode-ai/plugin. Please ensure OpenCode is installed.")
  }
  const { tool } = await import(path.join(pluginPath, "dist", "index.js"))

  return {
    tool: {
      markitdown: tool({
        description:
          "Extract text content from documents as Markdown. " +
          "Supports PDF, DOCX, PPTX, HTML, images (OCR), EPUB, CSV, and more. " +
          "For papers, articles, reports, slides — anything you need to read text from.",
        args: {
          path: tool.schema
            .string()
            .describe(
              "File path or URL to the document " +
                "(e.g., 'paper.pdf', 'https://arxiv.org/pdf/...')",
            ),
        },
        async execute(args: { path: string }) {
          try {
            const output = execSync(
              [...UVX_CMD, args.path].join(" ") + " 2>/dev/null",
              {
                encoding: "utf-8",
                maxBuffer: 50 * 1024 * 1024,
                timeout: 120_000,
              },
            )
            return output
          } catch (err: any) {
            if (err.stdout) return err.stdout
            throw new Error(`markitdown failed: ${err.message}`)
          }
        },
      }),
    },
  }
}

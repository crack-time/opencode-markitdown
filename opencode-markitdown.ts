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

import { type Plugin, tool } from "@opencode-ai/plugin"

export const MarkItDownPlugin: Plugin = async (ctx) => {
  const { $ } = ctx

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
            return await $`uvx --from markitdown[all]@git+https://github.com/microsoft/markitdown.git#subdirectory=packages/markitdown markitdown ${args.path}`.text()
          } catch (err: any) {
            if (err.stdout) return err.stdout
            throw new Error(`markitdown failed: ${err.message}`)
          }
        },
      }),
    },
  }
}

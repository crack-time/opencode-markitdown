# opencode-markitdown

An OpenCode plugin that converts documents to Markdown using [Microsoft MarkItDown](https://github.com/microsoft/markitdown).

## Features

- **PDF** — Extract text from academic papers, reports, slides
- **DOCX / PPTX** — Office document conversion
- **HTML** — Web page to Markdown
- **Images** — OCR for text in images
- **EPUB, CSV, XLSX** — Various file format support
- **URL** — Direct conversion from web URLs

## Prerequisites

- [uv](https://docs.astral.sh/uv/) (>= 0.10) — Python package manager, automatically manages markitdown's environment
- [OpenCode](https://opencode.ai/) installed

### Install uv

```bash
# Linux / macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or via Homebrew
brew install uv
```

## Installation

```bash
opencode plugin opencode-markitdown
```

Or add to your `opencode.json`:

```json
{
  "plugin": ["opencode-markitdown"]
}
```

Then restart OpenCode. On first use, `uvx` automatically downloads and caches Python dependencies (~30s). Subsequent calls are instant.

## Available Tools

| Tool | Description |
|------|-------------|
| `markitdown` | Extract text content from a document file or URL as Markdown |

## Usage Examples

Once installed, the `markitdown` tool is available to OpenCode:

> "Read this PDF and summarize the key points"
> "Extract the text from this DOCX file"
> "Convert that webpage to markdown"

## How It Works

The plugin uses `uvx` to run Microsoft's MarkItDown CLI:

```
uvx --from "markitdown[all]@..." markitdown <file>
```

- Zero Python environment management — `uvx` handles everything
- Dependencies cached in `~/.cache/uv/` after first run
- No conda, no pip, no venv needed

## License

MIT

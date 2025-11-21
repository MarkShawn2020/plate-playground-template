# Playground Template

A Tauri desktop app built with Next.js and [Plate](https://platejs.org/) AI, plugins and components.

## Features

- Tauri 2.x desktop application
- Next.js 16 (static export)
- [Plate](https://platejs.org/) editor
- [shadcn/ui](https://ui.shadcn.com/)
- [MCP](https://platejs.org/docs/components/mcp)

## Requirements

- Node.js 20+
- pnpm
- Rust (for Tauri development)
- Platform-specific dependencies for Tauri ([see Tauri prerequisites](https://v2.tauri.app/start/prerequisites/))

## Installation

Choose one of these methods:

### 1. Using CLI (Recommended)

```bash
npx shadcn@latest add https://platejs.org/r/editor-ai
```

### 2. Using Template

[Use this template](https://github.com/udecode/plate-playground-template/generate), then install dependencies:

```bash
pnpm install
```

## Development

### Web Development Mode

Start the Next.js development server:

```bash
pnpm dev
```

Visit http://localhost:3000/editor to see the editor in action.

### Tauri Desktop App

Run the Tauri desktop app in development mode:

```bash
pnpm tauri:dev
```

This will automatically start the Next.js dev server and launch the Tauri window.

### Build Desktop App

Build the desktop application:

```bash
pnpm tauri:build
```

The built application will be in `src-tauri/target/release`.

## Environment Variables (Optional)

Copy the example env file:

```bash
cp .env.example .env.local
```

Configure `.env.local` for AI and file upload features:

- `AI_GATEWAY_API_KEY` – AI Gateway API key ([get one here](https://vercel.com/ai-gateway))
- `UPLOADTHING_TOKEN` – UploadThing API key ([get one here](https://uploadthing.com/dashboard))

**Note**: AI and upload features require additional configuration in the Tauri desktop app, as the original API routes have been removed for static export compatibility.

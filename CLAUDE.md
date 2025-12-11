# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 application using Vue 3 with TypeScript support. It follows Nuxt's standard conventions for file-based routing, auto-imports, and server-side rendering.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Generate static site
npm run generate
```

## Architecture

- **Nuxt 3 Framework**: Uses Nuxt 3.20.2+ with Vue 3.5+ and Vue Router 4.6+
- **TypeScript Configuration**: TypeScript is configured with `tsconfig.json` extending `.nuxt/tsconfig.json` (auto-generated)
- **Server Directory**: The `server/` directory is for Nuxt server routes and middleware, following Nuxt's server conventions
- **Auto-imports**: Nuxt automatically imports components, composables, and utilities - no manual imports needed for Nuxt/Vue APIs
- **Development Tools**: Nuxt DevTools are enabled in the configuration

## Key Conventions

- Place Vue components in `components/` for auto-import
- API routes go in `server/api/` following Nuxt's file-based routing
- Server middleware in `server/middleware/`
- Place pages in `pages/` for automatic route generation (currently using default `app.vue`)
- Static assets in `public/` are served at root path
- Nuxt's `compatibilityDate` is set to '2025-07-15'

## Notes

- The project uses npm as the package manager (indicated by `package-lock.json`)
- TypeScript configuration extends auto-generated Nuxt configs - avoid modifying these directly
- The `.nuxt/` directory is generated during development and should not be committed

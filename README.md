# React + TypeScript with Deno (via Vite)

This is a sample repo to help you get started with React and Vite using Deno.
Node runs Vite's dev server, and Deno handles everything else: formatting,
linting, type checking, testing.

I tried using Vite with Deno directly, but hit issues because Vite is so
tightly coupled to Node: http-proxy makes weird assumptions about request
object lifetimes, HMR fails because WebSockets spontaneously close, etc. Deno's
compatibility layer just isn't up to the Herculean task of wart-for-wart Node
compatibility yet.

This repo was initialized using the steps below.

## Scaffold

```sh
mkdir -p deno-react-starter/src
cd deno-react-starter
```

## deno.json

Create `deno.json` with:

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "lib": ["dom", "dom.iterable", "esnext"]
  },
  "nodeModulesDir": "auto",
  "tasks": {
    "dev": "node node_modules/.bin/vite",
    "build": "node node_modules/.bin/vite build",
    "preview": "node node_modules/.bin/vite preview",
    "check": "deno check src/**/*.tsx src/**/*.ts",
    "test": "deno test"
  },
  "allowScripts": ["npm:fsevents"]
}
```

- Vite expects `node_modules`; `nodeModulesDir: "auto"` tells Deno to populate it.
- `lib` includes `dom` so the type checker knows about `document`, `window`, etc.
- Tasks run Vite via Node (not `deno run -A npm:vite`).
- Allow scripts to install the `fsevents` native binary (macOS file watching).

No need for `deno init` — it generates files you'd immediately delete.

## package.json

Single source of truth for dependencies. Both runtimes resolve from
`node_modules`.

```json
{
  "private": true,
  "dependencies": {
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^6",
    "vite": "^8"
  }
}
```

## vite.config.ts

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

## .gitignore

```gitignore
dist
node_modules
```

## index.html

Vite's entry point. Must be in the project root.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App</title>
</head>
<body>
  <div id="root">not rendered</div>
  <script type="module" src="./src/main.tsx"></script>
</body>
</html>
```

## src/main.tsx

Mounts the root component:

```tsx
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.tsx";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## src/App.tsx

```tsx
export default function App() {
  return <h1>Hello</h1>;
}
```

## Run

```sh
deno install   # populate node_modules (first time only)
deno task dev  # Node runs Vite dev server with HMR
```

## Adding dependencies

1. Add to `package.json`
2. Run `deno install` (or `npm install` — same result)

Dependencies go in `package.json` only, not `deno.json`. With
`nodeModulesDir: "auto"`, Deno resolves from `node_modules`.

## Imports

Use bare specifiers, not `npm:` prefixed ones. Bare specifiers work in
both Deno and Vite:

```ts
import React from "react";           // good — both understand this
import React from "npm:react";       // bad — Vite won't resolve this
```

Use explicit `.tsx`/`.ts` extensions in relative imports — Deno requires
them.

## Notes

- `deno.json` replaces `tsconfig.json` (via `compilerOptions`). `package.json`
  handles dependencies.
- Node touches exactly one thing: the Vite process. Source files, type
  checking, formatting, linting, and testing are all Deno.
- To proxy API requests during dev, use Vite's built-in `server.proxy` in
  `vite.config.ts`.

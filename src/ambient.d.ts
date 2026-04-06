// Ambient type declarations for things that exist at runtime but aren't
// defined in our TypeScript source. Deno's type checker needs these to
// understand Vite-specific APIs (import.meta.env, CSS module imports, etc.)
// that Vite injects at build time.
/// <reference types="vite/client" />

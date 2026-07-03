import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    // `@` → src, so cross-feature imports stay stable when files move.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

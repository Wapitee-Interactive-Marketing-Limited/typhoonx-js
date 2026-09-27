import {defineConfig} from 'tsdown';

export default defineConfig({
  platform: 'neutral',
  target: 'es2024',
  // Bundling drops TyphoonXProvider's module-level directive.
  banner: {js: "'use client';"},
});

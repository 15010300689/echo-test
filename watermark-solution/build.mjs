import { build } from 'esbuild';
import { rm } from 'node:fs/promises';

const ROOT = new URL('.', import.meta.url);

async function main() {
  await rm(new URL('./dist', ROOT), { recursive: true, force: true });

  await build({
    entryPoints: ['adapters/vanilla.ts'],
    bundle: true,
    format: 'iife',
    globalName: 'WatermarkSolution',
    platform: 'browser',
    target: 'es2020',
    outfile: 'dist/vanilla.iife.js',
    sourcemap: true,
    minify: false,
  });

  await build({
    entryPoints: ['adapters/vanilla.ts'],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    outfile: 'dist/vanilla.esm.js',
    sourcemap: true,
    minify: false,
  });

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

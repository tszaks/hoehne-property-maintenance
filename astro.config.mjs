// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.hoehnepropertymaintenance.com',
  output: 'static',
  adapter: vercel(),
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()]
  }
});

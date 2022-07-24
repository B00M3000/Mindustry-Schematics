import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],

  resolve: {
    alias: {
      '@': path.resolve('src'),
      '@static': path.resolve('static'),
    },
  },

  server: {
    port: 3000,
  },
};

export default config;

import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import dotenv from 'dotenv';
import tailwindcss from '@tailwindcss/vite'

dotenv.config() // Load Environment Variables

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve('src'),
      '@static': path.resolve('static'),
    },
  },

  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },
};

export default config;

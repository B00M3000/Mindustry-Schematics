import preprocess from 'svelte-preprocess';
import path from 'path';
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: {
      name: 'node-adapter',
      adapt: node,
    },
    vite: {
      resolve: {
        alias: {
          '@': path.resolve('src'),
          '@static': path.resolve('static'),
        },
      },
    },
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
  },
};

export default config;

import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import config from 'sapper/config/rollup.js';
import json from '@rollup/plugin-json';
import path from 'path';
import pkg from './package.json';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import svelteSVG from 'rollup-plugin-svelte-svg';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
  (warning.code === 'CIRCULAR_DEPENDENCY' &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  warning.code === 'THIS_IS_UNDEFINED' ||
  onwarn(warning);

export default {
  client: {
    input: config.client.input().replace(/\.js$/, '.ts'),
    output: config.client.output(),
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.browser': true,
          'process.env.NODE_ENV': JSON.stringify(mode),
        },
      }),
      svelte({
        preprocess: sveltePreprocess({ sourceMap: dev }),
        compilerOptions: {
          dev,
          hydratable: true,
        },
      }),
      url({
        sourceDir: path.resolve(__dirname, 'static'),
        publicPath: '/client/',
        exclude: ['**/*.svg'],
      }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),
      json(),
      typescript({ sourceMap: dev }),
      svelteSVG({ dev }),
      alias({
        resolve: ['.jsx', '.js', '.ts', '.svelte'],
        entries: [{ find: '@', replacement: path.resolve(__dirname) }],
      }),
      legacy &&
        babel({
          extensions: ['.js', '.mjs', '.html', '.svelte'],
          babelHelpers: 'runtime',
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead',
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: { server: config.server.input().server.replace(/\.js$/, '.ts') },
    output: config.server.output(),
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.browser': false,
          'process.env.NODE_ENV': JSON.stringify(mode),
        },
      }),
      svelte({
        preprocess: sveltePreprocess({ sourceMap: dev }),
        compilerOptions: {
          dev,
          generate: 'ssr',
          hydratable: true,
        },
        emitCss: false,
      }),
      url({
        sourceDir: path.resolve(__dirname, 'static'),
        publicPath: '/client/',
        emitFiles: false, // already emitted by client build
        exclude: ['**/*.svg'],
      }),
      resolve({
        dedupe: ['svelte'],
      }),
      commonjs(),
      json(),
      typescript({ sourceMap: dev }),
      svelteSVG({ generate: 'ssr', dev }),
      alias({
        resolve: ['.jsx', '.js', '.ts', '.svelte'],
        entries: [{ find: '@', replacement: path.resolve(__dirname) }],
      }),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules
    ),
    preserveEntrySignatures: 'strict',
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input().replace(/\.js$/, '.ts'),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        preventAssignment: true,
        values: {
          'process.browser': true,
          'process.env.NODE_ENV': JSON.stringify(mode),
        },
      }),
      commonjs(),
      typescript({ sourceMap: dev }),
      !dev && terser(),
    ],
    preserveEntrySignatures: false,
    onwarn,
  },
};

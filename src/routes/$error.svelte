<script context="module" lang="ts">
  export const load: ErrorLoad = ({ error, status }) => {
    return {
      props: {
        error,
        status,
      },
    };
  };
</script>

<script lang="ts">
  import { dev } from '$app/env';
  import type { ErrorLoad } from '@sveltejs/kit';
  export let status: number;
  export let error: Error;
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<h1>{status}</h1>

<p>{error.message}</p>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}

<style>
  h1 {
    text-align: center;
  }
  pre {
    overflow-x: auto;
    background-color: hsla(0, 0%, 0%, 0.5);
    padding: 1rem;
    border-radius: 1rem;
  }
  pre::-webkit-scrollbar {
    height: 1rem;
  }
  pre::-webkit-scrollbar-track {
    background: hsla(0, 0%, 0%, 0.3);
  }
  pre::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 0.5rem;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>

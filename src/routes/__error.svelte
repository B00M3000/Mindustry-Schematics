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

<template lang="pug">
  svelte:head
    title {status}
  
  h1 {status}
  p {error.message}
  +if("dev && error.stack")
    pre {error.stack}
</template>

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

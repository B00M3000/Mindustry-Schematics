<script lang="ts">
  import { dev } from '$app/environment';
  import { page } from '$app/stores';
  import type { Load } from '@sveltejs/kit';
</script>

<template lang="pug">
  svelte:head
    title {$page.status}
  
  h1 {$page.status}
  p {$page.error.message}
  +if("dev && $page.error.stack")
    pre {$page.error.stack}
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

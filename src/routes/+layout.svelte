<script lang="ts">
  // import '../app.css';
  import '../core.css';
  import '../tags.css';
  import '../create_schematic.css';

  import Nav from '@/client/components/Nav.svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { browser } from '$app/environment';
  import { paths } from '@/client/stores';
  import { navigating } from '$app/stores';
  import { BarLoader } from 'svelte-loading-spinners';
  import Background from './_background.svelte';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
  $paths;
</script>

<template lang="pug">
  Nav
  +if("browser")
    SvelteToast
    +if("$navigating")
      div.loader
        BarLoader(size=100 unit="vw" duration="30s" color="#ffc933")
  Background(backgrounds!="{data.backgrounds}")
  slot
</template>

<style>
  :root {
    --toastContainerTop: 5rem;
    --toastContainerRight: 1rem;
    --bottom-bar-height: 4rem;
  }
  .loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 21;
    height: 0.2rem;
    overflow: hidden;
  }
  :global(._toastItem) {
    border-radius: 0.5rem !important;
  }
  :global(._toastBar) {
    border-radius: 1rem !important;
    overflow: hidden;
  }
</style>

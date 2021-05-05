<script lang="ts">
  import Nav from '@/client/components/Nav.svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { browser } from '$app/env';
  import { paths } from '@/client/stores';
  import { navigating } from '$app/stores';
  import { BarLoader } from 'svelte-loading-spinners';
  import Background from './_background.svelte';
  $paths;
</script>

<Nav />

{#if browser}
  <SvelteToast />
  {#if $navigating}
    <div class="loader">
      <BarLoader size={100} unit="vw" duration="30s" color="#ffc933" />
    </div>
  {/if}
{/if}
<slot />
<Background />

<style>
  :root {
    --toastContainerTop: 5rem;
    --toastContainerRight: 1rem;
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

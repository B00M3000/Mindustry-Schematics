<script lang="ts">
  import Nav from '../components/Nav.svelte';
  import { navigation } from '@/src/stores';
  import { stores } from '@sapper/app';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  const { page } = stores();
  $: {
    navigation.update((n) => ({
      current: $page.path,
      previous: n.current,
    }));
  }
  export let segment: string;
</script>

<Nav tab={segment} />
<SvelteToast />
<slot />

<style>
  :root {
    --toastContainerTop: 5rem;
    --toastContainerRight: 1rem;
  }
  :global(._toastItem) {
    border-radius: 0.5rem !important;
  }
  :global(._toastBar) {
    border-radius: 1rem !important;
    overflow: hidden;
  }
</style>

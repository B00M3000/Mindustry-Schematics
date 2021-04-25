<script lang="ts">
  import { navigation } from '@/src/stores';

  import IconButton from './IconButton.svelte';
  export let href: string;
  export let smart = false;
  function goBack(e: MouseEvent) {
    if (!smart) return;
    const { previous } = $navigation;
    if (previous && !previous.startsWith('http')) {
      e.preventDefault();
      return history.back();
    }
  }
</script>

<IconButton
  {href}
  src="/assets/arrow.svg"
  alt="back"
  border
  classname="invert-x"
  on:click={goBack}
>
  <span>Back</span>
</IconButton>

<style>
  :global(.invert-x img) {
    transform: scaleX(-1);
  }
</style>

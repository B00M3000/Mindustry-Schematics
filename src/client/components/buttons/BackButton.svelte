<script lang="ts">
  import { paths } from '@/client/stores';
  import IconButton from './IconButton.svelte';
  /** The url this button leads to */
  export let href: string;
  /**
   * When set to `true`, the button will try to pop back
   * to the previous route inside the app,
   * if there is no previous route, it will use the `href` prop
   */
  export let smart = false;
  async function goBack(e: MouseEvent) {
    if (!smart) return;
    const { previous } = $paths;
    if (previous) {
      e.preventDefault();
      history.back();
    }
  }
</script>

<IconButton
  {href}
  src="/assets/arrow.svg"
  alt="back"
  border
  class="invert-x"
  on:click={goBack}
>
  <span>Back</span>
</IconButton>

<style>
  :global(.invert-x img) {
    transform: scaleX(-1);
  }
</style>

<script lang="ts">
  import { navigation } from '@/src/stores';

  import IconButton from './IconButton.svelte';
  /** The url this button leads to */
  export let href: string;
  /**
   * When set to `true`, the button will try to pop back
   * to the previous route inside the app,
   * if there is no previous route, it will use the `href` prop
   */
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

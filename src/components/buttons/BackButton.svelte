<script lang="ts">
  import IconButton from './IconButton.svelte';

  export let href: string;
</script>

<IconButton
  {href}
  src="/assets/arrow.svg"
  alt="back"
  border
  classname="invert-x"
  on:click
>
  <span>Back</span>
</IconButton>

<style>
  :global(.invert-x img) {
    transform: scaleX(-1);
  }
</style>

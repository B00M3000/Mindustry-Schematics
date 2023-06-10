<script lang="ts">
  import BottomBar from './BottomBar.svelte';
  import IconButton from './buttons/IconButton.svelte';

  export let page: number;
  export let pages: number;
  export let pageLink: (page: number) => string;
</script>

<slot />
<div class="bottom">
  <BottomBar>
    <slot name="bottom_bar_before" />
    <IconButton
      href={pageLink(1)}
      src="/assets/double_chevron.svg"
      alt="first page"
      class={page < 3 ? 'hidden' : ''}
      border
    />
    <IconButton
      href={pageLink(page - 1 || 1)}
      src="/assets/chevron.svg"
      alt="previous page"
      class={page < 2 ? 'hidden' : ''}
      border
    />
    <slot name="bottom_bar_middle" />
    <IconButton
      href={pageLink(page + 1)}
      src="/assets/chevron.svg"
      alt="next page"
      class={'right' + (page > pages - 1 ? ' hidden' : '')}
      border
    />
    <IconButton
      href={pageLink(pages)}
      src="/assets/double_chevron.svg"
      alt="last page"
      class={'right' + (page > pages - 2 ? ' hidden' : '')}
      border
    />
    <slot name="bottom_bar_after" />
  </BottomBar>
</div>

<style>
  .bottom {
    display: contents;
    --bottom-bar-height: 4rem;
  }
  .bottom :global(.right img) {
    transform: scaleX(-1);
  }
  .bottom :global(a.hidden) {
    visibility: hidden;
    pointer-events: none;
  }

  @media screen and (max-width: 600px) {
    .bottom {
      justify-content: space-evenly;
    }
  }
</style>

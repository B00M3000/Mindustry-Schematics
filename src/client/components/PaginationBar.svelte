<script lang="ts">
  import BottomBar from './BottomBar.svelte';
  import IconButton from './buttons/IconButton.svelte';
  import { page as pageStore } from '$app/stores';

  export let page: number;
  export let pages: number;
  export let pageLink: (page: number) => string;

  // we can use the page store in this way
  // to invalidate old links
  // since the links will always be truthy
  $: firstLink = link(1, $pageStore);
  $: previousLink = link(page - 1 || 1, $pageStore);
  $: nextLink = link(page + 1, $pageStore);
  $: lastLink = link(pages, $pageStore);

  function link(page: number, dependency: unknown) {
    return pageLink(page);
  }
</script>

<slot />
<div class="bottom">
  <BottomBar>
    <slot name="bottom_bar_before" />
    <IconButton
      href={firstLink}
      src="/assets/double_chevron.svg"
      alt="first page"
      class={page < 3 ? 'hidden' : ''}
      border
    />
    <IconButton
      href={previousLink}
      src="/assets/chevron.svg"
      alt="previous page"
      class={page < 2 ? 'hidden' : ''}
      border
    />
    <slot name="bottom_bar_middle" />
    <IconButton
      href={nextLink}
      src="/assets/chevron.svg"
      alt="next page"
      class={'right' + (page > pages - 1 ? ' hidden' : '')}
      border
    />
    <IconButton
      href={lastLink}
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

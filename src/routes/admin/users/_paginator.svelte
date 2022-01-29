<script lang="ts">
  import IconButton from '@/client/components/buttons/IconButton.svelte';
  import { createEventDispatcher } from 'svelte';

  export let pages: number;
  export let page = 1;

  const dispatch = createEventDispatcher();
  function change() {
    dispatch('change', {
      page,
    });
  }
  function first() {
    page = 1;
    change();
  }
  function previous() {
    page--;
    change();
  }
  function next() {
    page++;
    change();
  }
  function last() {
    page = pages;
    change();
  }
</script>

<div class={$$props.class}>
  {#if page > 2}
    <IconButton
      alt="first"
      src="/assets/double_chevron.svg"
      class="first"
      border
      on:click={first}
    />
  {/if}
  {#if page > 1}
    <IconButton
      alt="previous"
      src="/assets/chevron.svg"
      class="previous"
      border
      on:click={previous}
    />
  {/if}
  <span>Page {page} of {pages}</span>
  {#if page < pages}
    <IconButton
      alt="next"
      src="/assets/chevron.svg"
      class="next right"
      border
      on:click={next}
    />
  {/if}
  {#if page < pages - 1}
    <IconButton
      alt="last"
      src="/assets/double_chevron.svg"
      class="last right"
      border
      on:click={last}
    />
  {/if}
</div>

<style>
  div {
    display: grid;
    grid-template-columns: 1fr 1fr max-content 1fr 1fr;
    grid-template-areas: 'first previous mark next last';
    align-items: center;
    gap: 1em;
  }
  div :global(.first) {
    grid-area: first;
  }
  div :global(.previous) {
    grid-area: previous;
  }
  div :global(.next) {
    grid-area: next;
  }
  div :global(.last) {
    grid-area: last;
  }
  div :global(.right) {
    transform: scaleX(-100%);
  }
  span {
    grid-area: mark;
    padding: 0.4em;
  }
</style>

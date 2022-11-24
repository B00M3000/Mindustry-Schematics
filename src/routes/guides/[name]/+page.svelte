<script lang="ts">
  import type { PageData } from './$types';
  import BottomBar from '@/client/components/BottomBar.svelte';
  import BackButton from '@/client/components/buttons/BackButton.svelte';

  export let data: PageData;

  let { content } = data;
  $: ({ content } = data);
</script>

<template lang="pug">
  svelte:head
    meta(property="og:title" content!="{content.title}")
    meta(property="og:image" content="/assets/mindustry_banner.png")
    meta(property="og:type" content="website")
    title {content.title}
  main
    article
      +html("content.html")
  BottomBar
    BackButton(href="/guides")
</template>

<style>
  article {
    color: var(--on-background);
    text-align: center;
    padding: 0 2em;
  }
  main {
    margin-bottom: 2rem;
  }
  main :global(article h1) {
    margin: 1em 0;
  }
  main :global(article h3) {
    margin: 1em;
  }
  main :global(article li) {
    padding: 1em;
  }
  main :global(article img) {
    max-width: 100%;
    margin: 1em 0;
  }
</style>

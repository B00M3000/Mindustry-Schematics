<script context="module" lang="ts">
  export const load: Load = async ({ fetch, page }) => {
    const { params } = page;
    const { name } = params;
    const content = await (await fetch(`/guides/${name}.json`)).json();
    return {
      props: { content },
    };
  };

  export const prerender = true;
</script>

<script lang="ts">
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import type { Load } from '@sveltejs/kit';

  export let content: {
    title: string;
    html: string;
  };
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
  footer
    BackButton(href="/guides")
</template>

<style>
  article {
    color: var(--on-background);
    text-align: center;
    padding: 0 2em;
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

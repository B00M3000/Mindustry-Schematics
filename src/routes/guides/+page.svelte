<script lang="ts">
  import type { PageData } from './$types';
  import type { Load } from '@sveltejs/kit';

  export let data: PageData;

  let { tutorials } = data;

  $: ({ tutorials } = data);
</script>

<template lang="pug">
  svelte:head
    meta(property="og:title" content="Guides")
    meta(property="og:description" content="Guides that you might find helpful")
    meta(property="og:image" content="/assets/mindustry_banner.png")
    meta(property="og:type" content="website")
    title Guides
  
  main
    ul
      +each("tutorials as tutorial")
        li
          a(href="/guides/{tutorial.name}")
            button {tutorial.title}
</template>

<style>
  main ul {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: 1em;
    gap: 1em;
  }
  main ul button {
    padding: 1em;
    width: 50vw;
  }

  @media screen and (max-width: 600px) {
    main ul button {
      width: 80vw;
    }
  }
</style>

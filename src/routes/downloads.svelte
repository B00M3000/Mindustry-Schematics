<script context="module" lang="ts">
  import { browser, dev } from '$app/env';

  export const hydrate = dev;
  export const router = browser;
  export const prerender = true;
</script>

<template lang="pug">
  svelte:head
    meta(property="og:title" content="Downloads" )
    meta(property="og:description" content="Downloads for mindustry clients" )
    meta(property="og:image" content="/assets/mindustry_banner.png" )
    meta(property="og:type" content="website" )
    title Downloads
  
  main
    ul.downloads
      li
        a(href="https://github.com/blahblahbloopster/mindustry-client-v6/releases/latest/download/desktop.jar")
          li
            button Download Foo's AG Client
      li
        a(href="https://github.com/Anuken/Mindustry/releases/latest/download/Mindustry.jar")
          button Download Official Mindustry Client
</template>

<style>
  ul.downloads {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
    gap: 1em;
    padding: 1em;
  }

  ul.downloads button {
    width: 50vw;
    padding: 1em;
    cursor: pointer;
    border-radius: 10px;
    background-color: var(--surface);
    color: var(--on-surface);
  }
  @media screen and (max-width: 600px) {
    ul.downloads button {
      width: 80vw;
    }
  }
</style>

<script lang="ts">
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import LazyImage from '@/client/components/LazyImage.svelte';
  import BottomBar from '@/client/components/BottomBar.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let { changes } = data;
  $: ({ changes } = data);
</script>

<template lang="pug">
  svelte:head
    title Schematic Changes
  h1.changes Schematic Changes
  div.changes
    +each("changes as change")
      a(href="schematic_changes/{change._id}")
        div.schematic
          h2
            span(class!="{change.mode}") {change.mode} 
            span {change.name}
          LazyImage(src="/schematics/{change.id}.png" alt="schematic preview")
  BottomBar
    BackButton(href="/user" smart)
</template>

<style>
  h1 {
    text-align: center;
  }
  div.changes {
    padding: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  span.delete {
    color: hsl(0, 98%, 68%);
  }
  span.modify {
    color: hsl(120, 50%, 60%);
  }
  .schematic {
    color: white;
    border: 3px solid #808080;
    display: flex;
    flex-direction: column;
    width: 172px;
    justify-content: space-between;
    border-radius: 0.5em;
    overflow: hidden;
  }

  .schematic .name {
    position: relative;
    top: 0px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: rgba(40, 40, 40, 0.5);
  }

  .schematic h2 {
    font-size: 10px;
    font-style: thin;
  }
  .schematic :global(img) {
    z-index: 1;
    height: 166px;
    width: 166px;

    object-fit: contain;
    object-position: 50% 50%;
  }
  .schematic h2 {
    margin: 0.8em 0;
    text-align: center;
  }
  .mode,
  .title,
  .reason {
    text-align: center;
  }

  div.changes a {
    text-decoration: none;
  }
  .title {
    text-align: center;
    margin: 1em 0 0 0;
  }
  .schematic h2 {
    backdrop-filter: blur(1em) brightness(0.7);
    margin: 0;
    padding: 0.8em 0;
  }
</style>

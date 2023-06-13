<script lang="ts">
  import LazyImage from '@/client/components/LazyImage.svelte';
  import IconButton from '@/client/components/buttons/IconButton.svelte';
  import SchematicCardVote from '@/client/components/SchematicCardVote.svelte';

  import { toast } from '@zerodevx/svelte-toast';
  import { copy } from '@/client/copy';

  import type { BasicSchematicJSON } from '@/interfaces/json';

  import { user } from '@/client/stores/user';

  export let schematic: BasicSchematicJSON;

  async function copySchematic() {
    await copy(schematic.text);
    toast.push('Copied to clipboard!');
  }
</script>

<template lang="pug">
  div.schematic
    div.tools
      a(href="/schematics/{schematic._id}.msch" download)
        IconButton(
          src="/assets/download.svg"
          alt="download schematic"
        )
      IconButton(on:click!="{copySchematic}" src="/assets/copy.svg" alt="copy")
      IconButton(
        href="/schematics/{schematic._id}/edit"
        src="/assets/pencil.svg"
        alt="edit"
      )
      IconButton(
        href="/schematics/{schematic._id}/delete"
        src="/assets/trash.svg"
        alt="delete"
      )
    a.view(href="/schematics/{schematic._id}")
      div.name
        h2 {schematic.name}
      LazyImage(src="/schematics/{schematic._id}.png" alt="Schematic Preview")
    SchematicCardVote(schematic!="{schematic}")
    
</template>

<style>
  .schematic {
    color: white;
    border: 3px solid #808080;
    display: flex;
    flex-direction: column;
    width: 172px;
    justify-content: space-between;
    border-radius: 0.5em;
    overflow: hidden;
    background-color: var(--surface);
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
  .schematic a.view {
    display: block;
    position: relative;
    height: 166px;
    width: 166px;
  }
  .schematic a.view > * {
    position: absolute;
    top: 0;
    left: 0;
  }
  .schematic a.view div.name {
    z-index: 2;
    word-wrap: normal;
    width: 100%;
    max-width: 100%;
    padding: 0 5px;
  }
  div.tools {
    display: flex;
  }
  div.tools > :global(*) {
    flex-grow: 1;
  }
  div.tools :global(a) {
    display: flex;
    justify-content: center;
  }
  div.tools :global(a button) {
    width: 100%;
  }
  .schematic :global(a.view img) {
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
</style>

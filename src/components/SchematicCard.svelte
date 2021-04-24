<script lang="ts">
  import { copy } from 'src/util/copy';
  import LazyImage from './LazyImage.svelte';
  import type { BasicSchematicJSON } from '@/interfaces/json';
  import IconButton from './buttons/IconButton.svelte';
  import { toast } from '@zerodevx/svelte-toast';
  export let schematic: BasicSchematicJSON;
  function copySchematic() {
    copy(schematic.text);
    toast.push('Copied to clipboard!');
  }
</script>

<div class="schematic">
  <div class="tools">
    <IconButton
      href="/schematics/{schematic._id}"
      src="/assets/info.svg"
      alt="info"
    />
    <IconButton on:click={copySchematic} src="/assets/copy.svg" alt="copy" />
    <IconButton
      href="/schematics/{schematic._id}/edit"
      src="/assets/pencil.svg"
      alt="edit"
    />
    <IconButton
      href="/schematics/{schematic._id}/delete"
      src="/assets/trash.svg"
      alt="delete"
    />
  </div>
  <div class="view">
    <div class="name">
      <h2>{schematic.name}</h2>
    </div>
    <LazyImage
      src="/raw/schematics/{schematic._id}/image"
      alt="Schematic Preview"
    />
  </div>
</div>

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
  .schematic div.view {
    position: relative;
    height: 166px;
    width: 166px;
  }
  .schematic div.view > * {
    position: absolute;
    top: 0;
    left: 0;
  }
  .schematic div.view div.name {
    z-index: 2;
    word-wrap: normal;
    width: 100%;
    max-width: 100%;
    padding: 0 5px;
  }
  div.tools {
    display: flex;
    background-color: var(--surface);
  }
  :global(div.tools > *) {
    flex-grow: 1;
  }
  div.tools :global(a) {
    display: flex;
    justify-content: center;
  }
  :global(div.tools a button) {
    width: 100%;
  }
  .schematic :global(div.view img) {
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

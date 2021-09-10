<script context="module" lang="ts">
  export const load: Load = async ({ fetch, page }) => {
    const { id } = page.params;
    const query = new URLSearchParams();
    query.append('increment', 'true');
    const response = await fetch(`/api/schematics/${id}.json?${query}`);
    const schematic = await response.json();
    return {
      props: { schematic },
    };
  };
</script>

<script lang="ts">
  import type { SchematicJSON } from '@/interfaces/json';
  import { safeDescription } from '@/lib/safe_description';
  import type { ItemName } from 'mindustry-schematic-parser';
  import { copy } from '@/client/copy';
  import IconButton from '@/client/components/buttons/IconButton.svelte';
  import { share } from '@/client/share';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import type { Load } from '@sveltejs/kit';
  import { toast } from '@zerodevx/svelte-toast';
  import { parseTags } from '@/lib/tag';

  export let schematic: SchematicJSON;
  const title = '[Schematic] ' + schematic.name;
  const imgUrl = `/api/schematics/${schematic._id}/image.png`;
  const description = safeDescription(schematic.description);
  const tags = parseTags(schematic.tags);
  const items: ItemName[] = [
    'copper',
    'lead',
    'metaglass',
    'graphite',
    'sand',
    'coal',
    'titanium',
    'thorium',
    'scrap',
    'silicon',
    'plastanium',
    'phase-fabric',
    'surge-alloy',
    'spore-pod',
    'blast-compound',
    'pyratite',
  ];
  async function copySchematic() {
    copy(schematic.text);
    toast.push('Copied to Clipboard!');
  }
</script>

<template lang="pug">
  svelte:head
    meta( property="og:title" content!="{schematic.name}" )
    meta( property="og:description" content="" )
    meta( property="og:image" content!="{imgUrl}" )
    meta( property="og:type" content="website" )
    meta( property="og:url" content="url" )
    meta( name="twitter:card" content="summary_large_image" )
    link( rel="stylesheet" href="/css/tags.css" )
    title {title}
  main
    h1.title {title}
    h5.views Views {schematic.views}
    img#preview(src!="{imgUrl}" alt="schematic preview")
    h3.author by {schematic.creator}
    h4.description
      +html("description")
    div.data
      div.requirements
        +each("items as item")
          +if("schematic.requirements[item]")
            span
              img.item(src="/assets/items/{item}.svg" alt!="{item}")
              span {schematic.requirements[item]}
      +if("schematic.powerConsumption || schematic.powerProduction")
        div.power
          +if("schematic.powerProduction")
            span(style="color: rgb(251, 211, 103);")
              img(src="/assets/power-icon-yellow.svg" alt="positive power icon")
              span +{schematic.powerProduction}
          +if("schematic.powerConsumption")
            span(style="color: rgb(229, 84, 84);")
              img(src="/assets/power-icon-red.svg" alt="negative power icon" )
              span -{schematic.powerConsumption}
    div.tags
      +each("tags as tag")
        div.tag(style="--color: {tag.color}")
          div.layer {tag.name}
    div.actions
      IconButton(src="/assets/copy.svg" alt="copy schematic" on:click!="{copySchematic}")
      IconButton(
      src="/assets/share.svg"
      alt="share schematic"
      on:click!="{() => share(schematic.name, window.location.href)}"
      )
      IconButton(
        href="/schematics/{schematic._id}/edit"
        src="/assets/pencil.svg"
        alt="edit schematic"
      )
      IconButton(
        href="/schematics/{schematic._id}/delete"
        src="/assets/trash.svg"
        alt="delete schematic"
      )
  footer
    BackButton(href="/" smart)
</template>

<style>
  main {
    color: white;
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: min-content min-content min-content min-content min-content min-content min-content;
    gap: 1em 2em;
    padding: 2em;
    grid-template-areas:
      'preview title'
      'preview author'
      'preview views'
      'preview description'
      'preview data'
      'preview tags'
      'preview actions';
    align-items: center;
    word-wrap: break-word;
    word-break: break-all;
    word-break: break-word;
    hyphens: auto;
  }
  main :global(#preview) {
    grid-area: preview;
    width: 100%;
    border-radius: 1em;
    align-self: baseline;
  }
  .title {
    grid-area: title;
  }
  .views {
    grid-area: views;
  }
  .description {
    grid-area: description;
    max-width: 100%;
  }
  .author {
    grid-area: author;
  }
  .tags {
    grid-area: tags;
  }
  .data {
    grid-area: data;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .actions {
    grid-area: actions;
    display: flex;
    border: 2px solid #808080;
    border-radius: 0.5em;
    width: min-content;
    overflow: hidden;
  }

  div.requirements {
    display: flex;
    gap: 5px 10px;
    flex-wrap: wrap;
    justify-content: start;
  }
  div.requirements > span {
    display: inline-flex;
    align-items: center;
  }
  div.requirements > span > img {
    margin-right: 3px;
    height: 2em;
  }
  div.power {
    margin-top: 1em;
    display: flex;
    justify-content: start;
    align-items: center;
    font-family: 'Mindustry';
    gap: 2em;
  }
  div.power > span {
    display: flex;
    align-items: center;
  }
  div.power img {
    height: 1.5rem;
    margin-right: 0.5em;
  }
  @media screen and (max-width: 600px) {
    main {
      text-align: center;
      grid-template-columns: 1fr;
      grid-template-rows: min-content min-content auto min-content min-content min-content min-content min-content;
      grid-template-areas:
        'title'
        'author'
        'preview'
        'views'
        'description'
        'data'
        'tags'
        'actions';
      align-items: center;
      justify-items: center;
    }
    main :global(#preview) {
      width: 70vw;
    }
    main .title {
      font-size: 1.2em;
    }
    main .author {
      font-size: 0.9em;
    }
    .data {
      align-items: center;
      font-size: 0.8em;
    }
    div.requirements {
      justify-content: center;
    }
    div.tags {
      justify-content: center;
    }
  }
</style>

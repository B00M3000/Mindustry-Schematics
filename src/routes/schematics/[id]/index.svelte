<script context="module" lang="ts">
  interface PreloadPage {
    host: string;
    path: string;
    query: Record<string, string>;
    params: Record<string, string>;
  }
  export async function preload(
    this: { fetch: typeof fetch },
    page: PreloadPage
  ) {
    const { id } = page.params;
    const response = await this.fetch(`/api/schematics/${id}`);
    const schematic = await response.json();
    return { schematic };
  }
</script>

<script lang="ts">
  import type { SchematicJSON } from '@/interfaces/json';
  import { safeDescription } from '@/util/safe_description';
  import type { ItemName } from 'mindustry-schematic-parser';
  import Tags from '@/tags.json';
  import type { Tag } from '@/interfaces/tag';
  import { copy } from '@/src/util/copy';
  import IconButton from '@/src/components/buttons/IconButton.svelte';
  import { share } from '@/src/util/share';
  import BackButton from '@/src/components/buttons/BackButton.svelte';

  export let schematic: SchematicJSON;
  const title = '[Schematic] ' + schematic.name;
  const imgUrl = `/raw/schematics/${schematic._id}/image`;
  const description = safeDescription(schematic.description);
  const tags = schematic.tags.map((name) =>
    Tags.find((t) => t.name === name)
  ) as Tag[];
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
</script>

<svelte:head>
  <meta property="og:title" content={schematic.name} />
  <meta property="og:description" content="" />
  <meta property="og:image" content={imgUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="url" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="stylesheet" href="/css/tags.css" />
  <title>{title}</title>
</svelte:head>
<main>
  <h1 class="title">{title}</h1>
  <h5 class="views">Views: {schematic.views}</h5>
  <img src={imgUrl} alt="schematic preview" id="preview" />
  <h3 class="author">by {schematic.creator}</h3>
  <h4 class="description">{@html description}</h4>
  <div class="data">
    <div class="requirements">
      {#each items as item}
        {#if schematic.requirements[item]}
          <span>
            <img src="/assets/items/{item}.png" alt={item} class="item" />
            <span>{schematic.requirements[item]}</span>
          </span>
        {/if}
      {/each}
    </div>
    {#if schematic.powerConsumption || schematic.powerProduction}
      <div class="power">
        {#if schematic.powerProduction}
          <span style="color: rgb(251, 211, 103);">
            <img
              src="/assets/power-icon-yellow.svg"
              alt="positive power icon"
            />
            <span>
              +{schematic.powerProduction}
            </span>
          </span>
        {/if}
        {#if schematic.powerConsumption}
          <span style="color: rgb(229, 84, 84);">
            <img src="/assets/power-icon-red.svg" alt="negative power icon" />
            <span>
              -{schematic.powerConsumption}
            </span>
          </span>
        {/if}
      </div>
    {/if}
  </div>
  <div class="tags">
    {#each tags as tag}
      <div class="tag" style="--color: {tag.color}">
        <div class="layer">{tag.name}</div>
      </div>
    {/each}
  </div>
  <div class="actions">
    <IconButton
      src="/assets/copy.svg"
      alt="copy schematic"
      on:click={() => copy(schematic.text)}
    />
    <IconButton
      src="/assets/share.svg"
      alt="share schematic"
      on:click={() => share(schematic.name, window.location.href)}
    />
    <IconButton
      href="/schematics/{schematic._id}/edit"
      src="/assets/pencil.svg"
      alt="edit schematic"
    />
    <IconButton
      href="/schematics/{schematic._id}/delete"
      src="/assets/trash.svg"
      alt="delete schematic"
    />
  </div>
</main>
<footer>
  <BackButton href="/" smart />
</footer>

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
  #preview {
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
    main #preview {
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

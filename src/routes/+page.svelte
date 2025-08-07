<script lang="ts">
  import TagInput from '@/client/components/TagInput.svelte';
  import SchematicCard from '@/client/components/SchematicCard.svelte';
  import IconButton from '@/client/components/buttons/IconButton.svelte';
  import { goto } from '$app/navigation';
  import { Tag } from '@/lib/tags';
  import BottomBar from '@/client/components/BottomBar.svelte';
  import type { PageData } from './$types';
  import PaginationBar from '@/client/components/PaginationBar.svelte';
  import PaginationText from '@/client/components/PaginationText.svelte';
  import { page } from '$app/stores';
  export let data: PageData;
  let form: HTMLFormElement;
  let currentTags = Tag.parse(data.tags.split(' '));
  $: ({ documents, page: currentPage, pages, schematics, skip } = data);
  async function search(e: Event) {
    e.preventDefault();
    const formData = new FormData(form);
    const searchParams = new URLSearchParams();
    formData.forEach((value, key) => searchParams.append(key, value.toString()));
    if (currentTags.length > 0) {
      searchParams.set(
        'tags',
        currentTags.map((t) => t.name.replace(/ /g, '_')).join(' '),
      );
    }
    await goto(`/?${searchParams}`);
  }
  function pageLink(pageNumber: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', pageNumber.toString());

    return `/?${params}`;
  }
</script>

<svelte:head>
  <title>Mindustry Schematics</title>
</svelte:head>

<h3 class="info">
  <PaginationText
    page={currentPage}
    {pages}
    {documents}
    {skip}
    pageSize={schematics.length}
  />
</h3>

<form class="search" bind:this={form} on:submit={search}>
  <input
    id="schematics_search"
    placeholder="Search for schematics..."
    name="query"
    value={data.query}
  />
  <div class="controls">
    <div></div>
    <div class="buttons">
      <button type="submit">
        <img src="/assets/check-mark.svg" alt="Search" />
      </button>
      <a href="/">
        <button type="submit">
          <img src="/assets/cross-mark.svg" alt="Clear" />
        </button>
      </a>
    </div>
  </div>
  <TagInput bind:currentTags />
</form>

<main>
  <ul id="schematics_result">
    {#each schematics as schematic}
      <li class="schematic">
        <SchematicCard {schematic} />
      </li>
    {/each}
  </ul>
</main>

<PaginationBar page={currentPage} {pages} {pageLink}>
  <IconButton
    slot="bottom_bar_middle"
    href="/schematics/create"
    src="/assets/add.svg"
    alt="add schematic"
    border
  >
    <span class="add_schematic">Add Schematic</span>
  </IconButton>
</PaginationBar>

<style>
  main {
    padding-bottom: 2em;
  }
  h3.info {
    text-align: center;
    margin: 2em 0 0.5em 0;
  }
  form {
    display: grid;
    grid-template-columns: 1fr max-content;
    grid-template-areas:
      'controls controls'
      'search search'
      ' tag_input tag_input'
      ' tags tags ';
    gap: 1em;
    padding: 1em 20%;
    width: 100%;
  }
  form :global(input) {
    color: white;
    background-color: var(--surface);
    border: 2px solid #808080;
    padding: 0.5em;
    border-radius: 0.5rem;
    width: 100%;
  }
  input#schematics_search {
    background-image: url('/assets/search-icon.svg');
    background-origin: border-box;
    background-position: 0.6em 50%;
    background-size: auto 70%;
    background-repeat: no-repeat;
    padding-left: 3em;
    grid-area: search;
  }
  form :global(input#tags) {
    grid-area: tag_input;
  }
  div.controls {
    grid-area: controls;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  div.controls div.buttons {
    display: flex;
    align-items: center;
    border: 2px solid #808080;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: var(--surface);
  }
  div.controls div.buttons button {
    border-radius: 0;
    border: none;
    height: 2em;
    width: 2em;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  div.controls div.buttons button:hover {
    background-color: #ffffff80;
  }
  div.controls img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
  form :global(ul.tags) {
    grid-area: tags;
    padding: 0;
  }
  ul#schematics_result {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 0.5rem;
    justify-content: center;
    list-style: none;
  }

  @media screen and (max-width: 600px) {
    form {
      width: 100%;
      padding: 1em 5%;
    }

    span.add_schematic {
      display: none;
    }
  }
</style>

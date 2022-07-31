<script context="module" lang="ts">
  export const load: Load = async ({ url, fetch }) => {
    const response = await fetch(`/schematics.json?${url.searchParams}`);
    const data: SchematicQueryJSON = await response.json();
    return {
      props: { data },
      cache: {
        maxage: 60,
      },
    };
  };
</script>

<script lang="ts">
  import TagInput from '@/client/components/TagInput.svelte';
  import type { SchematicQueryJSON } from '@/interfaces/json';
  import SchematicCard from '@/client/components/SchematicCard.svelte';
  import IconButton from '@/client/components/buttons/IconButton.svelte';
  import { goto } from '$app/navigation';
  import type { Load } from '@sveltejs/kit';
  import { Tag } from '@/lib/tags';
  import BottomBar from '@/client/components/BottomBar.svelte';
  export let data: SchematicQueryJSON;
  let form: HTMLFormElement;
  let currentTags = Tag.parse(data.tags.split(' '));
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
  function pageLink(page: number) {
    const params = new URLSearchParams({ page: page.toString() });
    if (data.query) params.set('query', data.query);
    if (data.tags) params.set('tags', data.tags);
    return `/?${params}`;
  }
</script>

<template lang="pug">
  svelte:head
    title Mindustry Schematics
  h3.info Page {data.page} of {data.pages}, Showing {data.skip}-{data.skip + data.schematics.length} of {data.documents}
  form.search(bind:this!="{form}" on:submit!="{search}")
    input#schematics_search(
      placeholder="Search for schematics..."
      name="query"
      value!="{data.query}"
    )
    div.controls
      div
      div.buttons
        button(type="submit")
          img(src="/assets/check-mark.svg" alt="Search")
        a(href="/")
          button(type="submit")
            img(src="/assets/cross-mark.svg" alt="Clear")
    TagInput(bind:currentTags)
  main
    ul#schematics_result
      +each("data.schematics as schematic")
        li.schematic
          SchematicCard({schematic})
  
  div.bottom
    BottomBar
      IconButton(
        href!="{pageLink(1)}"      
      src="/assets/double_chevron.svg"
      alt="first page"
        class!="{data.page < 3 ? 'hidden' : ''}"
        border
      )
      IconButton(
        href!="{pageLink(data.page - 1 || 1)}"
        src="/assets/chevron.svg"
        alt="previous page"
        class!="{data.page < 2 ? 'hidden' : ''}"
        border
      )
      IconButton(
        href="/schematics/create"
        src="/assets/add.svg"
        alt="add schematic"
        class="add"
        border
      )
        span Add Schematic
      IconButton.right(
        href!="{pageLink(data.page + 1)}"
        src="/assets/chevron.svg"
        alt="next page"
        class!="{data.page > data.pages - 1 ? 'hidden' : ''}"
        border
      )
      IconButton.right(
        href!="{pageLink(data.pages)}"
        src="/assets/double_chevron.svg"
        alt="last page"
        class!="{data.page > data.pages - 2 ? 'hidden' : ''}"
        border
      )
</template>

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
  div.controls select {
    padding: 0.3rem;
    color: white;
    display: flex;
    align-items: center;
    border: 2px solid #808080;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: var(--surface);
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
  .bottom {
    display: contents;
  }
  .bottom :global(.right img) {
    transform: scaleX(-1);
  }
  .bottom :global(a.hidden) {
    visibility: hidden;
    pointer-events: none;
  }
  @media screen and (max-width: 600px) {
    form {
      width: 100%;
      padding: 1em 5%;
    }

    .bottom :global(.add span) {
      display: none;
    }

    .bottom {
      justify-content: space-evenly;
    }
  }
</style>

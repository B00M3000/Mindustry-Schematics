<script lang="ts">
  import type { Tag } from '@/interfaces/tag';
  import Tags from '@/lib/tags';

  export let currentTags: Tag[] = [];

  function handleChange(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) {
    const input = e.currentTarget;
    const { value } = input;
    e.preventDefault();
    const tag = Tags.find((t) => t.name.toLowerCase() === value.toLowerCase());
    if (!tag) return;
    const isUsed = currentTags.includes(tag);
    if (tag && !isUsed) {
      currentTags.push(tag);
      currentTags = currentTags.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
      input.value = '';
    } else {
      input.value = '';
    }
  }
  function removeTag(tag: Tag) {
    const index = currentTags.indexOf(tag);
    if (index < 0) return;
    currentTags.splice(index, 1);
    currentTags = currentTags;
  }
</script>

<template lang="pug">
  input#tags(type="text" list="tags-list" placeholder="Tags" on:input!="{handleChange}")
  datalist#tags-list
    +each("Tags as tag")
      option(value!="{tag.name}")
  ul.tags
    +each("currentTags as tag (tag.name)")
      li(style="--color: {tag.color}")
        div.layer {tag.name}
          img(src="/assets/cross-mark.svg" alt="remove" on:click!="{()=> removeTag(tag)}")
</template>

<style>
  ul.tags {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
    justify-content: center;
    list-style-type: none;
    gap: 0.5em;
    padding: 0 20%;
    color: white;
  }
  ul.tags li {
    display: inline-block;
    --color: #888888;
    border: none;
    background-color: var(--color);
    border-radius: 5px;
    max-width: min-content;
    white-space: nowrap;
  }
  ul.tags li .layer {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    padding: 0.3em;
    height: 100%;
    width: 100%;
  }
  ul.tags li img {
    height: 0.8em;
    object-fit: contain;
    margin-left: 0.5em;
    cursor: pointer;
  }
</style>

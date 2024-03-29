<script lang="ts">
  import type { SchematicChangeJSON } from '@/interfaces/json';
  import { safeDescription } from '@/lib/safe_description';
  import { diffArrays, diffSentences } from 'diff';
  import type { ArrayChange, Change } from 'diff';
  import Accesss from './_actions.svelte';
  import AuthorCard from '@/client/components/AuthorCard.svelte';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import { Access, UserAccess } from '@/lib/auth/access';
  import { Tag } from '@/lib/tags';
  import BottomBar from '@/client/components/BottomBar.svelte';
  import type { PageData } from './$types';
  export let data: PageData;

  let { change, original, differentImages } = data.data;
  let originalTags = original ? Tag.parse(original.tags) : [];
  let changedTags = change.Changed ? Tag.parse(change.Changed.tags) : [];
  let diffs:
    | undefined
    | {
        name: Change[];
        description: Change[];
        tags: ArrayChange<Tag>[];
      };
  if (original && change.Changed) {
    diffs = {
      name: diffSentences(original.name, change.Changed.name),
      description: diffSentences(original.description, change.Changed.description),
      tags: diffArrays(originalTags, changedTags),
    };
  }
  function classOfDiff<T>(diff: Change | ArrayChange<T>) {
    return diff.added ? 'added' : diff.removed ? 'removed' : 'unmodified';
  }
</script>

<template lang="pug">
  svelte:head
    title Change a Schematic
  
  main
    +if("change.Delete != undefined && original")
      h3.mode.delete Delete Request
      div.requester
          span Requester: 
          AuthorCard(creator_id!="{change.creator_id}")
      h4.reason Reason: {change.Delete}
      div.schematic.delete
        h1.name {original.name}
        img.preview(src="/schematics/{change.id}.png" alt="schematic preview")
        div.creator
          span.creator by 
          AuthorCard(creator_id!="{original.creator_id}")
        h4.description: +html("safeDescription(original.description ?? '')")
        div.tags
          +each("originalTags as tag")
            div.tag(style="--color: {tag.color};")
              div.layer
                span {tag.name}
      div.options
        Accesss({change})
      +elseif("diffs")
        h2.mode Modify Request
        div.requester
          span Requester: 
          AuthorCard(creator_id!="{change.creator_id}")
        h4.reason Changes: {change.Description}
        
        div.schematic.modify
          h1.name
            +each("diffs.name as diff")
              span(class!="{classOfDiff(diff)}") {diff.value}
          div.preview
            figure(class!="{differentImages ? 'removed' : 'unmodified'}")
              img(src="/schematics/{change.id}.png" alt="old preview")
            +if("differentImages")
              figure.added
                img(src="{change._id}.png" alt="new preview")
          div.creator
            span.creator by 
            AuthorCard(creator_id!="{original.creator_id}")
          div.description
            +each("diffs.description as diff")
              span(class!="{classOfDiff(diff)}") {diff.value}
          div.tags
            +each("diffs.tags as diff")
              +each("diff.value as tag")
                div.tag(class!="{classOfDiff(diff)}" style="--color: {tag.color}")
                  div.layer
                    span {tag.name}
        div.options
          Accesss({change})
  BottomBar
    BackButton(href="/admin/schematic_changes" smart)
</template>

<style>
  .tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    width: max-content;
    gap: 1em;
    max-width: 100%;
  }
  .tag {
    display: inline-block;
    --color: #888888;
    border: none;
    background-color: var(--color);
    border-radius: 5px;
    max-width: min-content;
    white-space: nowrap;
  }

  .tag .layer {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    padding: 0.3em;
    height: 100%;
    width: 100%;
  }
  .mode,
  .title,
  .reason,
  .requester {
    text-align: center;
    margin: 10px;
  }
  .schematic {
    margin: 1em 1em;
    padding: 2em 2em;
    border-color: #bbb;
    border-style: solid;
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: min-content min-content min-content min-content min-content;
    grid-template-areas:
      'image title'
      'image author'
      'image description'
      'image tags'
      'image actions';
    gap: 1em 2em;
    align-items: center;
    word-wrap: break-word;
    word-break: break-all;
    word-break: break-word;
    hyphens: auto;
  }
  .preview {
    width: 100%;
    grid-area: image;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-radius: 1em;
  }
  .preview figure::before {
    border-radius: 1em;
  }
  .preview img {
    width: 100%;
    border-radius: 1em;
    display: block;
  }
  .name {
    grid-area: title;
  }
  .creator {
    grid-area: author;
  }
  .description {
    grid-area: description;
  }
  .tags {
    grid-area: tags;
    width: 100%;
    padding: 1em;
  }
  .actions {
    grid-area: actions;
    display: flex;
    gap: 1em;
  }
  .added {
    position: relative;
    display: inline-block;
  }
  .added::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 255, 13, 0.2);
    z-index: 1;
  }
  .removed {
    position: relative;
    display: inline-block;
  }
  .removed::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: rgba(255, 0, 0, 0.2);
    z-index: 1;
  }
  .tag.added::before {
    top: -0.5em;
    left: -0.5em;
    height: calc(100% + 1em);
    width: calc(100% + 1em);
  }
  .tag.removed::before {
    top: -0.5em;
    left: -0.5em;
    height: calc(100% + 1em);
    width: calc(100% + 1em);
  }
  .options {
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width: 600px) {
    .schematic {
      padding: 2em;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: min-content min-content auto min-content min-content min-content;
      grid-template-areas:
        'title'
        'author'
        'image '
        'description'
        'tags'
        'actions';
      gap: 1em 2em;
      align-items: center;
      justify-items: center;
    }
    .preview {
      width: 70vw;
    }
    .tags {
      justify-content: center;
    }
    h1.name {
      font-size: 1.2em;
    }
    .creator {
      font-size: 0.8em;
    }
    .title {
      font-size: 1.4em;
    }
    .reason {
      font-size: 1.1em;
    }
  }
</style>

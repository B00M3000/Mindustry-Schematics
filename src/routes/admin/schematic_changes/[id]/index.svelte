<script context="module" lang="ts">
  import type { Session } from '@/interfaces/app';

  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch, page, session }) => {
    const access = UserAccess.from((session as Session).access);
    if (
      !access.can({
        schematics: { delete: 'all', update: 'all' },
      })
    )
      return {
        status: 403,
        error: new Error('Forbidden'),
      };
    const response = await fetch(
      `/admin/schematic_changes/${page.params.id}/change.json`,
    );
    const json = await response.json();
    return {
      props: {
        data: json,
      },
    };
  };
</script>

<script lang="ts">
  import type { SchematicChangeJSON } from '@/interfaces/json';
  import { safeDescription } from '@/lib/safe_description';
  import { diffArrays, diffSentences } from 'diff';
  import type { ArrayChange, Change } from 'diff';
  import type { Tag } from '@/interfaces/tag';
  import Actions from './_actions.svelte';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import { parseTags } from '@/lib/tag';
  import { UserAccess } from '@/lib/auth/access';
  export let data: SchematicChangeJSON;
  let change = data.change;
  let original = data.original;
  let differentImages = data.differentImages;
  let originalTags = original ? parseTags(original.tags) : [];
  let changedTags = change.Changed ? parseTags(change.Changed.tags) : [];
  let diffs:
    | undefined
    | {
        name: Change[];
        creator: Change[];
        description: Change[];
        tags: ArrayChange<Tag>[];
      };

  if (original && change.Changed) {
    diffs = {
      name: diffSentences(original.name, change.Changed.name),
      creator: diffSentences(original.creator, change.Changed.creator),
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
      h3.mode.delete Delete
      h4.reason Reason: {change.Delete}
      div.schematic.delete
        h1.name {original.name}
        img.preview(src="/api/schematics/{change.id}.png" alt="schematic preview")
        h3.creator by {original.creator}
        h4.description: +html("safeDescription(original.description)")
        div.tags
          +each("originalTags as tag")
            div.tag(style="--color: {tag.color};")
              div.layer
                span {tag.name}
        Actions({change})
      +elseif("diffs")
        h3.mode Modify
        h4.reason What and Why
        div.schematic.modify
          h1.name
            +each("diffs.name as diff")
              span(class!="{classOfDiff(diff)}") {diff.value}
          div.preview
            figure(class!="{differentImages ? 'removed' : 'unmodified'}")
              img(src="/api/schematics/{change.id}.png" alt="old preview")
            +if("differentImages")
              figure.added
                img(src="/api/schematic_changes/{change._id}.png" alt="new preview")
          div.creator by 
            +each("diffs.creator as diff")
              span(class!="{classOfDiff(diff)}") {diff.value}
          div.description
            +each("diffs.description as diff")
              span(class!="{classOfDiff(diff)}") {diff.value}
          div.tags
            +each("diffs.tags as diff")
              +each("diff.value as tag")
                div.tag(class!="{classOfDiff(diff)}" style="--color: {tag.color}")
                  div.layer
                    span {tag.name}
          Actions({change})
  footer
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
  .reason {
    text-align: center;
  }
  .schematic {
    padding: 2em;
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
    h3.creator {
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

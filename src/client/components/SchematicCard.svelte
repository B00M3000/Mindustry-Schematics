<script lang="ts">
  import LazyImage from '@/client/components/LazyImage.svelte';
  import IconButton from '@/client/components/buttons/IconButton.svelte';

  import { toast } from '@zerodevx/svelte-toast';
  import { copy } from '@/client/copy';

  import Icon from '@/client/components/Icon.svelte';
  import CaretUp from '@/client/icons/CaretUp';
  import CaretDown from '@/client/icons/CaretDown';

  import type { BasicSchematicJSON } from '@/interfaces/json';

  import { user } from '@/client/stores/user';

  export let schematic: BasicSchematicJSON;

  async function copySchematic() {
    await copy(schematic.text);
    toast.push('Copied to clipboard!');
  }

  let local_vote = $user.id && schematic.votes ? Object.keys(schematic.votes).includes($user.id) ? schematic.votes[$user.id] : 0 : 0
  const votes = schematic.votes ? Object.values(schematic.votes).reduce((a: number, b: number) => a + b, 0) - local_vote : 0
  const logged_in = Boolean($user.id)

  function handleUpvote(){
    if(local_vote == 1) vote(0)
    else vote(1)
  }
  function handleDownvote(){
    if(local_vote == -1) vote(0)
    else vote(-1)
  }
  function vote(v: number){
    if(!logged_in) return toast.push("You must be logged in to vote.")
    local_vote = v
    //TBA: Send Result to Server
  }

  let upvoteColor: string;
  let downvoteColor: string;

  $: upvoteColor = local_vote == 1 ? "green" : "grey"
  $: downvoteColor = local_vote == -1 ? "red" : "grey"
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
    div.votes
      div.votes-inner
        div.vote-button.upvote(on:click!="{handleUpvote}")
          //- IconButton(src="/assets/caret-up.svg")
          Icon(src!="{CaretUp}" color!="{upvoteColor}" size="1.5em")
        span {votes + local_vote}
        div.vote-button.downvote(on:click!="{handleDownvote}")
          Icon(src!="{CaretDown}" color!="{downvoteColor}" size="1.5em")
          //- IconButton(src="/assets/caret-down.svg")
          //- IconButton(src="/assets/put_litter_in_its_place.svg")
</template>

<style>
  .upvote { color: green }
  .downvote { color: red }
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
    background-color: var(--surface);
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
  .votes {
    background-color: var(--surface);
  }
  .votes-inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: var(--surface);
    margin: 0 1.7em;
  }
  .vote-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

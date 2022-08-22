<script context="module" lang="ts">
  export const load: Load = async ({ fetch, params, session }) => {
    const { id } = params;
    if(!session.id) return { status: 307, redirect: `/user?redirect=/schematics/${id}/delete`}
    const response = await fetch(`/schematics/${id}.json`);
    const schematic = await response.json();
    const access = UserAccess.from(session.access);
    const directActions =
      access.can({ schematics: Access.deleteAll | Access.updateAll }) ||
      session.id == schematic.creator_id;
    return {
      props: { schematic, directActions },
    };
  };
</script>

<script lang="ts">
  import type { SchematicJSON } from '@/interfaces/json';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import { safeDescription } from '@/lib/safe_description';
  import { goto } from '$app/navigation';
  import type { Load } from '@sveltejs/kit';
  import { auth } from '@/client/stores/auth';
  import { toast } from '@zerodevx/svelte-toast';
  import { user } from '@/client/stores/user';
  import { Access, UserAccess } from '@/lib/auth/access';
  import BottomBar from '@/client/components/BottomBar.svelte';
  import AuthorCard from '@/client/components/AuthorCard.svelte';

  export let directActions: boolean;

  export let schematic: SchematicJSON;
  let form: HTMLFormElement;
  let submitting = false;
  async function submit(e: Event) {
    e.preventDefault();
    submitting = true;
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
    });
    await goto(response.headers.get('location') as string);
    if ($auth.access.can({ schematics: Access.deleteAll })) {
      const { change } = await response.json();
      const changeUrl = `/admin/schematic_changes/${change}`;
      toast.push(`<a href="${changeUrl}"><button>See delete request</button></a>`);
    }
  }
  async function direct() {
    submitting = true;
    const data = new FormData(form);
    const response = await fetch(`/schematics/${schematic._id}/delete.json?direct=true`, {
      method: 'POST',
      body: data,
    });
    await goto(response.headers.get('location') as string);
  }
</script>

<template lang="pug">
  svelte:head
    title Delete a Schematic

  h1 Delete a Schematic
  form(  
    action="/schematics/{schematic._id}/delete.json"
    method="POST"
    bind:this!="{form}"
    on:submit!="{submit}"
  )
    h2.title [Schematic] {schematic.name}
    div.creator by 
      AuthorCard(creator_id!="{schematic.creator_id}")
    img(src="/schematics/{schematic._id}.png" alt="schematic preview")
    h4.description 
      +html("safeDescription(schematic.description ?? '')")
    div.inputs
      label(for="reason")
      textarea#reason(
        name="reason"
        placeholder="Why should this schematic be removed?"
        required
      )
    div
      button(type="submit") {submitting ? 'Please wait...' : 'Submit Deletion Request'}
      +if("directActions")
        button(type="button" on:click!="{direct}") {submitting ? 'Please wait...' : 'Direct Deletion'}
  footer
    BottomBar
      BackButton(href="/schematics/{schematic._id}" smart)
</template>

<style>
  button {
    margin: 5px;
  }
  h1 {
    text-align: center;
    margin-top: 1.5rem;
  }
  form {
    color: white;
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: min-content min-content min-content min-content min-content min-content min-content;
    gap: 1em 2em;
    padding: 2em;
    grid-template-areas:
      'preview title'
      'preview creator'
      'preview description'
      'preview input'
      'preview submit';
    align-items: center;
    justify-items: baseline;
    word-wrap: break-word;
    word-break: break-all;
    word-break: break-word;
    hyphens: auto;
  }
  .title {
    grid-area: title;
  }
  .creator {
    grid-area: creator;
  }
  .description {
    grid-area: description;
    text-align: start;
  }
  form img {
    grid-area: preview;
    width: 100%;
    border-radius: 1em;
    align-self: baseline;
  }
  .inputs {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    align-items: baseline;
  }
  textarea {
    width: 50vw;
    max-width: 500px;
  }
  button[type='submit'] {
    grid-area: submit;
  }
  @media screen and (max-width: 600px) {
    form {
      text-align: center;
      grid-template-columns: 1fr;
      grid-template-rows: min-content min-content auto min-content min-content min-content min-content min-content;
      grid-template-areas:
        'title'
        'creator'
        'preview'
        'description'
        'input'
        'submit';
      justify-items: center;
    }
    form img {
      width: 70vw;
    }
    form .title {
      font-size: 1.2em;
    }
    form .creator {
      font-size: 0.9em;
    }
  }
</style>

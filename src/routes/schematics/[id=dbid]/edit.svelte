<script context="module" lang="ts">
  export const load: Load = async ({ fetch, params, session }) => {
    const { id } = params;
    const response = await fetch(`/schematics/${id}.json`);
    const schematic = await response.json();
    const access = UserAccess.from(session.access);
    const directActions = access.can({ schematics: Access.deleteAll | Access.updateAll });
    return {
      props: { schematic, directActions },
    };
  };
</script>

<script lang="ts">
  import type { SchematicJSON } from '@/interfaces/json';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import SchematicForm from '@/client/components/SchematicForm.svelte';
  import type { Load } from '@sveltejs/kit';
  import BottomBar from '@/client/components/BottomBar.svelte';
  import { UserAccess, Access } from '@/lib/auth/access';

  export let schematic: SchematicJSON;
  export let directActions: boolean;
</script>

<template lang="pug">
  svelte:head
    meta(property="og:title" content="Request a Change on a Existing Schematic. ")
    meta(property="og:description" content="Submit a request to modify a schematic.")
    meta(property="og:image" content="/schematics/{schematic.id}.png")
    meta(property="og:type" content="website")
    title Edit a Schematic

  h1 Edit a Schematic
  div
    SchematicForm(
      variant="edit"
      action="/schematics/{schematic._id}/edit.json"
      initialData!="{schematic}"
      directActions
    )
  BottomBar
    BackButton(href="/schematics/{schematic._id}" smart)
</template>

<style>
  h1 {
    text-align: center;
    margin: 1.5rem 0;
  }
  div {
    margin-bottom: 2rem;
  }
</style>

<script context="module" lang="ts">
  export const load: Load = async ({ fetch, page }) => {
    const { id } = page.params;
    const response = await fetch(`/api/schematics/${id}.json`);
    const schematic = await response.json();
    return {
      props: { schematic },
    };
  };
</script>

<script lang="ts">
  import type { SchematicJSON } from '@/interfaces/json';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import SchematicForm from '@/client/components/SchematicForm.svelte';
  import type { Load } from '@sveltejs/kit';
  export let schematic: SchematicJSON;
</script>

<template lang="pug">
  svelte:head
    meta(property="og:title" content="Request a Change on a Existing Schematic. ")
    meta(property="og:description" content="Submit a request to modify a schematic.")
    meta(property="og:image" content="/api/schematics/{schematic.id}/image.png")
    meta(property="og:type" content="website")
    title Edit a Schematic

  h1 Edit a Schematic
  SchematicForm(
    variant="edit"
    action="/api/schematics/{schematic._id}/edit.json"
    initialData!="{schematic}"
  )
  footer
    BackButton(href="/schematics/{schematic._id}" smart)
</template>

<style>
  h1 {
    text-align: center;
    margin: 1.5rem 0;
  }
</style>

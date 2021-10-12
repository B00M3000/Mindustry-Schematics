<script context="module" lang="ts">
  export const load: Load = async ({ fetch, page }) => {
    const { id } = page.params;
<<<<<<< HEAD
    const response = await fetch(`/api/schematics/${id}`);
=======
    const response = await fetch(`/api/schematics/${id}.json`);
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
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
<<<<<<< HEAD
    meta(property="og:image" content="/api/schematics/{schematic.id}/image")
=======
    meta(property="og:image" content="/api/schematics/{schematic.id}.png")
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
    meta(property="og:type" content="website")
    title Edit a Schematic

  h1 Edit a Schematic
  SchematicForm(
    variant="edit"
<<<<<<< HEAD
    action="/api/schematics/{schematic._id}/edit"
=======
    action="/api/schematics/{schematic._id}/edit.json"
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
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

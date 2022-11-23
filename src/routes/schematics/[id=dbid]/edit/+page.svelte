<script lang="ts">
  import type { SchematicJSON } from '@/interfaces/json';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import SchematicForm from '@/client/components/SchematicForm.svelte';
  import type { Load } from '@sveltejs/kit';
  import { user } from '@/client/stores/user';
  import BottomBar from '@/client/components/BottomBar.svelte';
  import { UserAccess, Access } from '@/lib/auth/access';
  import type { PageData } from './$types';

  export let data: PageData;

  let { schematic, directActions } = data;
  $: ({ schematic, directActions } = data);
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
      directActions!="{directActions}"
    )
  footer
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

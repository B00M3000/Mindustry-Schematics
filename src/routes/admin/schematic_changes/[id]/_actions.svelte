<script lang="ts">
  import { goto } from '$app/navigation';

  import type { SchematicChangeJSON } from '@/interfaces/json';

  export let change: SchematicChangeJSON['change'];

  async function accept() {
<<<<<<< HEAD
    const response = await fetch(`/api/schematic_changes/${change._id}/accept`, {
=======
    const response = await fetch(`/api/schematic_changes/${change._id}/accept.json`, {
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      method: 'POST',
    });
    await goto(response.headers.get('location') || '/admin/schematic_changes');
  }
  async function decline() {
<<<<<<< HEAD
    const response = await fetch(`/api/schematic_changes/${change._id}/decline`, {
=======
    const response = await fetch(`/api/schematic_changes/${change._id}/decline.json`, {
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      method: 'POST',
    });
    await goto(response.headers.get('location') || '/admin/schematic_changes');
  }
</script>

<template lang="pug">
  div.actions
    a(href="/schematics/{change.id}")
      button View
    button(on:click!="{accept}") Accept
    button(on:click!="{decline}") Decline
</template>

<style>
  .actions {
    display: flex;
    gap: 0.5rem;
  }
</style>

<script lang="ts">
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import SchematicForm from '@/client/components/SchematicForm.svelte';
</script>

<template lang="pug">
  h1 Create Schematic
<<<<<<< HEAD
  SchematicForm(variant="create" action="/api/schematics/create")
=======
  SchematicForm(variant="create" action="/api/schematics.json")
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
  footer
    BackButton(href="/" smart)
</template>

<style>
  h1 {
    text-align: center;
    margin: 1.5rem 0;
  }
</style>

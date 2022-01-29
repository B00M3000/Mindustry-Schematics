<script lang="ts">
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import SchematicForm from '@/client/components/SchematicForm.svelte';
</script>

<template lang="pug">
  h1 Create Schematic
  SchematicForm(variant="create" action="/schematics.json")
  footer
    BackButton(href="/" smart)
</template>

<style>
  h1 {
    text-align: center;
    margin: 1.5rem 0;
  }
</style>

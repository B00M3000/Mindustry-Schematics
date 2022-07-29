<script lang="ts">
  import BottomBar from '@/client/components/BottomBar.svelte';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import SchematicForm from '@/client/components/SchematicForm.svelte';

  import { user } from '@/client/stores/user'
</script>

<template lang="pug">
  h1 Create Schematic
  +if("$user.id")
    SchematicForm(variant="create" action="/schematics.json")
    +else
      p You must have an account to create schematics
  footer
    div
      BottomBar
        BackButton(href="/" smart)
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

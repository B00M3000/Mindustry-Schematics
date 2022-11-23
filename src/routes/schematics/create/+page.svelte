<script lang="ts">
  import BottomBar from '@/client/components/BottomBar.svelte';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import SchematicForm from '@/client/components/SchematicForm.svelte';
</script>

<template lang="pug">
  h1 Create Schematic
  p.
    Policy: When adding schematics created by other's please give credit in comments. 
    If you find that someone has posted a schematic that you created, please join the discord server in the info tab and ping @NoobMan13.
  SchematicForm(variant="create" action="/schematics.json")

  footer
    div
      BottomBar
        BackButton(href="/" smart)
</template>

<style>
  p {
    margin: 30px 50px;
  }
  h1 {
    text-align: center;
    margin: 1.5rem 0;
  }
  div {
    margin-bottom: 2rem;
  }
</style>

<script lang="ts">
  import BackButton from '@/src/components/buttons/BackButton.svelte';
  import SchematicForm from '@/src/components/SchematicForm.svelte';
</script>

<h1>Create a Schematic</h1>
<SchematicForm variant="create" action="/api/schematics/create" />
<footer>
  <BackButton href="/" />
</footer>

<style>
  h1 {
    text-align: center;
    margin: 1.5rem 0;
  }
</style>

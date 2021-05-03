<script lang="ts">
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import SchematicForm from '@/client/components/SchematicForm.svelte';
</script>

<h1>Create a Schematic</h1>
<SchematicForm variant="create" action="/api/schematics/create" />
<footer>
  <BackButton href="/" smart />
</footer>

<style>
  h1 {
    text-align: center;
    margin: 1.5rem 0;
  }
</style>

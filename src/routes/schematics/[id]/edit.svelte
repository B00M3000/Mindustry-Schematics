<script context="module" lang="ts">
  interface PreloadPage {
    host: string;
    path: string;
    query: Record<string, string>;
    params: Record<string, string>;
  }
  export async function preload(
    this: { fetch: typeof fetch },
    page: PreloadPage
  ) {
    const { id } = page.params;
    const response = await this.fetch(`/api/schematics/${id}`);
    const schematic = await response.json();
    return { schematic };
  }
</script>

<script lang="ts">
  import type { SchematicJSON } from '@/interfaces/json';
  import BackButton from '@/src/components/buttons/BackButton.svelte';
  import SchematicForm from '@/src/components/SchematicForm.svelte';
  export let schematic: SchematicJSON;
</script>

<svelte:head>
  <meta
    property="og:title"
    content="Request a Change on a Existing Schematic. "
  />
  <meta
    property="og:description"
    content="Submit a request to modify a schematic."
  />
  <meta property="og:image" content="/raw/schematics/{schematic.id}/image" />
  <meta property="og:type" content="website" />
  <title>Edit a Schematic</title>
</svelte:head>
<h1>Edit a Schematic</h1>
<SchematicForm
  variant="edit"
  action="/api/schematics/{schematic._id}/edit"
  initialData={schematic}
/>
<footer>
  <BackButton href="/schematics/{schematic._id}" smart />
</footer>

<style>
  h1 {
    text-align: center;
    margin: 1.5rem 0;
  }
</style>

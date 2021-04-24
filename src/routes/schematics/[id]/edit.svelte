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
<form action="/api/schematics/{schematic.id}" method="POST">
  <div class="inputs">
    <label for="name">Name:</label>
    <input
      id="name"
      name="name"
      placeholder="Name of the schematic"
      value={schematic.name}
      required
    />
    <label for="creator">Creator:</label>
    <input
      id="creator"
      name="creator"
      placeholder="Creator of the schematic"
      value={schematic.creator}
      required
    />
    <label for="description">Description:</label>
    <input
      id="description"
      name="description"
      placeholder="Description of the schematic"
      value={schematic.description}
      required
    />
    <label for="description">Schematic:</label>
    <input
      id="description"
      name="description"
      placeholder="Description of the schematic"
      value={schematic.description}
      required
    />
  </div>
</form>

<style>
</style>

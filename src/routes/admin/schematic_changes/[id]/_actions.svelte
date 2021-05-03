<script lang="ts">
  import { goto } from '$app/navigation';

  import type { SchematicChangeJSON } from '@/interfaces/json';

  export let change: SchematicChangeJSON['change'];

  async function accept() {
    const response = await fetch(`/api/schematic_changes/${change._id}/accept`, {
      method: 'POST',
    });
    await goto(response.headers.get('location') || '/admin/schematic_changes');
  }
  async function decline() {
    const response = await fetch(`/api/schematic_changes/${change._id}/decline`, {
      method: 'POST',
    });
    await goto(response.headers.get('location') || '/admin/schematic_changes');
  }
</script>

<div class="actions">
  <a href="/schematics/{change.id}">
    <button>View</button>
  </a>
  <button on:click={accept}>Accept</button>
  <button on:click={decline}>Decline</button>
</div>

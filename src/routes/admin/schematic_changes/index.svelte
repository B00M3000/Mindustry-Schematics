<script context="module" lang="ts">
  export const load: Load = async ({ context, fetch, page, session }) => {
    const { isMod } = session as Session;
    if (!isMod) {
      return {};
    }
    const response = await fetch('schematic_changes/changes');
    const changes = await response.json();
    return {
      props: {
        changes,
      },
    };
  };
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Session } from '@/interfaces/app';
  import type { SchematicChangeInfoJSON } from '@/interfaces/json';
  import type { Load } from '@sveltejs/kit';
  import { onMount } from 'svelte';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import LazyImage from '@/client/components/LazyImage.svelte';
  import { auth } from '@/client/stores/auth';
  export let changes: SchematicChangeInfoJSON[] = [];
  onMount(() => {
    if (!$auth.isMod) goto('/user');
  });
</script>

<svelte:head>
  <title>Schemtic Changes</title>
</svelte:head>

{#if $auth.isAdmin}
  <h1 class="title">Schematic Changes</h1>
  <div class="changes">
    {#each changes as change}
      <a href="schematic_changes/{change._id}">
        <div class="schematic">
          <h2>
            <span class={change.mode}>
              {change.mode}
            </span>
            <span> {change.name}</span>
          </h2>
          <LazyImage src="/api/schematics/{change.id}/image" alt="schematic preview" />
        </div>
      </a>
    {/each}
  </div>
  <footer>
    <BackButton href="/user" smart />
  </footer>
{/if}

<style>
  div.changes {
    padding: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  span.delete {
    color: hsl(0, 98%, 68%);
  }
  span.modify {
    color: hsl(120, 50%, 60%);
  }
  .schematic {
    color: white;
    border: 3px solid #808080;
    display: flex;
    flex-direction: column;
    width: 172px;
    justify-content: space-between;
    border-radius: 0.5em;
    overflow: hidden;
  }

  .schematic .name {
    position: relative;
    top: 0px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: rgba(40, 40, 40, 0.5);
  }

  .schematic h2 {
    font-size: 10px;
    font-style: thin;
  }
  .schematic :global(img) {
    z-index: 1;
    height: 166px;
    width: 166px;

    object-fit: contain;
    object-position: 50% 50%;
  }
  .schematic h2 {
    margin: 0.8em 0;
    text-align: center;
  }
  .mode,
  .title,
  .reason {
    text-align: center;
  }

  div.changes a {
    text-decoration: none;
  }
  .title {
    text-align: center;
    margin: 1em 0 0 0;
  }
  .schematic h2 {
    backdrop-filter: blur(1em) brightness(0.7);
    margin: 0;
    padding: 0.8em 0;
  }
</style>

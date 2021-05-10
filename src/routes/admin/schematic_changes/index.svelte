<script context="module" lang="ts">
  export const load: Load = async ({ fetch, session }) => {
    const access = UserAccess.from((session as Session).access);
    if (!access.can({ schematics: ['delete', 'update'] })) {
      return {
        props: {
          redirect: true,
        },
      };
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
  import { UserAccess } from '@/lib/auth/access';
  export let redirect = false;
  export let changes: SchematicChangeInfoJSON[] = [];
  const allowed = $auth.access.can({ schematics: ['delete', 'update'] });
  onMount(() => {
    if (redirect) goto('/user');
  });
</script>

<template lang="pug">
  svelte:head
    title Schematic Changes
  +if("allowed")
    h1.changes Schematic Changes
    div.changes
      +each("changes as change")
        a(href="schematic_changes/{change._id}")
          div.schematic
            h2
              span(class!="{change.mode}") {change.mode} 
              span {change.name}
            LazyImage(src="/api/schematics/{change.id}/image" alt="schematic preview")
    footer
      BackButton(href="/user" smart)
</template>

<style>
  h1 {
    text-align: center;
  }
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

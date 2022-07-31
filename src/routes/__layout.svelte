<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch }) => {
    const backgrounds: string[] = await (await fetch('/backgrounds.json')).json();

    return {
      props: { backgrounds },
      cache: {
        maxage: 1000,
      },
    };
  };
</script>

<script lang="ts">
  import Nav from '@/client/components/Nav.svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { browser } from '$app/env';
  import { paths } from '@/client/stores';
  import { navigating, page } from '$app/stores';
  import { BarLoader } from 'svelte-loading-spinners';
  import Background from './_background.svelte';
  import { base, assets } from '$app/paths'
  import { goto } from '$app/navigation'
  import { user } from '@/client/stores/user'
  import { onMount } from 'svelte';

  const path = $page.url.pathname.slice(1).split('/')

  let notAllowed;

  const logged_in = $user.id != null
  const access = $user.uaccess.toString()

  onMount(() => {
    console.log(path)
    if(path[0] == "admin" && access != "admin"){
      goto("/")
    } else if( !logged_in && path[0] == "schematics" && ( path[1] == "create"  || path[2] == "edit" || path[2] == "edit.json" || path[2] == "delete" || path[2] == "delete.json")){
      goto("/user")
    }
  })

  export let backgrounds: string[];
  $paths;
</script>

<template lang="pug">
  Nav
  +if("browser")
    SvelteToast
    +if("$navigating")
      div.loader
        BarLoader(size=100 unit="vw" duration="30s" color="#ffc933")
  Background({backgrounds})
  +if("!notAllowed")
    slot
</template>

<style>
  :root {
    --toastContainerTop: 5rem;
    --toastContainerRight: 1rem;
  }
  .loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 21;
    height: 0.2rem;
    overflow: hidden;
  }
  :global(._toastItem) {
    border-radius: 0.5rem !important;
  }
  :global(._toastBar) {
    border-radius: 1rem !important;
    overflow: hidden;
  }
</style>

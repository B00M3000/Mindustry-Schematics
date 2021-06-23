<script lang="ts">
  import DiscordLogin from '@/client/components/buttons/DiscordLogin.svelte';
  import { auth } from '@/client/stores/auth';
  let allowTokens = $auth.access.can({ userTokens: { read: 'all', update: 'all' } });
  let allowChanges = $auth.access.can({ schematics: { delete: 'all', update: 'all' } });
  async function logout() {
    await auth.logout();
  }
</script>

<template lang="pug">
  svelte:head
    title User Login
  +if("$auth.uid")
    main
      div.info
        h2 Welcome Back {$auth.name}
        button(on:click!="{logout}") Logout
      +if("allowChanges")
        a.link(href="/admin/schematic_changes")
          button Schematic Changes
    +else
      div.logins        
        DiscordLogin
        

</template>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }
  div.info {
    display: flex;
    justify-content: center;
    gap: 1em;
    align-items: center;
  }
  a.link {
    align-self: center;
  }
  .logins {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
</style>

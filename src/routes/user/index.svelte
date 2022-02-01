<script lang="ts">
  import DiscordLogin from '@/client/components/buttons/DiscordLogin.svelte';
  import { user } from '@/client/stores/user';
  import { Access } from '@/lib/auth/access';
  import { onDestroy } from 'svelte';
  
  user.subscribe(value => {
    user = {
      ...user,
      ...value
    }
  })

  $: allowChanges = user.access ? user.access.can({ schematic: Access.deleteAll | Access.updateAll }) : false;
</script>

<template lang="pug">
  svelte:head
    title User Login
  +if("$user.id")
    main
      div.info
        h2 Welcome Back {$user.name}
      +if("allowChanges")
        a.link(href="/admin/schematic_changes")
          button Schematic Changes
      a.link(href="/user/logout")
        button Logout 
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

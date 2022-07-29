<script lang="ts">
  import DiscordLogin from '@/client/components/buttons/DiscordLogin.svelte';
  import { user } from '@/client/stores/user';
  import { Access } from '@/lib/auth/access';
  import { onDestroy } from 'svelte';

  $: allowChanges = $user.uaccess.can({ schematics: Access.deleteAll | Access.updateAll });
</script>

<template lang="pug">
  svelte:head
    title User Login
  +if("$user.id")
    main
      div.info
        h2 Welcome Back {$user.username}
        img.avatar(src="{$user.avatar_url}" alt="pfp" width="64px" height="64px")
      +if("allowChanges")
        a.link(href="/admin/schematic_changes")
          button Schematic Changes
      a.link(href="/user/{$user.id}")
        button Public Profile 
      a.link(on:click="{user.logout}")
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
  .avatar {
    border-radius: 50%;
  }
</style>
<script lang="ts">
  import DiscordLogin from '@/client/components/buttons/DiscordLogin.svelte';
  import { auth } from '@/client/stores/auth';
  import { Access } from '@/lib/auth/access';
  $: allowUsers = $auth.access.can({ users: Access.readAll | Access.updateAll });
  $: allowChanges = $auth.access.can({ schematics: Access.deleteAll | Access.updateAll });
  let error: string | undefined;

  type FormSubmitEvent = Event & {
    currentTarget: EventTarget & HTMLFormElement;
  };

  function getErrorMessage(e: unknown) {
    if (e instanceof Error) {
      if (e.message.includes('registered')) return 'Token not registered';
    }
    return 'Error during login, try again later';
  }

  async function logout(e: FormSubmitEvent) {
    e.preventDefault();
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
      +if("allowUsers")
        a.link(href="/admin/users")
          button User Panel
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

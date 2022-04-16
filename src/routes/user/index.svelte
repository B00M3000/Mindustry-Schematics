<script lang="ts">
  import DiscordLogin from '@/client/components/buttons/DiscordLogin.svelte';
  //import User from '@/client/components/user/User.svelte';
  import { user } from '@/client/stores/user';
  import { copy } from '@/client/copy'
  import { Access } from '@/lib/auth/access';
  import { onDestroy } from 'svelte';
  import { toast } from '@zerodevx/svelte-toast';

  let form: HTMLFormElement;

  async function syncAvatar() {
    if(user.avatar()) toast.push("Avatar Synced with Discord Sucessfully!")
    else toast.push("Error: Avatar Not Synced")
  }

  async function save(e: Event) {
    e.preventDefault();
    const data = new FormData(form);
    console.log(data)
    console.log(form)
  }

  function copyUserID(){
    copy($user.id)
    toast.push('User ID copied to clipboard!')
  }

  $: allowChanges = $user.access.can({ schematics: Access.deleteAll | Access.updateAll });
  $: adminAccess = $user.access.can({ users: Access.crudAll });
</script>

<template lang="pug">
  svelte:head
    title User Login
  +if("$user.id")
    main
      h2 Welcome Back {$user.name}!
      br
      div.account-settings-outer-container
        div.account-settings-inner-container
          form(bind:this!="{form}" on:submit!="{save}")
            img(src="{$user.avatar}")
            br
            label(for="username") Username 
            input#username(type="text" name="username" value!="{$user.name}") 
            p Account Type: {$user?.access.name == 'none' ? "User" : $user?.access.name == 'mod' ? "Mod" : $user?.access.name == 'admin' ? "Admin" : null }
            button(type="submit") Save
          button(on:click="{copyUserID}") Copy User ID
      +if("allowChanges")
        a.link(href="/admin/schematic_changes")
          button Schematic Changes
      a.link(on:click="{user.logout}")
        button Logout 
    +else
      div.logins        
        DiscordLogin

</template>

<style>
  .account-settings-outer-container {
    margin: 20px auto;
    border: 1.5px solid grey;
    padding: 20px;
    background-color: #262f3d;
    border-radius: 15px;
  }
  .account-settings-inner-container {
    padding: 0px;
    display: inline-block;
  }
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

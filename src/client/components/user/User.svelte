<script lang="ts">
  import { goto } from '$app/navigation';
  import type { UserTokenJSON } from '@/interfaces/json';
  import { Access } from '@/lib/auth/access';
  import { toast } from '@zerodevx/svelte-toast';

  export let data: UserTokenJSON;
  export let user: UserTokenJSON;
  let form: HTMLFormElement;

  $: adminAccess = $user.access.can({ users: Access.crudAll });

  async function syncAvatar() {
    if(user.avatar()) toast.push("Avatar Synced with Discord Sucessfully!")
    else toast.push("Error: Avatar Not Synced")
  }

  async function save(e: Event) {
    e.preventDefault();
    const data = new FormData(form);
    console.log(data)
  }
</script>

<template lang="pug">
  form(bind:this!="{form}" on:submit!="{save}")
    img(src="{data.avatar}")
    input(type="text" name="username" value!="{data.name}") 
    +if("adminAccess")
      select(name="access")
        option(value="none" selected!="{data?.access.name == 'none'}") None
        option(value="mod" selected!="{data?.access.name == 'mod'}") Mod
        option(value="admin" selected!="{data?.access.name == 'admin'}") Admin
    button Save
  //- button(type="button" on:click!="{syncAvatar}") Sync Avatar with Discord //- Only Syncs after Login
  span User ID: {$user.id}
</template>

<style>
  form {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  input {
    font-size: 0.9rem;
    background-color: transparent;
    color: var(--on-surface);
    border: none;
    border-bottom: 2px solid #888888;
  }
  input:focus {
    border-color: var(--primary-light);
  }
  select {
    background-color: var(--surface);
    color: var(--on-surface);
    padding: .5em;
    border: 2px solid #888;
    border-radius: 0.5em;
    font-size: 0.78rem;
  }
</style>
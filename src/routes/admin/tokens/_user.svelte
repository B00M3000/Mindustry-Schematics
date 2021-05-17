<script lang="ts">
  import { goto } from '$app/navigation';

  import { auth } from '@/client/stores/auth';
  import type { UserTokenJSON } from '@/interfaces/json';
  export let users: UserTokenJSON[];
  export let user: UserTokenJSON;
  let token = user.token;
  let form: HTMLFormElement;
  async function deleteToken() {
    await fetch(`/api/admin/tokens/${user.token}`, {
      method: 'DELETE',
    });
    if ($auth.token == user.token) {
      await auth.logout();
      await goto('/user');
    }
    users.splice(users.indexOf(user), 1);
    users = users;
  }
  async function regenerateToken() {
    const response = await fetch('/api/admin/tokens/regenerate', {
      method: 'POST',
    });
    ({ token } = await response.json());
  }
  async function save(e: Event) {
    e.preventDefault();
    const data = new FormData(form);
    const response = await fetch(`/api/admin/tokens/${user.token}`, {
      method: 'POST',
      body: data,
    });

    if ($auth.token == user.token) {
      $auth.name = data.get('username') as string;
      $auth.token = data.get('token') as string;
    }
    if (response.status == 403) await auth.sync();
  }
</script>

<template lang="pug">
  form(bind:this!="{form}" on:submit!="{save}")
    button(type="button" on:click!="{deleteToken}") Delete
    input(type="text" name="username" value!="{user.username}") 
    input(type="text" name="token" value!="{user.token}" readonly)
    select(name="access")
      option(value="admin" selected!="{user.access == 'admin'}") Admin
      option(value="mod" selected!="{user.access == 'mod'}") Mod
    button(type="button" on:click!="{regenerateToken}") Regenerate Token
    button Save
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
    padding: 0.5em;
    border: 2px solid #888;
    border-radius: 0.5em;
    font-size: 0.78rem;
  }
</style>

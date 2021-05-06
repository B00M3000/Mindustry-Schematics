<script lang="ts">
  import { auth } from '@/client/stores/auth';

  type FormSubmitEvent = Event & {
    currentTarget: EventTarget & HTMLFormElement;
  };
  async function login(e: FormSubmitEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    await auth.login(data.get('token') as string);
  }
  async function logout(e: FormSubmitEvent) {
    e.preventDefault();
    await auth.logout();
  }
</script>

<template lang="pug">
  svelte:head
    title User Login
  +if("$auth.token")
    main
      div.info
        h2 Welcome Back {$auth.name}
        button(on:click!="{logout}") Logout
      +if("$auth.isAdmin")
        a.link(href="/admin/tokens")
          button User Tokens
      +if("$auth.isMod")
        a.link(href="/admin/schematic_changes")
          button Schematic Changes
    +else
      form.login(on:submit!="{login}")
        input(name="token" type="password" placeholder="Enter your token here..." required)
        button Login
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
  form.login {
    display: flex;
    padding: 1rem;
    gap: 1rem;
    justify-content: center;
  }
  form.login input {
    background-color: var(--surface);
    border-radius: 0.5em;
    padding: 0.5em;
    border: 2px solid #888888;
    color: var(--on-surface);
    max-width: 50vw;
    width: 15rem;
  }
</style>

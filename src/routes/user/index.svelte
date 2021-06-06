<script lang="ts">
  import { auth } from '@/client/stores/auth';
  $: allowTokens = $auth.access.can({ userTokens: { read: 'all', update: 'all' } });
  $: allowChanges = $auth.access.can({ schematics: { delete: 'all', update: 'all' } });
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
  async function login(e: FormSubmitEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      error = undefined;
      await auth.login(data.get('token') as string);
    } catch (e) {
      error = getErrorMessage(e);
    }
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
      +if("allowTokens")
        a.link(href="/admin/tokens")
          button User Tokens
      +if("allowChanges")
        a.link(href="/admin/schematic_changes")
          button Schematic Changes
    +else
      form.login(on:submit!="{login}")
        +if("error")
          span.error {error}
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
    place-items: center;
    display: grid;
    padding: 1rem;
    gap: 1rem;
    grid-template-columns: 1fr 1fr max-content 1fr;
    grid-template-areas:
      '. error error .'
      '. input button .';
  }
  form.login input {
    grid-area: input;
    background-color: var(--surface);
    border-radius: 0.5em;
    padding: 0.5em;
    border: 2px solid #888888;
    color: var(--on-surface);
    max-width: 50vw;
    width: 15rem;
  }
  form.login button {
    grid-area: button;
  }
  form.login span.error {
    grid-area: error;
    color: hsl(0, 100%, 65%);
  }
</style>

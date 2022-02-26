<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch, session }) => {
    const access = UserAccess.from(session.access);
    if (!access.can({ userTokens: Access.crudAll }))
      return {
        props: {
          redirect: '/user',
        },
      };
    const response = await fetch('tokens.json');
    const users = await response.json();

    return {
      props: {
        users,
      },
    };
  };
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { UserTokenJSON } from '@/interfaces/json';
  import User from './_user.svelte';
  import { auth } from '@/client/stores/auth';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import { Access, UserAccess } from '@/lib/auth/access';
  export let redirect: string | null = null;
  export let users: UserTokenJSON[] = [];
  const allowed = redirect == null;
  onMount(() => {
    if (redirect) goto(redirect);
  });
  async function createToken() {
    const response = await fetch('regenerate.json', {
      method: 'POST',
    });
    const { token } = await response.json();
    users = [
      {
        access: 'mod',
        token,
        username: '',
      },
      ...users,
    ];
  }
</script>

<template lang="pug">
  svelte:head
    title User Tokens
  +if("allowed")
    h2 User Tokens
    ul.users
      button(on:click!="{createToken}") Create Token
      +each("users as user")
        li
          User({user} bind:users)
  footer
    BackButton(href="/user" smart)
</template>

<style>
  h2 {
    margin: 1rem;
    text-align: center;
  }
  ul.users {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
    padding: 1rem;
    gap: 1.5rem;
  }
  ul.users li {
    background-color: var(--surface);
    padding: 0.7rem;
    border-radius: 1rem;
  }
</style>

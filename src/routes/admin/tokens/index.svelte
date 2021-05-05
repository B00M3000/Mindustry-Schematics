<script context="module" lang="ts">
  import type { Session } from '@/interfaces/app';

  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch, session }) => {
    const { isAdmin } = session as Session;
    if (!isAdmin)
      return {
        props: {
          redirect: '/user',
        },
      };
    const response = await fetch('/api/admin/tokens');
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
  export let redirect: string | null = null;
  export let users: UserTokenJSON[] = [];
  onMount(() => {
    if (redirect) goto(redirect);
  });
  async function createToken() {
    users = [
      {
        access: 'mod',
        token: (
          await (
            await fetch('/api/admin/tokens/regenerate', {
              method: 'POST',
            })
          ).json()
        ).token,
        username: '',
      },
      ...users,
    ];
  }
</script>

<template lang="pug">
  svelte:head
    title User Tokens
  +if("$auth.isAdmin")
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

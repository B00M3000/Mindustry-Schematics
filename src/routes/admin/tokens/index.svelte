<script context="module" lang="ts">
  import type { Session } from '@/interfaces/app';

  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch, session }) => {
    const access = UserAccess.from((session as Session).access);
<<<<<<< HEAD
    if (
      !access.can({
        userTokens: {
          create: 'all',
          delete: 'all',
          read: 'all',
          update: 'all',
        },
      })
    )
=======
    if (!access.can({ userTokens: Access.crudAll }))
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
      return {
        props: {
          redirect: '/user',
        },
      };
<<<<<<< HEAD
    const response = await fetch('/api/admin/tokens');
=======
    const response = await fetch('/api/admin/tokens.json');
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
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
<<<<<<< HEAD
  import { UserAccess } from '@/lib/auth/access';
=======
  import { Access, UserAccess } from '@/lib/auth/access';
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
  export let redirect: string | null = null;
  export let users: UserTokenJSON[] = [];
  const allowed = redirect == null;
  onMount(() => {
    if (redirect) goto(redirect);
  });
  async function createToken() {
<<<<<<< HEAD
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
=======
    const response = await fetch('/api/admin/tokens/regenerate.json', {
      method: 'POST',
    });
    const { token } = await response.json();
    users = [
      {
        access: 'mod',
        token,
>>>>>>> cb8a27bdf582bbd579d9194b97b2cadb7427de96
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

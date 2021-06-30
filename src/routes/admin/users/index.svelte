<script context="module" lang="ts">
  import type { Session } from '@/interfaces/app';
  import type { UserSearchJSON } from '@/interfaces/json';
  import { UserAccess } from '@/lib/auth/access';
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ context, fetch, session, page }) => {
    const s = session as Session;
    const access = UserAccess.from(s.access);
    if (!access.can({ users: { read: 'all', update: 'all', delete: 'all' } }))
      return {
        status: 303,
        redirect: '/user',
      };
    const response = await fetch(`/api/admin/users?${page.query}`);
    const json = await response.json();
    return {
      props: {
        data: json,
      },
    };
  };
</script>

<script lang="ts">
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import Card from './_card.svelte';

  export let data: UserSearchJSON;
</script>

<template lang="pug">
  form.search
    label(for="tag") Tag: 
    input#tag(type="text")
  ul.result
    +each("data.users as user")
      Card({user})    

  footer
    BackButton(href="/user" smart)
</template>

<style>
  ul.result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5em;
  }
</style>

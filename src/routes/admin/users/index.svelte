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
        query: page.query,
      },
    };
  };
</script>

<script lang="ts">
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import Card from './_card.svelte';
  import { goto } from '$app/navigation';
  export let data: UserSearchJSON;
  export let query: URLSearchParams;
  async function search(e: Event) {
    e.preventDefault();
    let form = e.currentTarget as HTMLFormElement;
    let formData = new FormData(form);
    let tag = formData.get('tag');
    let url = '/admin/users';
    if (tag) {
      url += `?tag=${tag}`;
    }
    await goto(url);
  }
</script>

<template lang="pug">
  form.search(on:submit!="{search}")
    label(for="tag") Tag: 
    input#tag(type="text" name="tag" value!="{query.get('tag')}")
    button Search

  ul.result
    +each("data.users as user")
      Card({user})    
      +else
        span No results
  footer
    BackButton(href="/user" smart)
</template>

<style>
  form.search {
    margin: 1em 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    padding: 0 1rem;
    z-index: 10;
    flex-wrap: wrap;
  }
  ul.result {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1.5em;
    padding: 0 1rem;
  }
</style>

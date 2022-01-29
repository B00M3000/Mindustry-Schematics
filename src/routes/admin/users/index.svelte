<script context="module" lang="ts">
  import type { Session } from '@/interfaces/app';
  import type { UserSearchJSON } from '@/interfaces/json';
  import { Access, UserAccess } from '@/lib/auth/access';
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ context, fetch, session, page }) => {
    const s = session as Session;
    const access = UserAccess.from(s.access);
    if (!access.can({ users: Access.readAll | Access.updateAll | Access.deleteAll }))
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
  import Paginator from './_paginator.svelte';
  export let data: UserSearchJSON;
  export let query: URLSearchParams;
  async function search(e: Event) {
    e.preventDefault();
    let form = e.currentTarget as HTMLFormElement;
    let formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((value, key) => params.append(key, value as string));
    // validotion
    if (!params.get('tag')) params.delete('tag');
    if (!params.get('verified')) params.delete('verified');
    let url = '/admin/users';
    if (params.toString()) url += `?${params}`;
    await goto(url);
  }
  async function changePage(e: CustomEvent<{ page: number }>) {
    const { page } = e.detail;
    const params = new URLSearchParams(location.search);
    if (page == 1) params.delete('page');
    else params.set('page', page.toString());
    let url = location.pathname;

    if (params.toString()) url += `?${params}`;
    await goto(url);
  }
</script>

<template lang="pug">
  svelte:head
    title User Panel
  form.search(on:submit!="{search}")
    div.field
      label(for="tag") Tag
      input#tag(type="text" name="tag" placeholder="User tag" value!="{query.get('tag')}")
    div.field
      label(for="verified") Verification
      select#verified(name="verified")
        option(value="") Any
        option(value="true") Verified
        option(value="false") Not verified
    button Search
  ul.result
    +each("data.users as user")
      Card({user})    
      +else
        span No results
  +if("data.users.length > 0")
    div.pages
      Paginator(
        class="paginator"
        pages!="{data.pages}"
        page!="{data.page}"
        on:change!="{changePage}"
      )
  footer
    BackButton(href="/user" smart)
</template>

<style>
  form.search {
    margin: 1em 0;
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 1em;
    padding: 0 1rem;
    z-index: 10;
    flex-wrap: wrap;
  }
  .field {
    display: inline-flex;
    flex-direction: column;
    border-radius: 0.5em;
    background-color: var(--surface);
    justify-content: space-between;
  }
  .field > label {
    font-size: 0.8em;
    margin: 0.2em 0 0 0.5em;
    /* margin-left: 0.5em; */
    order: -1;
  }
  .field > *:not(label) {
    border: none;
    border-bottom: 2px solid #808080;
    background-color: var(--surface);
    color: var(--on-surface);
    border-radius: 0.6em;
    padding: 0.2em;
  }
  .field input {
    padding-left: 0.5em;
  }
  form > button {
    align-self: center;
  }
  ul.result {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1.5em;
    padding: 0 1rem;
    margin-bottom: 2rem;
  }
  .pages {
    display: flex;
    justify-content: center;
  }
  .pages :global(.paginator) {
    width: max-content;
  }
</style>

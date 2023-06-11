<script lang="ts">
  import UserAvatar from '@/client/components/UserAvatar.svelte';
  import SchematicCard from '@/client/components/SchematicCard.svelte';
  import type { PageData } from './$types';
  import { user } from '@/client/stores/user';
  import BackButton from '@/client/components/buttons/BackButton.svelte';
  import PaginationBar from '@/client/components/PaginationBar.svelte';
  import { page } from '$app/stores';

  export let data: PageData;

  function pageLink(pageNumber: number) {
    const url = new URL($page.url);
    url.searchParams.set('page', pageNumber.toString());
    // $page.
    return url.toString();
  }
</script>

<svelte:head>
  <title>User Profile</title>
</svelte:head>

<template>
  <main>
    <div class="user-card">
      {#await user.get(data.user_id)}
        <span>Loading...</span>
        <UserAvatar />
      {:then user}
        {#if user}
          <span class="card-username">{user.username}</span>
          <UserAvatar {...user} />
        {/if}
      {/await}
    </div>
    <ul id="schematics_result">
      {#each data.profile.schematics as schematic (schematic._id)}
        <li>
          <SchematicCard {schematic} />
        </li>
      {:else}
        <p>No schematics found for this user</p>
      {/each}
    </ul>
  </main>
  <PaginationBar
    page={data.profile.page}
    pages={data.profile.pages}
    {pageLink}
    --bottom-bar-height="4rem"
  >
    <BackButton slot="bottom_bar_middle" href="/user" smart />
  </PaginationBar>
</template>

<style>
  ul#schematics_result {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 0.5rem;
    justify-content: center;
    list-style: none;
  }
  main {
    padding: 0 5% 2rem 5%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .user-card {
    display: inline-flex;
    background-color: var(--surface);
    border-radius: 25px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 21px;
    padding-right: 42px;
    margin: 25px;

    /* Used by the UserAvatar */
    --image-size: 6em;
  }
  .card-username {
    font-size: 36px;
    margin: 21px;
  }

  @media screen and (max-width: 600px) {
    .card-username {
      font-size: 18px;
      margin: 21px;
    }

    .user-card {
      border-radius: 15px;
      padding: 10.5px;
      padding-right: 21px;
      margin: 15px;

      /* Used by the UserAvatar */
      --image-size: min(100%, 4em);
    }
  }
</style>

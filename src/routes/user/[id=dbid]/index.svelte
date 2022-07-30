<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch, params }) => {
    return {
      props: { user_id: params.id },
    };
  };
</script>

<script lang="ts">
  import UserAvatar from '@/client/components/UserAvatar.svelte';
  import { user } from '@/client/stores/user';

  export let user_id: string;
</script>

<svelte:head>
  <title>User Profile</title>
</svelte:head>

<template>
  <main>
    <div class="user-card">
      {#await user.get(user_id)}
        <span>Loading...</span>
        <img class="avatar" src="/assets/discord_default_avatar.png" alt="user avatar" />
      {:then user}
        {#if user}
          <span class="card-username">{user.username}</span>
          <UserAvatar {...user} --image-size="128px" />
        {/if}
      {/await}
    </div>
    <p>Additional information will be added at a future time!</p>
  </main>
  <!-- AuthorCard(creator_id!="{user_id}") -->
</template>

<style>
  main {
    padding: 20%;
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
  }
  .card-username {
    font-size: 36px;
    margin: 21px;
  }
  .avatar {
    width: 128px;
    border-radius: 50%;
  }
</style>

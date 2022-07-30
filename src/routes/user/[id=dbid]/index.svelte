<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch, params }) => {
    return {
      props: { user_id: params.id },
    };
  };
</script>

<script lang="ts">
  import AuthorCard from '@/client/components/AuthorCard.svelte';
  import { user } from '@/client/stores/user';

  export let user_id: string;
</script>

<template>
  <svelte:head>
    <title>User Profile</title>
  </svelte:head>
  
  <main>
    <div class="user-card">
      {#await user.get(user_id)}
          <span>Loading...</span>
          <img class="avatar" src="/assets/discord_default_avatar.png"/>
      {:then user}
          <span class="card-username">{user.username}</span>
          <div class="avatar-container">
              <img src="{user.avatar_url}"/>
              {#if user.verified}
                  <img src="/assets/verified.svg" class="icon verified"/>
              {/if}
              {#if user.access}
                  {#if user.access == "mod"}
                      <img src="/assets/mod.svg" class="icon access mod"/>
                  {/if}
                  {#if user.access == "admin"}
                      <img src="/assets/admin.svg" class="icon access"/>
                  {/if}
              {/if}
          </div>
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

  .avatar-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 128px;
  }
  
  .mod {
      filter: hue-rotate(200);
  }

  .icon {
      width: 36px;
  }

  .verified {
      position: absolute;
      top: 3px;
      right: 0px;
  }

  .access {
      position: absolute;
      top: 100px;
      right: 0px;
  }
</style>
<script lang="ts">
  import { user } from '@/client/stores/user';
  import { Access, UserAccess } from '@/lib/auth/access';
  import type { PageData } from './$types';

  export let data: PageData;

  let url = `/user/login${data.redirect ? `?redirect=${data.redirect}` : ''}`;

  $: allowChanges = $user.access.can({
    schematics: Access.deleteAll | Access.updateAll,
  });

  const savedDescription = $user.description || ""
  let descriptionValue = ""
  $: changed = savedDescription != descriptionValue;
</script>

<svelte:head>
  <title>User Login</title>
</svelte:head>

<!-- svelte-ignore a11y-missing-attribute -->
<template>
  {#if $user.id}
  <main>
    <div class="info">
      <h2>Welcome Back {$user.username}</h2>
      <img class="avatar" src="{$user.avatar_url}" alt="pfp" width="64px" height="64px" />
    </div>
    <div class="description-editor">
      <textarea bind:value={descriptionValue}/>
      {#if changed}
      <a class="link">
        <button on:click={() => fetch('/user/description.json', { method: "POST", body: JSON.stringify({ description: descriptionValue })})}>Save</button>
      </a>
      {/if}
    </div>
    {#if allowChanges}
    <a class="link" href="/admin/schematic_changes">
      <button>Schematic Changes</button>
    </a>
    <a class="link" href="/users">
      <button>Manage Users</button>
    </a>
    {:else}
    <a class="link" href="/users">
      <button>View Users</button>
    </a>
    {/if}
    <a class="link" href="/user/{$user.id}">
      <button>Public Profile</button>
    </a>
    <a class="link" on:click="{user.logout}">
      <button>Logout</button>
    </a>
  </main>
  {:else}
  <div class="logins">
    <a href={url}>
      <button class="discord">
        <img src="/assets/discord_logo_white.png" width="40px" height="40px" alt="discord logo" />
        <p>Login with Discord</p>
      </button>
    </a>
  </div>
  {/if}
</template>

<style>
  .description-editor {
    display: flex;
    flex-direction: column;
    margin: 0 25%;
    gap: 0.2em;
  }
  img {
    vertical-align: middle;
    float: left;
  }
  p {
    font-size: 17px;
    font-weight: bold;
    color: white;
  }
  .discord {
    display: inline-flex;
    justify-content: space-evenly;
    align-items: center;
    width: 300px;
    height: 50px;
    background: #738adb;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    line-height: 25px;
    border: none;
  }
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
  .logins {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .avatar {
    border-radius: 50%;
  }
</style>

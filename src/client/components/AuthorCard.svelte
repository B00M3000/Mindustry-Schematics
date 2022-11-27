<script lang="ts">
  import { user } from '../stores/user';
  import UserAvatar from './UserAvatar.svelte';

  export let creator_id: string;
</script>

<a href="/user/{creator_id}">
  <div class="container">
    {#await user.get(creator_id)}
      <span>Loading...</span>
      <img src="/assets/discord_default_avatar.png" alt="user avatar" />
    {:then user}
      {#if user}
        <span>{user.username}</span>
        <UserAvatar {...user} />
      {:else}
        <span>Not Found</span>
        <img src="/assets/discord_default_avatar.png" alt="user avatar" />
      {/if}
    {/await}
  </div>
</a>

<style>
  a {
    display: contents;
  }
  .container {
    display: inline-flex;
    background-color: var(--surface);
    border-radius: 25px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 7px;
    padding-right: 14px;
  }
  span {
    margin: 7px;
  }
  img {
    width: 32px;
    border-radius: 50%;
  }
</style>

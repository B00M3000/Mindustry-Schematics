<script lang="ts">
  import UserIcon from './UserIcon.svelte';

  export let uid: string;
  // promise with the user json data
  const userPromise = fetch(`/user/discord/${uid}`).then((res) => res.json());
</script>

<template>
  {#await userPromise then user}
    <UserIcon avatar_url={user.avatar_url} />
    <p>{user.tag}</p>
  {/await}
</template>

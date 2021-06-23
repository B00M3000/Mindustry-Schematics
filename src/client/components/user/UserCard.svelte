<script lang='ts'>
  export let uid: string;
  
  const user = await fetch(`/user/discord/${uid}`)
  
</script>

<template>
  <UserIcon avatar_url={user.avatar_url}>
  <p>{user.tag}</p>
</template>